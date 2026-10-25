import fs from 'fs/promises';
import path from 'path';

interface CommitFileParams {
  filePath: string; // relative to repo root, e.g. "src/data/siteContent.json"
  content: string; // raw utf-8 string content or base64
  isBase64?: boolean;
  commitMessage: string;
}

export async function saveFileToRepo({
  filePath,
  content,
  isBase64 = false,
  commitMessage
}: CommitFileParams): Promise<{ success: boolean; message: string; method: 'local' | 'github' | 'both' }> {
  let savedLocally = false;
  let committedToGithub = false;

  // 1. In local environment or if local disk is writable, write to disk
  try {
    const fullLocalPath = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
    const parentDir = path.dirname(fullLocalPath);
    await fs.mkdir(parentDir, { recursive: true });

    if (isBase64) {
      const buffer = Buffer.from(content, 'base64');
      await fs.writeFile(fullLocalPath, buffer);
    } else {
      await fs.writeFile(fullLocalPath, content, 'utf-8');
    }
    savedLocally = true;
  } catch (err) {
    console.warn('Local file write skipped or failed (common in serverless):', err);
  }

  // 2. If GitHub environment variables are configured, commit via GitHub REST API
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'AbBramha';
  const repo = process.env.GITHUB_REPO_NAME || 'Lovesh-Garg';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (token) {
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      
      // Get current file SHA if it already exists
      let sha: string | undefined = undefined;
      const getResp = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Nidhivan-Studio-CMS'
        },
        cache: 'no-store'
      });

      if (getResp.ok) {
        const fileData = await getResp.json();
        sha = fileData.sha;
      }

      // Convert content to Base64 if not already
      const base64Content = isBase64 ? content : Buffer.from(content, 'utf-8').toString('base64');

      const putResp = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Nidhivan-Studio-CMS'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          branch,
          ...(sha ? { sha } : {})
        })
      });

      if (!putResp.ok) {
        const errorData = await putResp.text();
        console.error('GitHub API commit error:', putResp.status, errorData);
        if (!savedLocally) {
          throw new Error(`GitHub commit failed (${putResp.status}): ${errorData}`);
        }
      } else {
        committedToGithub = true;
      }
    } catch (gitErr: any) {
      console.error('GitHub API error:', gitErr);
      if (!savedLocally) {
        return { success: false, message: gitErr.message || 'Failed to save to GitHub', method: 'github' };
      }
    }
  }

  if (savedLocally && committedToGithub) {
    return { success: true, message: 'Saved locally and committed to GitHub', method: 'both' };
  } else if (committedToGithub) {
    return { success: true, message: 'Committed to GitHub repository', method: 'github' };
  } else if (savedLocally) {
    return { success: true, message: 'Saved to local workspace', method: 'local' };
  } else {
    return { success: false, message: 'Could not save file to local disk or GitHub', method: 'local' };
  }
}

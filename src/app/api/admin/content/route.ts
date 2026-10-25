import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { saveFileToRepo } from '@/lib/github';
import siteContentDefault from '@/data/siteContent.json';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nidhivan_admin_session');
  return session && session.value === 'authenticated';
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fullPath = path.join(process.cwd(), 'src/data/siteContent.json');
    const data = await fs.readFile(fullPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(siteContentDefault);
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedContent = await req.json();
    const formattedJson = JSON.stringify(updatedContent, null, 2);

    const result = await saveFileToRepo({
      filePath: 'src/data/siteContent.json',
      content: formattedJson,
      commitMessage: 'Update site content via Nidhivan Admin Panel'
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

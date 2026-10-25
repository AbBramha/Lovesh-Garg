import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { saveFileToRepo } from '@/lib/github';
import projectsDefault from '@/data/projects.json';

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
    const fullPath = path.join(process.cwd(), 'src/data/projects.json');
    const data = await fs.readFile(fullPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(projectsDefault);
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedProjects = await req.json();
    const formattedJson = JSON.stringify(updatedProjects, null, 2);

    const result = await saveFileToRepo({
      filePath: 'src/data/projects.json',
      content: formattedJson,
      commitMessage: 'Update portfolio projects via Nidhivan Admin Panel'
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

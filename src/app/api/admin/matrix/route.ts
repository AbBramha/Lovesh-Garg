import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { saveFileToRepo } from '@/lib/github';
import defaultMatrixData from '@/data/designMatrix.json';

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
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'src/data/designMatrix.json');
    const data = await fs.readFile(fullPath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(defaultMatrixData);
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedMatrix = await req.json();
    const formattedJson = JSON.stringify(updatedMatrix, null, 2);

    const result = await saveFileToRepo({
      filePath: 'src/data/designMatrix.json',
      content: formattedJson,
      commitMessage: 'Update Design Matrix quiz questions and visuals via Admin Panel'
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

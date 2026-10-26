import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { saveFileToRepo } from '@/lib/github';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nidhivan_admin_session');
  return session && session.value === 'authenticated';
}

const getFilePath = () => path.join(process.cwd(), 'src/data/inquiries.json');

async function readInquiries(): Promise<any[]> {
  try {
    const data = await fs.readFile(getFilePath(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inquiries = await readInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, inquiryId, status } = body;
    let inquiries = await readInquiries();

    if (action === 'update_status') {
      inquiries = inquiries.map((inq: any) => {
        if (inq.id === inquiryId) {
          return { ...inq, status: status || 'contacted' };
        }
        return inq;
      });
    } else if (action === 'delete') {
      inquiries = inquiries.filter((inq: any) => inq.id !== inquiryId);
    } else if (action === 'clear_all') {
      inquiries = [];
    } else {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    const formattedJson = JSON.stringify(inquiries, null, 2);
    await fs.writeFile(getFilePath(), formattedJson, 'utf-8');

    try {
      await saveFileToRepo({
        filePath: 'src/data/inquiries.json',
        content: formattedJson,
        commitMessage: `Admin updated inquiry status (${action})`
      });
    } catch (gitErr) {
      console.warn('Git sync skipped for inquiry update:', gitErr);
    }

    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

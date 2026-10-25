import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveFileToRepo } from '@/lib/github';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nidhivan_admin_session');
  return session && session.value === 'authenticated';
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');

    // Clean safe filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${cleanName}`;
    const filePath = `public/uploads/${fileName}`;

    const saveResult = await saveFileToRepo({
      filePath,
      content: base64Content,
      isBase64: true,
      commitMessage: `Upload asset ${fileName} via Admin Panel`
    });

    if (!saveResult.success) {
      return NextResponse.json(saveResult, { status: 500 });
    }

    // Public URL path
    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      method: saveResult.method
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

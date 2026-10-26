import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'loveshgarg@gmail.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nidhivan2026';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const isEmailValid = email && email.toLowerCase().trim() === DEFAULT_ADMIN_EMAIL.toLowerCase().trim();
    const isPasswordValid = password === DEFAULT_ADMIN_PASSWORD;

    if (isEmailValid && isPasswordValid) {
      const cookieStore = await cookies();
      cookieStore.set('nidhivan_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return NextResponse.json({ success: true, message: 'Authenticated successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid studio email or passcode' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('nidhivan_admin_session');

  if (session && session.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('nidhivan_admin_session');
  return NextResponse.json({ success: true, message: 'Logged out' });
}

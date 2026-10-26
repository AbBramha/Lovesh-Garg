import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { saveFileToRepo } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name, email, and project message.' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'src/data/inquiries.json');
    let inquiries: any[] = [];

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      inquiries = JSON.parse(data);
    } catch {
      inquiries = [];
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : '',
      message: String(message).trim(),
      status: 'new'
    };

    // Prepend so newest is first
    const updatedInquiries = [newInquiry, ...inquiries];
    const formattedJson = JSON.stringify(updatedInquiries, null, 2);

    // Write to local disk
    await fs.writeFile(filePath, formattedJson, 'utf-8');

    // Sync to GitHub repository if credentials exist
    try {
      await saveFileToRepo({
        filePath: 'src/data/inquiries.json',
        content: formattedJson,
        commitMessage: `New inquiry from ${newInquiry.name} via website form`
      });
    } catch (gitErr) {
      // Local disk saved; proceed without failing user submission
      console.warn('Git sync skipped for inquiry:', gitErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: newInquiry.id
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error processing inquiry' },
      { status: 500 }
    );
  }
}

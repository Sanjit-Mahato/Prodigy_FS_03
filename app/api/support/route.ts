import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SupportTicket from '@/lib/models/SupportTicket';

// POST /api/support - Create a support ticket
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    await dbConnect();

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required: name, email, subject, and message.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Create support ticket
    const ticketData: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
    };

    if (session?.user?.id) {
      ticketData.userId = session.user.id;
    }

    const ticket: any = await SupportTicket.create(ticketData);

    return NextResponse.json(
      {
        message: 'Support ticket submitted successfully. Our team will respond within 24-48 hours.',
        ticketId: ticket._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json(
      { error: 'Failed to submit support ticket. Please try again.' },
      { status: 500 }
    );
  }
}

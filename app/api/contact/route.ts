import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}

export async function POST(request: Request) {
  try {
    const { purpose, name, email, subject, message } = await request.json();

    if (!purpose || !name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: { purpose, name, email, subject, message },
    });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "JaehKim Research <onboarding@resend.dev>",
        to: adminEmail,
        subject: `[Contact] ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1E293B; margin-bottom: 24px;">New Contact Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; color: #64748B; font-size: 14px; width: 100px;">Purpose</td>
                <td style="padding: 8px 12px; color: #1E293B; font-size: 14px;">${purpose}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #64748B; font-size: 14px;">Name</td>
                <td style="padding: 8px 12px; color: #1E293B; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #64748B; font-size: 14px;">Email</td>
                <td style="padding: 8px 12px; color: #1E293B; font-size: 14px;"><a href="mailto:${email}" style="color: #F47920;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #64748B; font-size: 14px;">Subject</td>
                <td style="padding: 8px 12px; color: #1E293B; font-size: 14px;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
              <p style="color: #64748B; font-size: 12px; margin: 0 0 8px 0;">Message</p>
              <p style="color: #1E293B; font-size: 14px; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">
              ID: ${inquiry.id} · ${new Date().toISOString()}
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

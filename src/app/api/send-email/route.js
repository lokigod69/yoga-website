import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, date, time } = data;

    // Format the date
    const bookingDate = new Date(date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Email to studio owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.STUDIO_EMAIL, // The studio's email address
      subject: 'New Yoga Class Booking',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Student Name:</strong> ${name}</p>
        <p><strong>Student Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
      `,
    };

    // Confirmation email to student
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Yoga Class Booking Confirmation',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for booking a yoga class with us. Here are your booking details:</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Please arrive 10 minutes before your class starts. Don't forget to bring:</p>
        <ul>
          <li>Yoga mat (or you can rent one from us)</li>
          <li>Water bottle</li>
          <li>Comfortable clothing</li>
        </ul>
        <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
        <p>We look forward to seeing you!</p>
        <p>Namaste 🙏</p>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(confirmationMailOptions)
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Booking confirmation sent successfully' 
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

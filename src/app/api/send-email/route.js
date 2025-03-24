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
    const { name, email, date, time, numberOfPeople, isContactForm, subject, message } = data;

    // Check if this is a contact form submission
    if (isContactForm) {
      const contactMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.STUDIO_EMAIL || 'yogarona@gmail.com',
        subject: subject || 'New Contact Form Submission',
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Session Type:</strong> ${subject || 'Not specified'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };

      await transporter.sendMail(contactMailOptions);

      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });
    }

    // Format the date
    const bookingDate = new Date(date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get formatted time display
    const getFormattedTime = (timeSlot) => {
      if (timeSlot === 'morning') {
        return '10:00 - 11:00 AM';
      } else if (timeSlot === 'evening') {
        return '5:00 - 6:00 PM';
      } else {
        return timeSlot; // Return as is if not recognized
      }
    };

    // Email to studio owner
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.STUDIO_EMAIL || 'yogarona@gmail.com',
      subject: 'New Yoga Class Booking',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Student Name:</strong> ${name}</p>
        <p><strong>Student Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${getFormattedTime(time)}</p>
        <p><strong>Number of People:</strong> ${numberOfPeople}</p>
      `,
    };

    // Confirmation email to student
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Yoga Class Booking Confirmation',
      html: `
        <h2>Yoga Class Booking Confirmation</h2>
        <p>Hello ${name},</p>
        <p>Thank you for booking with us. Here are your booking details:</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${getFormattedTime(time)}</p>
        <p><strong>Location:</strong> Eagles Nest, Biking, Dauis, Bohol</p>
        <p><strong>Price:</strong> Php 350.00</p>
        <p></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Number of People:</strong> ${numberOfPeople}</p>
        <p></p>
        <p>Yogarona has a flexible cancellation policy. Just let us know before class starts so we can offer the spot to someone else.</p>
        <p></p>
        <p>We look forward to seeing you!</p>
        <p>Namaste</p>
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

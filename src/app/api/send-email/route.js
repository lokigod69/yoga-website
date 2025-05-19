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
    // Destructure all possible fields, including isContactForm
    const { name, email, date, dayLabel, time, numberOfPeople, 
            contactName, contactEmail, contactSessionType, contactMessage, 
            isContactForm } = data;

    if (isContactForm) { // Check the flag first
      // Logic for Contact Form Submission
      const mailOptionsToOwner = {
        from: process.env.EMAIL_USER || 'yogarona.fit@gmail.com',
        to: process.env.EMAIL_TO || 'yogarona.fit@gmail.com', // Admin/Studio email
        subject: `Yoga Website Contact: ${contactSessionType || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #9370DB; text-align: center; margin-bottom: 20px;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${contactEmail}</p>
            <p><strong>Session Type:</strong> ${contactSessionType || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${contactMessage}</p>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>Eagles Nest, Biking, Dauis, Bohol</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptionsToOwner);
      
      // Send confirmation email to the customer who submitted the contact form
      const customerConfirmationOptions = {
        from: process.env.EMAIL_USER || 'yogarona.fit@gmail.com',
        to: contactEmail, // Customer's email from the contact form
        subject: 'Thank you for your inquiry!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #9370DB; text-align: center; margin-bottom: 20px;">Inquiry Received</h2>
            <p>Hello ${contactName || 'there'},</p>
            <p>Thank you for reaching out to us. We have received your message and will contact you shortly.</p>
            ${contactMessage ? `<p style="margin-top: 15px; padding-top:15px; border-top:1px solid #eee;"><strong>Your message:</strong></p><p style=\"background-color: #f9f9f9; padding: 10px; border-radius: 5px;\">${contactMessage}</p>` : ''}
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #9370DB; font-style: italic;">Namaste 🙏</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(customerConfirmationOptions);
      
      return NextResponse.json({ success: true, message: 'Contact form submitted successfully' });
    } else {
      // Logic for Booking Submission (original logic)
      const getFormattedTime = (timeValue) => {
        if (timeValue === 'morning') return '10:00 - 11:00 AM';
        if (timeValue === 'evening') return '5:00 - 6:00 PM';
        return timeValue;
      };
      const formattedTime = getFormattedTime(time);
      
      const mailOptionsToOwner = {
        from: process.env.EMAIL_USER || 'yogarona.fit@gmail.com',
        to: process.env.EMAIL_TO || 'yogarona.fit@gmail.com',
        subject: `New Yoga Session Booking from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #9370DB; text-align: center; margin-bottom: 20px;">New Yoga Session Booking</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Day:</strong> ${dayLabel}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Number of People:</strong> ${numberOfPeople}</p>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>Eagles Nest, Biking, Dauis, Bohol</p>
            </div>
          </div>
        `
      };
      await transporter.sendMail(mailOptionsToOwner);
      
      const customerBookingConfirmation = {
        from: process.env.EMAIL_USER || 'yogarona.fit@gmail.com',
        to: email,
        subject: 'Your Yoga Session Booking is Confirmed!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #9370DB; text-align: center; margin-bottom: 20px;">Booking Confirmation</h2>
            <p>Hello ${name},</p>
            <p>Your yoga session has been successfully booked!</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Day:</strong> ${dayLabel}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Location:</strong> Eagles Nest, Biking, Dauis, Bohol</p>
              <p><strong>Number of People:</strong> ${numberOfPeople}</p>
            </div>
            <p>We are looking forward to having you in our yoga practice.</p>
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #9370DB; font-style: italic;">Namaste 🙏</p>
            </div>
          </div>
        `
      };
      await transporter.sendMail(customerBookingConfirmation);
      
      return NextResponse.json({ success: true, message: 'Booking successful' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

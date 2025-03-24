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
    const { name, email, date, dayLabel, time, numberOfPeople, contactName, contactEmail, contactSessionType, contactMessage } = data;

    // Check if this is a contact form submission
    if (contactName && contactEmail && contactMessage) {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'yoga-rona@gmail.com',
        to: process.env.EMAIL_TO || 'yoga-rona@gmail.com',
        subject: `Yoga Website Contact: ${contactSessionType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #9370DB; text-align: center; margin-bottom: 20px;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${contactName}</p>
            <p><strong>Email:</strong> ${contactEmail}</p>
            <p><strong>Session Type:</strong> ${contactSessionType}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${contactMessage}</p>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>Eagles Nest, Biking, Dauis, Bohol</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      // Send confirmation email to the customer
      const customerOptions = {
        from: process.env.EMAIL_USER || 'yoga-rona@gmail.com',
        to: contactEmail,
        subject: 'Your inquiry has been received!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #9370DB; text-align: center; margin-bottom: 20px;">Thank You for Contacting Us!</h2>
            <p>Hello ${contactName},</p>
            <p>We have received your inquiry about ${contactSessionType}. We will get back to you as soon as possible.</p>
            <p>Your message:</p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${contactMessage}</p>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #9370DB; font-style: italic;">Namaste 🙏</p>
              <p>Eagles Nest, Biking, Dauis, Bohol</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(customerOptions);
      
      return NextResponse.json({ success: true, message: 'Contact form submitted successfully' });
    }

    // Get the formatted time string based on selected time
    const getFormattedTime = (timeValue) => {
      if (timeValue === 'morning') return '10:00 - 11:00 AM';
      if (timeValue === 'evening') return '5:00 - 6:00 PM';
      return timeValue; // Return the original if not found
    };
    
    const formattedTime = getFormattedTime(time);
    
    // Send email to yourself (the studio owner)
    const mailOptions = {
      from: process.env.EMAIL_USER || 'yoga-rona@gmail.com',
      to: process.env.EMAIL_TO || 'yoga-rona@gmail.com',
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
    
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to the customer
    const customerOptions = {
      from: process.env.EMAIL_USER || 'yoga-rona@gmail.com',
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
          <p>Please arrive 10 minutes before the session starts, wear comfortable clothing, and bring your own mat if you have one.</p>
          <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9370DB; font-style: italic;">Namaste 🙏</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(customerOptions);
    
    return NextResponse.json({ success: true, message: 'Booking successful' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

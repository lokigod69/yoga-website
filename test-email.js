// Test script for email functionality
require('dotenv').config(); // Load environment variables

const nodemailer = require('nodemailer');

console.log('Testing email configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('STUDIO_EMAIL:', process.env.STUDIO_EMAIL);
// Don't log the password for security reasons

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

// Test booking data
const testBooking = {
  name: "Test User",
  email: "ronalyncruz020@gmail.com", // Test recipient email
  date: new Date().toISOString(),
  time: "morning",
  numberOfPeople: "3" // Testing with 3 people
};

// Format the date
const bookingDate = new Date(testBooking.date);
const formattedDate = bookingDate.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Email to studio owner
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.STUDIO_EMAIL, // This should now be Yogarona.fit@gmail.com
  subject: 'Test - New Yoga Class Booking',
  html: `
    <h2>Test - New Booking Request</h2>
    <p><strong>Student Name:</strong> ${testBooking.name}</p>
    <p><strong>Student Email:</strong> ${testBooking.email}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Time:</strong> ${testBooking.time}</p>
    <p><strong>Number of People:</strong> ${testBooking.numberOfPeople}</p>
    <p><strong>This is a test email to verify the STUDIO_EMAIL update to:</strong> ${process.env.STUDIO_EMAIL}</p>
  `,
};

// Send test email
async function sendTestEmail() {
  try {
    console.log('Sending test email to:', process.env.STUDIO_EMAIL);
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendTestEmail();

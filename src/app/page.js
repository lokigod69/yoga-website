'use client'; // Needed for Framer Motion
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head'; // Optional for meta tags
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

// Sample data
const schedule = [
  { day: 'Monday-Friday', time: '10:00 AM - 11:00 AM & 5:00 PM - 6:00 PM', class: 'Drop-in Sessions' },
];

const testimonials = [
  {
    name: "B.K.S. Iyengar",
    quote: "Yoga does not just change the way we see things, it transforms the person who sees."
  },
  {
    name: "Patanjali",
    quote: "When you are inspired by some great purpose, all your thoughts break their bonds; your mind transcends limitations."
  },
  {
    name: "Sri K. Pattabhi Jois",
    quote: "Practice, and all is coming."
  },
  {
    name: "T.K.V. Desikachar",
    quote: "The success of yoga does not lie in the ability to perform postures but in how it positively changes the way we live our life."
  },
  {
    name: "Swami Sivananda",
    quote: "Put your heart, mind, and soul into even your smallest acts. This is the secret of success."
  }
];

const dailyQuotes = [
  "Let the exhale cleanse and the inhale renew—this is yoga.",
  "When the breath is steady, the mind is steady.",
  "The body is your temple. Keep it pure and clean for the soul to reside.",
  "Yoga begins right where you are—not where you were yesterday or where you long to be.",
  "With each breath, you weave a thread—a tapestry of light, where ego is shed. Not just the body, but spirit takes flight, rooted in earth, yet one with the light.",
  "The mat is a mirror, the soul is the guide, flow like the river, let go of the tide. For yoga's not movement, nor stillness alone, it's the dance of the self—returning home."
];

// Map container style - make sure this is defined
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginTop: '20px'
};

// Location for Eagles Nest - updated coordinates
const center = {
  lat: 9.599838172037055,
  lng: 123.84258350000093,
};

export default function Home() {
  const [startDate, setStartDate] = React.useState(new Date('2024-02-24'));
  const [selectedTime, setSelectedTime] = React.useState('');
  const [showDateAnimation, setShowDateAnimation] = React.useState(false);
  const [showTimeAnimation, setShowTimeAnimation] = React.useState(false);
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [showBookingQuote, setShowBookingQuote] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = React.useState(0);
  const [text1, setText1] = React.useState("Consciousness and unseen forces");
  const [text2, setText2] = React.useState("guiding us");
  const [dateError, setDateError] = React.useState(false);
  const [timeError, setTimeError] = React.useState(false);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0; // Only exclude Sunday (0)
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setShowDateAnimation(true);
    setTimeout(() => setShowDateAnimation(false), 2000);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setShowTimeAnimation(true);
    setTimeout(() => setShowTimeAnimation(false), 2000);
  };

  const getDailyQuote = (date = new Date()) => {
    const day = date.getDay();
    // Sunday is 0, Monday is 1, etc.
    switch(day) {
      case 0: // Sunday
        return "The mat is a mirror, the soul is the guide, flow like the river, let go of the tide. For yoga's not movement, nor stillness alone, it's the dance of the self—returning home.";
      case 1: // Monday
        return "Let the exhale cleanse and the inhale renew—this is yoga.";
      case 2: // Tuesday
        return "When the breath is steady, the mind is steady.";
      case 3: // Wednesday
        return "The body is your temple. Keep it pure and clean for the soul to reside.";
      case 4: // Thursday
        return "Yoga begins right where you are—not where you were yesterday or where you long to be.";
      case 5: // Friday
        return "With each breath, you weave a thread—a tapestry of light, where ego is shed. Not just the body, but spirit takes flight, rooted in earth, yet one with the light.";
      case 6: // Saturday
        return "The mat is a mirror, the soul is the guide, flow like the river, let go of the tide. For yoga's not movement, nor stillness alone, it's the dance of the self—returning home.";
      default:
        return "Let the exhale cleanse and the inhale renew—this is yoga.";
    }
  };

  const handleInputFocus = (field) => {
    if (field === 'name') setNameError(false);
    if (field === 'email') setEmailError(false);
    if (field === 'date') setDateError(false);
    if (field === 'time') setTimeError(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    
    // Reset all error states
    setNameError(false);
    setEmailError(false);
    setDateError(false);
    setTimeError(false);
    
    // Validate all fields
    let hasError = false;
    if (!name) {
      setNameError(true);
      hasError = true;
    }
    if (!email) {
      setEmailError(true);
      hasError = true;
    }
    if (!startDate) {
      setDateError(true);
      hasError = true;
    }
    if (!selectedTime) {
      setTimeError(true);
      hasError = true;
    }

    // Only proceed if no errors
    if (!hasError) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setShowBookingQuote(true);
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex((prev) => (prev + 1) % (text1.length + text2.length));
    }, 100); // Speed of animation
    
    return () => clearInterval(interval);
  }, []);

  const lotusAnimation = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0, rotate: 180 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen">
      {/* Head for metadata */}
      <Head>
        <title>Yoga Serenity</title>
        <meta name="description" content="Find peace and balance with our yoga classes" />
      </Head>

      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }}>
        <div className="absolute inset-0 bg-jet-black opacity-50"></div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-6"
          >
            <h1 className="text-4xl md:text-6xl font-playfair mb-4">Find Your Yoga Serenity</h1>
            <div className="h-24 md:h-16 mb-8"> {/* Increased height for mobile */}
              <div className="text-xl md:text-3xl font-playfair">
                <p className="mb-2">
                  {text1.split('').map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: Math.abs(Math.sin((currentLetterIndex - index) * 0.3)), 
                        y: Math.sin((currentLetterIndex - index) * 0.3) * 10 
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </p>
                <p>
                  {text2.split('').map((letter, index) => (
                    <motion.span
                      key={index + text1.length}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: Math.abs(Math.sin((currentLetterIndex - index - text1.length) * 0.3)), 
                        y: Math.sin((currentLetterIndex - index - text1.length) * 0.3) * 10 
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </p>
              </div>
            </div>
            <p className="text-lg md:text-xl mb-8">Join us for transformative classes and inner peace.</p>
            <button 
              onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })} 
              className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-cultured">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-playfair text-center mb-8"
          >
            About Us
          </motion.h2>
          <p className="text-lg text-center max-w-2xl mx-auto mb-12">
            We offer a peaceful space for yoga practice, blending nature-inspired techniques with expert guidance to help you find balance and strength.
          </p>
          <div className="mt-8 flex justify-center mb-16">
            <Image src="/yoga-pose.png" alt="Yoga Pose" width={300} height={200} className="rounded-lg" />
          </div>

          {/* Testimonials Carousel */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="relative h-48 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-full text-center px-4"
                >
                  <p className="text-lg italic mb-4">"{testimonials[currentTestimonial].quote}"</p>
                  <p className="text-royal-purple font-medium">— {testimonials[currentTestimonial].name}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial ? 'bg-royal-purple' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-12 bg-timberwolf">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-playfair text-center mb-8"
          >
            Class Schedule
          </motion.h2>
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-cultured p-8 rounded-lg shadow-md max-w-lg w-full text-center"
            >
              <p className="text-2xl font-bold mb-4">Drop-in Sessions</p>
              <p className="text-xl mb-2">Monday to Saturday</p>
              <p className="text-lg mb-2">10:00 - 11:00 AM<br/>5:00 - 6:00 PM</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-cultured p-8 rounded-lg shadow-md max-w-lg w-full text-center"
            >
              <p className="text-2xl font-bold mb-4">Private Sessions</p>
              <p className="text-lg mb-3">Contact us to schedule:</p>
              <p className="text-lg mb-2">
                <span className="font-medium">WhatsApp + Mobile:</span><br/>
                <span className="underline">+639171294303</span>
              </p>
              <p className="text-lg">
                <span className="font-medium">Email:</span><br/>
                <span className="underline">ronalyncruz020@gmail.com</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Quote Popup */}
      <AnimatePresence>
        {showBookingQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-md mx-4 relative"
            >
              <button
                onClick={() => setShowBookingQuote(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-lg text-center italic mb-4">"{getDailyQuote(startDate)}"</p>
              <p className="text-center text-sm text-gray-600">Thank you for booking. We'll contact you soon to confirm your spot.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Section */}
      <section id="booking-section" className="py-12 bg-cultured">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-playfair text-center mb-8"
          >
            Book Your Session
          </motion.h2>
          <form onSubmit={handleBookingSubmit} className="max-w-md mx-auto">
            <div className="relative mb-4">
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                className={`w-full p-3 rounded-lg border transition-colors ${
                  nameError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                onFocus={() => handleInputFocus('name')}
              />
              <AnimatePresence>
                {nameError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C12 2 14 6 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 15 5 16 7C16.7 8.4 16.1 10 14.8 10.6C13.5 11.2 12 10.5 11.4 9.2C10.8 7.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 9 5 8 7C7.3 8.4 7.9 10 9.2 10.6C10.5 11.2 12 10.5 12.6 9.2C13.2 7.9 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 16 7 17 9C17.7 10.4 17.1 12 15.8 12.6C14.5 13.2 13 12.5 12.4 11.2C11.8 9.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 8 7 7 9C6.3 10.4 6.9 12 8.2 12.6C9.5 13.2 11 12.5 11.6 11.2C12.2 9.9 12 2 12 2Z" fill="#FF69B4"/>
                      <circle cx="12" cy="8" r="2" fill="#FFD700"/>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative mb-4">
              <input 
                type="email" 
                name="email"
                placeholder="Your Email" 
                className={`w-full p-3 rounded-lg border transition-colors ${
                  emailError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                onFocus={() => handleInputFocus('email')}
              />
              <AnimatePresence>
                {emailError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C12 2 14 6 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 15 5 16 7C16.7 8.4 16.1 10 14.8 10.6C13.5 11.2 12 10.5 11.4 9.2C10.8 7.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 9 5 8 7C7.3 8.4 7.9 10 9.2 10.6C10.5 11.2 12 10.5 12.6 9.2C13.2 7.9 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 16 7 17 9C17.7 10.4 17.1 12 15.8 12.6C14.5 13.2 13 12.5 12.4 11.2C11.8 9.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 8 7 7 9C6.3 10.4 6.9 12 8.2 12.6C9.5 13.2 11 12.5 11.6 11.2C12.2 9.9 12 2 12 2Z" fill="#FF69B4"/>
                      <circle cx="12" cy="8" r="2" fill="#FFD700"/>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative mb-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  handleDateChange(date);
                  handleInputFocus('date');
                }}
                minDate={new Date('2024-02-24')}
                filterDate={isWeekday}
                dateFormat="MMMM d, yyyy"
                className={`w-full p-3 rounded-lg border transition-colors ${
                  dateError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                placeholderText="Select a date"
                calendarClassName="bg-white shadow-lg rounded-lg"
                showPopperArrow={false}
                wrapperClassName="w-full" /* Added wrapper class for full width */
              />
              <AnimatePresence>
                {dateError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C12 2 14 6 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 15 5 16 7C16.7 8.4 16.1 10 14.8 10.6C13.5 11.2 12 10.5 11.4 9.2C10.8 7.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 9 5 8 7C7.3 8.4 7.9 10 9.2 10.6C10.5 11.2 12 10.5 12.6 9.2C13.2 7.9 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 16 7 17 9C17.7 10.4 17.1 12 15.8 12.6C14.5 13.2 13 12.5 12.4 11.2C11.8 9.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 8 7 7 9C6.3 10.4 6.9 12 8.2 12.6C9.5 13.2 11 12.5 11.6 11.2C12.2 9.9 12 2 12 2Z" fill="#FF69B4"/>
                      <circle cx="12" cy="8" r="2" fill="#FFD700"/>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative mb-4">
              <select 
                className={`w-full p-3 rounded-lg border transition-colors ${
                  timeError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                onChange={(e) => {
                  handleTimeChange(e);
                  handleInputFocus('time');
                }}
                value={selectedTime}
              >
                <option value="">Select Time</option>
                <option value="morning">10:00 - 11:00 AM</option>
                <option value="evening">5:00 - 6:00 PM</option>
              </select>
              <AnimatePresence>
                {timeError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C12 2 14 6 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 15 5 16 7C16.7 8.4 16.1 10 14.8 10.6C13.5 11.2 12 10.5 11.4 9.2C10.8 7.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 9 5 8 7C7.3 8.4 7.9 10 9.2 10.6C10.5 11.2 12 10.5 12.6 9.2C13.2 7.9 12 2 12 2Z" fill="#FF69B4"/>
                      <path d="M12 2C12 2 16 7 17 9C17.7 10.4 17.1 12 15.8 12.6C14.5 13.2 13 12.5 12.4 11.2C11.8 9.9 12 2 12 2Z" fill="#FF1493"/>
                      <path d="M12 2C12 2 8 7 7 9C6.3 10.4 6.9 12 8.2 12.6C9.5 13.2 11 12.5 11.6 11.2C12.2 9.9 12 2 12 2Z" fill="#FF69B4"/>
                      <circle cx="12" cy="8" r="2" fill="#FFD700"/>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              type="submit" 
              className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300 w-full relative"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Submit Booking'
              )}
            </button>
          </form>
          
          {/* Success message */}
          <AnimatePresence>
            {showBookingQuote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto text-center"
              >
                <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <h3 className="text-xl font-playfair mb-2">Booking Confirmed!</h3>
                <p className="mb-4">{getDailyQuote(startDate)}</p>
                <button 
                  onClick={() => setShowBookingQuote(false)} 
                  className="bg-royal-purple text-white px-4 py-2 rounded-full hover:bg-lilac transition duration-300"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Stay Connected - Social Media */}
      <section className="py-12 bg-timberwolf">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-playfair text-center mb-8"
          >
            Stay Connected
          </motion.h2>
          <div className="flex justify-center gap-12">
            <a href="https://instagram.com/asan_yogarona" className="hover:opacity-80 transition duration-300">
              <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#fdf497' }} />
                  <stop offset="5%" style={{ stopColor: '#fdf497' }} />
                  <stop offset="45%" style={{ stopColor: '#fd5949' }} />
                  <stop offset="60%" style={{ stopColor: '#d6249f' }} />
                  <stop offset="90%" style={{ stopColor: '#285AEB' }} />
                </linearGradient>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                fill="url(#instagram-gradient)"/>
              </svg>
              <span className="block text-sm">Instagram</span>
            </a>
            <a href="https://facebook.com/yogaserene" className="hover:opacity-80 transition duration-300">
              <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="block text-sm">Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form with Google Maps */}
      <section className="py-12 bg-cultured">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-3xl font-playfair text-center mb-8"
          >
            Contact Us
          </motion.h2>
          <div className="max-w-md mx-auto mb-12">
            <form>
              <input type="text" placeholder="Your Name" className="w-full p-3 mb-4 rounded-lg border" />
              <input type="email" placeholder="Your Email" className="w-full p-3 mb-4 rounded-lg border" />
              <textarea placeholder="Your Message" className="w-full p-3 mb-4 rounded-lg border h-32"></textarea>
              <button type="submit" className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300 w-full">
                Send Message
              </button>
            </form>
          </div>
          
          {/* Google Maps Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-xl font-playfair text-center mb-4">Find Us Here</h3>
            <div className="shadow-lg rounded-lg overflow-hidden">
              <LoadScript googleMapsApiKey="AIzaSyDS1ZagFSGKJG2EahY13zelRCT_rAxApms">
                <GoogleMap 
                  mapContainerStyle={mapContainerStyle} 
                  center={center} 
                  zoom={15}
                  options={{
                    fullscreenControl: true,
                    streetViewControl: true,
                    mapTypeControl: false,
                    zoomControl: true
                  }}
                >
                  <Marker 
                    position={center} 
                    title="Yoga Serenity Studio"
                  />
                </GoogleMap>
              </LoadScript>
            </div>
            <div className="text-center mt-4">
              <p className="font-medium text-royal-purple mb-1">Location:</p>
              <p className="text-gray-600">
                <a 
                  href="https://www.google.com/maps?q=9.599838172037055,123.84258350000093" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-royal-purple transition-colors duration-300 underline"
                >
                  Eagles Nest, JR2V+2HM, Dauis, Bohol, Philippines
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-timberwolf">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-playfair text-center mb-8"
          >
            Newsletter
          </motion.h2>
          <form className="max-w-md mx-auto">
            <input type="email" placeholder="Your Email" className="w-full p-3 mb-4 rounded-lg border" />
            <button type="submit" className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300 w-full">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-jet-black text-white text-center">
        <div className="container mx-auto px-4">
          <p>© 2025 Yoga Serenity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
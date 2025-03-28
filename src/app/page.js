'use client'; // Needed for Framer Motion
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head'; // Optional for meta tags
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import LayoutWithHeader from './layout-with-header';

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
  const [startDate, setStartDate] = React.useState(null);
  const [selectedDay, setSelectedDay] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [numberOfPeople, setNumberOfPeople] = React.useState('');
  const [showDateAnimation, setShowDateAnimation] = React.useState(false);
  const [showTimeAnimation, setShowTimeAnimation] = React.useState(false);
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [showBookingQuote, setShowBookingQuote] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = React.useState(0);
  const [text1, setText1] = React.useState("Where consciousness meets movement");
  const [dayError, setDayError] = React.useState(false);
  const [timeError, setTimeError] = React.useState(false);
  const [numberOfPeopleError, setNumberOfPeopleError] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [availableDays, setAvailableDays] = React.useState([]);

  // State for contact form
  const [contactName, setContactName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactSessionType, setContactSessionType] = React.useState('');
  const [contactMessage, setContactMessage] = React.useState('');
  const [isContactSubmitting, setIsContactSubmitting] = React.useState(false);
  const [showContactThankYou, setShowContactThankYou] = React.useState(false);

  // Generate available days (next 6 days excluding Sundays)
  React.useEffect(() => {
    const days = [];
    const today = new Date();
    let count = 0;
    let daysAdded = 0;
    
    // Add up to 6 available days
    while (daysAdded < 6) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + count);
      
      // Skip Sundays (day 0)
      if (nextDate.getDay() !== 0) {
        days.push({
          value: nextDate.toISOString(),
          label: formatDayLabel(nextDate)
        });
        daysAdded++;
      }
      count++;
    }
    
    setAvailableDays(days);
  }, []);
  
  // Format day label as "Monday, 25th March"
  const formatDayLabel = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    
    // Add ordinal suffix to day number (1st, 2nd, 3rd, etc.)
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${dayName}, ${dayNumber}${getOrdinalSuffix(dayNumber)} ${monthName}`;
  };

  // Scroll to top on page refresh
  React.useEffect(() => {
    // This will handle both page load and refresh
    window.scrollTo(0, 0);
    
    // Also register for the beforeunload event to ensure scroll position is reset
    const handleBeforeUnload = () => {
      // Store a flag in sessionStorage to indicate a page refresh is happening
      sessionStorage.setItem('page_refreshing', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check if this is a reload/refresh
    if (sessionStorage.getItem('page_refreshing') === 'true') {
      // Clear the flag
      sessionStorage.removeItem('page_refreshing');
      // Ensure we're at the top
      window.scrollTo(0, 0);
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Detect mobile devices
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add touch-specific event handlers for mobile devices
  React.useEffect(() => {
    if (isMobile) {
      // Add passive touch listeners to improve performance
      document.addEventListener('touchstart', () => {}, { passive: true });
      
      // Fix for iOS devices where focus is not properly triggered
      const inputs = document.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('touchend', (e) => {
          // Make exception for date picker to let its native behavior work
          if (input.closest('.react-datepicker-wrapper')) {
            return;
          }
          
          // Don't prevent default for other inputs to keep their behavior
          if (!input.classList.contains('react-datepicker-ignore-onclickoutside')) {
            e.preventDefault();
          }
          input.focus();
          
          // Add visual feedback for touch
          input.classList.add('touch-highlight');
          setTimeout(() => {
            input.classList.remove('touch-highlight');
          }, 300);
        }, { passive: false });
      });
      
      // Fix date picker on mobile - ensure single click works
      const fixDatePickerOnMobile = () => {
        // Handle date picker input field
        const datePickerInput = document.querySelector('.date-picker-container input');
        if (datePickerInput) {
          // Remove any existing listeners to avoid duplicates
          datePickerInput.removeEventListener('touchend', undefined);
          datePickerInput.removeEventListener('click', undefined);
          
          // Make input readonly to prevent keyboard on mobile
          datePickerInput.readOnly = true;
          
          // Add a visible calendar icon to indicate it's clickable
          datePickerInput.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239370DB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`;
          datePickerInput.style.backgroundRepeat = 'no-repeat';
          datePickerInput.style.backgroundPosition = 'right 10px center';
          datePickerInput.style.paddingRight = '40px';
          
          // Make the input element more tappable
          datePickerInput.style.cursor = 'pointer';
          datePickerInput.style.WebkitTapHighlightColor = 'rgba(147, 112, 219, 0.1)';
          datePickerInput.style.touchAction = 'manipulation';

          // Create a clickable overlay to ensure taps are captured
          const parent = datePickerInput.parentElement;
          let overlay = document.getElementById('date-picker-overlay');
          
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'date-picker-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.zIndex = '5'; // Above input but below datepicker
            overlay.style.cursor = 'pointer';
            
            overlay.addEventListener('touchend', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Programmatically trigger the date picker
              datePickerInput.focus();
              datePickerInput.click();
            }, { passive: false });
            
            overlay.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              // Programmatically trigger the date picker
              datePickerInput.focus();
              datePickerInput.click();
            });
            
            if (parent) {
              parent.style.position = 'relative';
              parent.appendChild(overlay);
            }
          }
        }
        
        // Ensure date picker container works correctly
        const datePickerContainer = document.querySelector('.react-datepicker');
        if (datePickerContainer) {
          // Improve date picker styling for mobile
          datePickerContainer.classList.add('mobile-date-picker');
          
          // Force calendar to be visible
          datePickerContainer.style.display = 'block';
          datePickerContainer.style.opacity = '1';
          datePickerContainer.style.zIndex = '9999';
          
          // Ensure days are easily tappable
          const days = datePickerContainer.querySelectorAll('.react-datepicker__day');
          days.forEach(day => {
            day.style.padding = '0.5rem';
            day.style.margin = '0.2rem';
            day.style.width = '2.5rem';
            day.style.height = '2.5rem';
            day.style.display = 'inline-flex';
            day.style.alignItems = 'center';
            day.style.justifyContent = 'center';
            day.style.touchAction = 'manipulation';
            
            // Add touch event listener to each day
            day.addEventListener('touchend', (e) => {
              // After selecting a date, move to next field
              setTimeout(() => {
                const timeSelect = document.querySelector('select[name="time"]');
                if (timeSelect) {
                  timeSelect.focus();
                }
              }, 100);
            }, { passive: true });
          });
        }
        
        // Ensure the popper/popup is visible
        const datepickerPopper = document.querySelector('.react-datepicker-popper');
        if (datepickerPopper) {
          datepickerPopper.style.zIndex = '9999';
          datepickerPopper.style.position = 'absolute';
          datepickerPopper.style.inset = '0px auto auto 0px';
          datepickerPopper.style.transform = 'translate(0px, 40px)';
        }
      };
      
      // Run the fix after a short delay to ensure the date picker is rendered
      setTimeout(fixDatePickerOnMobile, 500);
      
      // Also run it when the date picker is opened
      const dateInput = document.querySelector('.react-datepicker-wrapper input');
      if (dateInput) {
        dateInput.addEventListener('focus', () => {
          setTimeout(fixDatePickerOnMobile, 300);
        });
      }
      
      // Fix submit button to ensure it works with a single click
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.addEventListener('touchend', (e) => {
          // Prevent ghost clicks and unintended double-tap
          e.preventDefault();
          
          // Submit the form immediately on first tap
          const form = submitButton.closest('form');
          if (form && !isSubmitting) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        }, { passive: false });
      }
      
      // Ensure validation errors are visible on mobile
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', () => {
          // Force scroll to any error field after a short delay
          setTimeout(() => {
            const errorField = document.querySelector('.border-red-400');
            if (errorField) {
              errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        });
      }
      
      // Add better touch feedback for buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
          button.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', () => {
          button.classList.remove('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchcancel', () => {
          button.classList.remove('touch-active');
        }, { passive: true });
      });
    }
    
    return () => {
      if (isMobile) {
        document.removeEventListener('touchstart', () => {});
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
          input.removeEventListener('touchend', () => {});
        });
        
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
          button.removeEventListener('touchstart', () => {});
          button.removeEventListener('touchend', () => {});
          button.removeEventListener('touchcancel', () => {});
        });
        
        const datePickerInput = document.querySelector('.react-datepicker-wrapper input');
        if (datePickerInput) {
          datePickerInput.removeEventListener('touchend', () => {});
        }
        
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.removeEventListener('touchend', () => {});
        }
      }
    };
  }, [isMobile, selectedTime, isSubmitting]);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0; // Only exclude Sunday (0)
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
    setStartDate(new Date(e.target.value)); // Set the actual date for email sending
    setShowDateAnimation(true);
    setTimeout(() => setShowDateAnimation(false), 2000);
    
    // On mobile, ensure focus moves to the next field after selection
    if (isMobile && e.target.value) {
      // Allow a moment for the date to be set before moving focus
      setTimeout(() => {
        // Find the time select element and focus it
        const timeSelect = document.querySelector('select[name="time"]');
        if (timeSelect) {
          timeSelect.focus();
        }
      }, 300);
    }
    
    // Clear day error if a day is selected
    if (e.target.value) {
      setDayError(false);
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setShowTimeAnimation(true);
    setTimeout(() => setShowTimeAnimation(false), 2000);
  };

  const getDailyQuote = (date) => {
    // If date is null or undefined, use current date
    const safeDate = date instanceof Date ? date : new Date();
    const day = safeDate.getDay();
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
    if (field === 'day') setDayError(false);
    if (field === 'time') setTimeError(false);
    if (field === 'numberOfPeople') setNumberOfPeopleError(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const people = form.elements.numberOfPeople.value;
    
    // Reset all error states
    setNameError(false);
    setEmailError(false);
    setDayError(false);
    setTimeError(false);
    setNumberOfPeopleError(false);
    
    // Validate all fields
    let hasError = false;
    let firstErrorField = null;
    
    if (!name) {
      setNameError(true);
      hasError = true;
      if (!firstErrorField) firstErrorField = 'input[name="name"]';
    }
    if (!email) {
      setEmailError(true);
      hasError = true;
      if (!firstErrorField) firstErrorField = 'input[name="email"]';
    }
    if (!selectedDay) {
      setDayError(true);
      hasError = true;
      if (!firstErrorField) firstErrorField = 'select[name="day"]';
    }
    if (!selectedTime) {
      setTimeError(true);
      hasError = true;
      if (!firstErrorField) firstErrorField = 'select[name="time"]';
    }
    if (!numberOfPeople) {
      setNumberOfPeopleError(true);
      hasError = true;
      if (!firstErrorField) firstErrorField = 'select[name="numberOfPeople"]';
    }

    // Scroll to the first error field on mobile
    if (hasError && isMobile && firstErrorField) {
      const element = document.querySelector(firstErrorField);
      if (element) {
        // Wait a moment for error states to update in the DOM
        setTimeout(() => {
          // Calculate header height to account for fixed header
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          
          window.scrollTo({
            top: elementPosition - headerHeight - 20, // Add extra space
            behavior: 'smooth'
          });
          
          // Add a visual indicator by adding a class that will flash the element
          element.classList.add('error-flash');
          setTimeout(() => {
            element.classList.remove('error-flash');
            // Focus on the element after the flash animation
            setTimeout(() => element.focus(), 100);
          }, 1000);
        }, 100);
        return; // Stop form submission
      }
    }

    // Only proceed if no errors
    if (!hasError) {
      setIsSubmitting(true);
      try {
        // Find the selected day's label for the quote
        const selectedDayObj = availableDays.find(day => day.value === selectedDay);
        const dayLabel = selectedDayObj ? selectedDayObj.label : '';
        
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            date: startDate.toISOString(),
            dayLabel: dayLabel, // Send the formatted day label
            time: selectedTime,
            numberOfPeople: people
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setShowBookingQuote(true);
          // Optional: Reset form
          form.reset();
          setStartDate(null);
          setSelectedDay('');
          setSelectedTime('');
          setNumberOfPeople('');
        } else {
          alert('Failed to submit booking. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Failed to submit booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!contactName || !contactEmail || !contactSessionType || !contactMessage) {
      alert('Please fill out all fields');
      return;
    }
    
    setIsContactSubmitting(true);
    
    try {
      // Use the same endpoint as booking form
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: `Contact Form: ${contactSessionType} Session Request`,
          message: contactMessage,
          isContactForm: true // Flag to identify this is from contact form
        }),
      });
      
      if (response.ok) {
        // Reset form
        setContactName('');
        setContactEmail('');
        setContactSessionType('');
        setContactMessage('');
        
        // Show thank you message
        setShowContactThankYou(true);
        
        // Hide thank you message after 5 seconds
        setTimeout(() => {
          setShowContactThankYou(false);
        }, 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsContactSubmitting(false);
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
      setCurrentLetterIndex((prev) => (prev + 1) % text1.length);
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
    <LayoutWithHeader>
      {/* Head for metadata */}
      <Head>
        <title>Yoga Serenity</title>
        <meta name="description" content="Find peace and balance with our yoga classes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <style jsx global>{`
          /* Mobile-specific styles */
          @media (max-width: 768px) {
            input, select, button {
              font-size: 16px !important; /* Prevent zoom on iOS */
              min-height: 44px; /* Minimum touch target size */
            }
            
            .touch-highlight {
              background-color: rgba(147, 112, 219, 0.1) !important;
            }
            
            .touch-active {
              transform: scale(0.98);
              opacity: 0.9;
            }
            
            .mobile-menu-container button {
              -webkit-tap-highlight-color: rgba(0,0,0,0);
              transition: background-color 0.2s ease;
            }
            
            .mobile-menu-container button:active {
              background-color: rgba(147, 112, 219, 0.1);
            }
            
            /* Ensure text doesn't cut off in hero section */
            #home-section h1 {
              padding: 0 10px;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
            }
            
            #home-section p {
              padding: 0 15px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            /* Improved date picker styles that ensure visibility */
            .react-datepicker-wrapper {
              position: relative;
              width: 100%;
            }
            
            .react-datepicker {
              width: 100% !important;
              font-size: 1rem !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
              border-radius: 8px !important;
              border: 1px solid #e5e7eb !important;
            }
            
            .react-datepicker-popper {
              position: fixed !important;
              width: 90% !important;
              max-width: 350px !important;
              z-index: 9999 !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) !important;
            }
            
            /* Make date picker more tappable and visually indicate it's interactive */
            .react-datepicker__input-container input {
              -webkit-tap-highlight-color: rgba(147, 112, 219, 0.1);
              cursor: pointer;
              touch-action: manipulation;
              appearance: none;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239370DB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: right 10px center;
              padding-right: 40px;
            }
            
            /* Ensure date picker appears above other content */
            .date-picker-popper {
              z-index: 9999 !important;
            }
            
            /* Style readonly inputs so they don't look disabled */
            input[readonly] {
              opacity: 1 !important;
              background-color: white !important;
              color: #333 !important;
            }
            
            /* Make the calendar days more tappable */
            .mobile-date-picker .react-datepicker__day {
              padding: 0.5rem !important;
              margin: 0.2rem !important;
              line-height: 1 !important;
              width: 2.5rem !important;
              height: 2.5rem !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              touch-action: manipulation !important;
              font-size: 1rem !important;
            }
            
            .mobile-date-picker .react-datepicker__day-name {
              width: 2.5rem !important;
              margin: 0.2rem !important;
            }
            
            .mobile-date-picker .react-datepicker__header {
              padding-top: 1rem !important;
              background-color: #f3f4f6 !important;
            }
            
            .mobile-date-picker .react-datepicker__navigation {
              top: 1rem !important;
              width: 2rem !important;
              height: 2rem !important;
            }
            
            /* Add a clear visual focus state */
            .react-datepicker__input-container input:focus {
              outline: none !important;
              border-color: #9370DB !important;
              box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.3) !important;
            }
          }
        `}</style>
      </Head>

      {/* Hero Section */}
      <section id="home-section" className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/hero-ocean.jpg)' }}>
        <div className="absolute inset-0 bg-jet-black opacity-50"></div>
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-6"
          >
            <h1 className="text-4xl md:text-6xl font-playfair mb-4">Find Your Yoga Serenity</h1>
            <div className="h-auto min-h-[120px] md:min-h-[80px] mb-6 md:mb-8"> {/* Adjusted for better mobile display */}
              <div className="text-xl md:text-3xl font-playfair">
                <p style={{ whiteSpace: 'normal', wordBreak: 'keep-all' }}>
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
                <p className="mt-4 text-base md:text-xl mx-auto max-w-[90%] md:max-w-[80%] leading-relaxed">
                  I'm here to guide and learn along with you on how to find more
                  ease and joy through the practices of yoga and meditation.
                </p>
              </div>
            </div>
            <p className="text-lg md:text-xl mb-8">Join us for transformative classes and inner peace.</p>
            <button 
              onClick={(e) => {
                e.preventDefault(); // Prevent any default behavior
                const bookingSection = document.getElementById('booking-section');
                if (bookingSection) {
                  // Calculate header height to account for fixed header
                  const header = document.querySelector('header');
                  const headerHeight = header ? header.offsetHeight : 0;
                  const elementPosition = bookingSection.getBoundingClientRect().top + window.pageYOffset;
                  
                  // Scroll with offset to position the section properly at the top
                  window.scrollTo({
                    top: elementPosition - headerHeight - 20, // Add extra offset for better positioning
                    behavior: 'smooth'
                  });
                }
              }} 
              className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300"
              style={{ minHeight: isMobile ? '50px' : 'auto', minWidth: isMobile ? '160px' : 'auto' }}
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Introduction to Yoga Section */}
      <section id="introduction" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-center mb-6 text-royal-purple">
              Introduction to Yoga: A Journey for Every Body
            </h2>
            
            <div className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
              <p className="mb-6">
                Yoga is an ancient practice that combines physical postures, breath control, and mindfulness
                to promote physical health, mental clarity, and emotional balance. Dating back thousands of
                years from its origins in India, yoga has evolved into various styles and approaches that make it
                accessible to everyone, regardless of age, fitness level or flexibility.
              </p>
              
              <h3 className="text-xl md:text-2xl font-playfair text-royal-purple mt-8 mb-4">What Yoga Offers</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li><span className="font-medium">Physical Benefits:</span> Improved flexibility, strength, balance, and posture</li>
                <li><span className="font-medium">Mental Benefits:</span> Reduced stress, increased focus, and greater mental clarity</li>
                <li><span className="font-medium">Emotional Benefits:</span> Enhanced self-awareness and emotional regulation</li>
                <li><span className="font-medium">Spiritual Connection:</span> For those who seek it, a deeper connection to self and universe</li>
              </ul>
              
              <h3 className="text-xl md:text-2xl font-playfair text-royal-purple mt-8 mb-4">Beginning Your Practice</h3>
              <p className="mb-4">
                Yoga is not about perfection but about practice. As you start, remember:
              </p>
              <ol className="space-y-2 ml-6 list-decimal">
                <li><span className="font-medium">Honor Your Body:</span> Listen to your body's signals and modify poses as needed</li>
                <li><span className="font-medium">Focus on Breath:</span> The breath is your anchor throughout practice</li>
                <li><span className="font-medium">Be Present:</span> Bring awareness to sensations, thoughts, and emotions without judgment</li>
                <li><span className="font-medium">Practice Consistency:</span> Even short, regular sessions yield greater benefits than occasional long ones</li>
              </ol>
              
              <div className="mt-8 p-6 bg-cultured rounded-lg border-l-4 border-royal-purple shadow-sm">
                <p className="italic">
                  Remember that yoga is a personal journey. There is no competition, no "perfect pose," and no
                  timeline for progress. Your practice is uniquely yours, evolving as you do. Whether you're
                  seeking physical fitness, stress relief, or deeper self-understanding, yoga offers a path
                  forward—one breath, one movement at a time. Approach your mat with curiosity and
                  compassion, and you'll discover that yoga is not just something you do—it's a way of being that
                  extends far beyond the edges of your mat.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-lg overflow-hidden shadow-md max-w-xs"
              >
                <Image src="/yoga-pose-1.jpg" alt="Yoga Pose" width={300} height={300} className="w-full h-auto" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-cultured">
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
      <section id="classes-section" className="py-12 bg-timberwolf">
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
              <h3 className="text-2xl font-bold mb-4 text-center">Drop-in Sessions</h3>
              <p className="text-xl mb-2 text-center">Monday to Saturday</p>
              <p className="text-lg mb-2 text-center">10:00 - 11:00 AM<br/>5:00 - 6:00 PM</p>
              <p className="text-lg mb-4 text-center">@ 350 php</p>
              <p className="text-base text-center">
                <button 
                  onClick={() => {
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                      // Calculate header height to account for fixed header
                      const header = document.querySelector('header');
                      const headerHeight = header ? header.offsetHeight : 0;
                      const elementPosition = bookingSection.getBoundingClientRect().top + window.pageYOffset;
                      window.scrollTo({
                        top: elementPosition - headerHeight,
                        behavior: 'smooth'
                      });
                    }
                  }} 
                  className="text-royal-purple font-medium hover:underline focus:outline-none"
                >
                  Book your drop-in session today.
                </button>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-cultured p-8 rounded-lg shadow-md max-w-lg w-full"
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Private Sessions</h3>
              <h4 className="text-xl text-royal-purple mb-4 text-center italic">Transform Your Practice, Transform Your Life</h4>
              <p className="text-base mb-4">
                Discover the power of personalized attention in your yoga journey. Our private sessions are
                tailored exclusively to your body, goals, and schedule—no cookie-cutter sequences, no
                distractions, just pure, focused growth.
              </p>
              <p className="text-base mb-4">
                Whether you're touching your toes for the first time or continuing your practice, our session
                meets exactly where you are. Unlock your full potential in a supportive space where every
                breath, every movement, and every moment are designed just for you.
              </p>
              <p className="text-base mb-4">
                Your personal transformation begins here. <button 
                  onClick={() => {
                    const locationSection = document.getElementById('location-section');
                    if (locationSection) {
                      // Calculate header height to account for fixed header
                      const header = document.querySelector('header');
                      const headerHeight = header ? header.offsetHeight : 0;
                      const elementPosition = locationSection.getBoundingClientRect().top + window.pageYOffset;
                      window.scrollTo({
                        top: elementPosition - headerHeight,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="text-royal-purple font-medium hover:underline focus:outline-none"
                >
                  Book your private session today.
                </button>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-cultured p-8 rounded-lg shadow-md max-w-lg w-full"
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Online Sessions</h3>
              <h4 className="text-xl text-royal-purple mb-4 text-center italic">Yoga Anywhere, Anytime: Your Practice, Your Space</h4>
              <p className="text-base mb-4">
                Transform any corner of your home into a sanctuary of strength and serenity with our online
                yoga sessions. I'll be guiding your practice in real-time, delivering personalized attention
                through your screen as if they were right beside you.
              </p>
              <p className="text-base mb-4">
                No commute, no crowded studios—just authentic yoga that fits your schedule, your level, and
                your goals. Whether you're a curious beginner or dedicated practitioner, our virtual sessions
                deliver the perfect balance of challenge and support.
              </p>
              <p className="text-base mb-4">
                Roll out your mat, click connect, and discover the freedom of practicing exactly how and when you need it most. <button 
                  onClick={() => document.getElementById('location-section').scrollIntoView({ behavior: 'smooth' })}
                  className="text-royal-purple font-medium hover:underline focus:outline-none"
                >
                  Book your online session today.
                </button>
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
          <form onSubmit={handleBookingSubmit} className={`max-w-md mx-auto ${isMobile ? 'mobile-form' : ''}`}>
            <div className="relative mb-4">
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                className={`w-full p-3 rounded-lg border transition-colors ${
                  nameError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                onFocus={() => handleInputFocus('name')}
                onClick={() => handleInputFocus('name')}
                onTouchStart={() => handleInputFocus('name')}
              />
              <AnimatePresence>
                {nameError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2 md:block hidden"
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
              {nameError && (
                <div className="text-red-500 text-xs mt-1 md:hidden block">
                  Please enter your name
                </div>
              )}
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
                onClick={() => handleInputFocus('email')}
                onTouchStart={() => handleInputFocus('email')}
              />
              <AnimatePresence>
                {emailError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2 md:block hidden"
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
              {emailError && (
                <div className="text-red-500 text-xs mt-1 md:hidden block">
                  Please enter your email
                </div>
              )}
            </div>
            <div className="relative mb-4">
              <select 
                className={`w-full p-3 rounded-lg border transition-colors ${
                  dayError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                onChange={handleDayChange}
                onClick={() => handleInputFocus('day')}
                onTouchStart={() => handleInputFocus('day')}
                value={selectedDay}
                name="day"
                style={{ backgroundColor: 'transparent' }}
              >
                <option value="">Select Day</option>
                {availableDays.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              <AnimatePresence>
                {dayError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2 md:block hidden"
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
              {dayError && (
                <div className="text-red-500 text-xs mt-1 md:hidden block">
                  Please select a day
                </div>
              )}
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
                onClick={() => handleInputFocus('time')}
                onTouchStart={() => handleInputFocus('time')}
                value={selectedTime}
                name="time"
                style={{ backgroundColor: 'transparent' }}
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
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2 md:block hidden"
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
              {timeError && (
                <div className="text-red-500 text-xs mt-1 md:hidden block">
                  Please select a time
                </div>
              )}
            </div>
            <div className="relative mb-4">
              <select 
                className={`w-full p-3 rounded-lg border transition-colors ${
                  numberOfPeopleError ? 'border-red-400 border-2' : 'border-gray-300'
                }`}
                onChange={(e) => {
                  setNumberOfPeople(e.target.value);
                  handleInputFocus('numberOfPeople');
                }}
                onClick={() => handleInputFocus('numberOfPeople')}
                onTouchStart={() => handleInputFocus('numberOfPeople')}
                value={numberOfPeople}
                name="numberOfPeople"
                style={{ backgroundColor: 'transparent' }}
              >
                <option value="">Number of People</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <AnimatePresence>
                {numberOfPeopleError && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 -right-12 transform -translate-y-1/2 md:block hidden"
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
              {numberOfPeopleError && (
                <div className="text-red-500 text-xs mt-1 md:hidden block">
                  Please select number of people
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300 w-full relative"
              disabled={isSubmitting}
              style={{ minHeight: isMobile ? '50px' : 'auto' }}
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
                <svg className="w-16 h-16 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      <section id="stay-connected" className="py-12 bg-timberwolf">
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
            <a 
              href="https://www.instagram.com/asan_yogarona/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition duration-300 flex flex-col items-center"
            >
              <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.664-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.44 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                fill="url(#instagram-gradient)"/>
              </svg>
              <span className="block text-sm">Instagram</span>
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61555977477883" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition duration-300 flex flex-col items-center"
              onClick={(e) => {
                if (isMobile) {
                  e.preventDefault();
                  window.open('https://www.facebook.com/profile.php?id=61555977477883', '_blank');
                }
              }}
            >
              <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="block text-sm">Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form with Google Maps */}
      <section id="location-section" className="py-12 bg-cultured">
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
            <form onSubmit={handleContactSubmit}>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full p-3 mb-4 rounded-lg border"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-3 mb-4 rounded-lg border"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <div className="relative mb-4">
                <select 
                  className="w-full p-3 rounded-lg border appearance-none bg-white"
                  value={contactSessionType}
                  onChange={(e) => setContactSessionType(e.target.value)}
                  required
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" disabled>Select Session Type</option>
                  <option value="private">Private Session</option>
                  <option value="online">Online Session</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea 
                placeholder="Your Message" 
                className="w-full p-3 mb-4 rounded-lg border h-32"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              ></textarea>
              <button 
                type="submit" 
                className="bg-royal-purple text-white px-6 py-3 rounded-full hover:bg-lilac transition duration-300 w-full"
                disabled={isContactSubmitting}
              >
                {isContactSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
            
            {/* Thank you message */}
            <AnimatePresence>
              {showContactThankYou && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 p-4 bg-white rounded-lg shadow-lg text-center"
                >
                  <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <h3 className="text-lg font-medium mb-1">Thank You!</h3>
                  <p className="mb-4">We've received your message and will get back to you soon.</p>
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* Footer */}
      <footer className="py-8 bg-jet-black text-white text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Yoga Serenity. All rights reserved.</p>
        </div>
      </footer>
    </LayoutWithHeader>
  );
}

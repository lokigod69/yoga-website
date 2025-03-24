'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home-section');
  
  // Function to scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate header height to offset scrolling
      const headerHeight = document.querySelector('header').offsetHeight;
      const sectionPosition = section.getBoundingClientRect().top;
      const offsetPosition = sectionPosition + window.pageYOffset - headerHeight;
      
      // Smooth scroll with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  // Update active section based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['home-section', 'classes-section', 'booking-section', 'location-section'];
      const scrollPosition = window.scrollY + 100; // Add offset for header
      
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Add touch-specific handling for mobile menu items
  React.useEffect(() => {
    // Only run on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const menuButtons = document.querySelectorAll('.mobile-menu-container button');
      
      menuButtons.forEach(button => {
        // Add active state styling for better touch feedback
        button.addEventListener('touchstart', () => {
          button.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', (e) => {
          button.classList.remove('touch-active');
          // Get the section ID from the button's data attribute
          const sectionId = button.getAttribute('data-section');
          if (sectionId) {
            e.preventDefault();
            scrollToSection(sectionId);
          }
        }, { passive: false });
        
        button.addEventListener('touchcancel', () => {
          button.classList.remove('touch-active');
        }, { passive: true });
      });
      
      return () => {
        menuButtons.forEach(button => {
          button.removeEventListener('touchstart', () => {});
          button.removeEventListener('touchend', () => {});
          button.removeEventListener('touchcancel', () => {});
        });
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 bg-transparent z-50 hidden md:block py-6">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <button 
              onClick={() => scrollToSection('home-section')} 
              className={`relative font-medium text-lg transition-colors duration-300 ${
                activeSection === 'home-section' ? 'text-royal-purple' : 'text-gray-700 hover:text-royal-purple'
              }`}
            >
              Home
              {activeSection === 'home-section' && (
                <motion.div 
                  layoutId="desktopActiveIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-royal-purple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('classes-section')} 
              className={`relative font-medium text-lg transition-colors duration-300 ${
                activeSection === 'classes-section' ? 'text-royal-purple' : 'text-gray-700 hover:text-royal-purple'
              }`}
            >
              Classes
              {activeSection === 'classes-section' && (
                <motion.div 
                  layoutId="desktopActiveIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-royal-purple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('booking-section')} 
              className={`relative font-medium text-lg transition-colors duration-300 ${
                activeSection === 'booking-section' ? 'text-royal-purple' : 'text-gray-700 hover:text-royal-purple'
              }`}
            >
              Book
              {activeSection === 'booking-section' && (
                <motion.div 
                  layoutId="desktopActiveIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-royal-purple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('location-section')} 
              className={`relative font-medium text-lg transition-colors duration-300 ${
                activeSection === 'location-section' ? 'text-royal-purple' : 'text-gray-700 hover:text-royal-purple'
              }`}
            >
              Location
              {activeSection === 'location-section' && (
                <motion.div 
                  layoutId="desktopActiveIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-royal-purple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </nav>
        </div>
      </header>
      
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-lg font-playfair text-royal-purple truncate max-w-[180px]">Yoga Serenity</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button text-gray-700 hover:text-royal-purple focus:outline-none p-2"
            aria-label="Toggle mobile menu"
          >
            <motion.svg 
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.svg>
          </button>
        </div>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Mobile Menu */}
        <motion.div 
          className="mobile-menu-container overflow-hidden z-50 bg-white shadow-lg w-[85%] max-w-xs fixed top-16 right-0 bottom-0"
          initial={{ x: '100%' }}
          animate={{ x: mobileMenuOpen ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflowY: 'auto' }}
        >
          <div className="px-4 py-4">
            <div className="flex flex-col">
              <button 
                data-section="home-section"
                onClick={() => scrollToSection('home-section')} 
                className={`text-left flex items-center py-5 px-5 border-b border-gray-100 ${
                  activeSection === 'home-section' ? 'text-royal-purple bg-cultured' : 'text-gray-700 hover:text-royal-purple'
                }`}
              >
                <span className="text-lg">Home</span>
              </button>
              <button 
                data-section="classes-section"
                onClick={() => scrollToSection('classes-section')} 
                className={`text-left flex items-center py-5 px-5 border-b border-gray-100 ${
                  activeSection === 'classes-section' ? 'text-royal-purple bg-cultured' : 'text-gray-700 hover:text-royal-purple'
                }`}
              >
                <span className="text-lg">Classes</span>
              </button>
              <button 
                data-section="booking-section"
                onClick={() => scrollToSection('booking-section')} 
                className={`text-left flex items-center py-5 px-5 border-b border-gray-100 ${
                  activeSection === 'booking-section' ? 'text-royal-purple bg-cultured' : 'text-gray-700 hover:text-royal-purple'
                }`}
              >
                <span className="text-lg">Book</span>
              </button>
              <button 
                data-section="location-section"
                onClick={() => scrollToSection('location-section')} 
                className={`text-left flex items-center py-5 px-5 border-b border-gray-100 ${
                  activeSection === 'location-section' ? 'text-royal-purple bg-cultured' : 'text-gray-700 hover:text-royal-purple'
                }`}
              >
                <span className="text-lg">Location</span>
              </button>
            </div>
          </div>
        </motion.div>
      </header>
    </>
  );
}

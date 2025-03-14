'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const LayoutWithHeader = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('home-section');
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      
      // Determine active section based on scroll position
      const sections = [
        'home-section',
        'introduction',
        'about',
        'classes-section',
        'booking-section',
        'stay-connected',
        'location-section'
      ];
      
      // Find the section that's currently most visible
      const current = sections.reduce((acc, section) => {
        const element = document.getElementById(section);
        if (!element) return acc;
        
        const rect = element.getBoundingClientRect();
        // Check if the section is visible in viewport and closer to center than current one
        if (rect.top <= 200 && rect.bottom >= 0) {
          if (!acc || Math.abs(rect.top) < Math.abs(document.getElementById(acc).getBoundingClientRect().top)) {
            return section;
          }
        }
        return acc;
      }, null);
      
      if (current) {
        setActiveSection(current);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Handle clicks outside the mobile menu to close it
    const handleClickOutside = (event) => {
      if (isOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Set initial states
    handleScroll();
    handleResize();

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transitionEnd: {
        display: "none"
      }
    },
    open: {
      height: "auto",
      opacity: 1,
      display: "block"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header 
        ref={headerRef}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-3'
        } ${isMobile && scrolled ? 'py-1' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center z-20">
              <motion.div 
                whileHover={{ rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mr-2"
              >
                <svg width={isMobile ? "28" : "32"} height={isMobile ? "28" : "32"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C12 2 14 6 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6 12 2 12 2Z" fill="#9370DB"/>
                  <path d="M12 2C12 2 15 5 16 7C16.7 8.4 16.1 10 14.8 10.6C13.5 11.2 12 10.5 11.4 9.2C10.8 7.9 12 2 12 2Z" fill="#8A2BE2"/>
                  <path d="M12 2C12 2 9 5 8 7C7.3 8.4 7.9 10 9.2 10.6C10.5 11.2 12 10.5 12.6 9.2C13.2 7.9 12 2 12 2Z" fill="#9370DB"/>
                  <path d="M12 2C12 2 16 7 17 9C17.7 10.4 17.1 12 15.8 12.6C14.5 13.2 13 12.5 12.4 11.2C11.8 9.9 12 2 12 2Z" fill="#8A2BE2"/>
                  <path d="M12 2C12 2 8 7 7 9C6.3 10.4 6.9 12 8.2 12.6C9.5 13.2 11 12.5 11.6 11.2C12.2 9.9 12 2 12 2Z" fill="#9370DB"/>
                  <circle cx="12" cy="8" r="2" fill="#FFD700"/>
                </svg>
              </motion.div>
              <span className={`font-playfair ${isMobile ? 'text-base' : 'text-lg'} ${scrolled ? 'text-royal-purple' : 'text-white'}`}>
                Yoga Serenity
              </span>
            </Link>

            {/* Mobile menu button - larger touch target */}
            <div className="md:hidden z-20">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`focus:outline-none transition-all p-2 -mr-2 rounded-full ${
                  isOpen ? 'bg-gray-100 bg-opacity-80' : ''
                } ${scrolled ? 'text-royal-purple' : 'text-white'}`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <motion.svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={isOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </motion.svg>
              </button>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
              <nav className="flex space-x-8">
                {[
                  { name: 'Home', id: 'home-section' },
                  { name: 'About', id: 'about' },
                  { name: 'Classes', id: 'classes-section' },
                  { name: 'Book Now', id: 'booking-section' },
                  { name: 'Contact', id: 'location-section' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative group font-medium transition-colors duration-300 ${
                      scrolled ? 'text-gray-700 hover:text-royal-purple' : 'text-white hover:text-lilac'
                    } ${
                      activeSection === item.id ? (scrolled ? 'text-royal-purple' : 'text-lilac font-semibold') : ''
                    }`}
                  >
                    {item.name}
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                        scrolled ? 'bg-royal-purple' : 'bg-white'
                      } ${
                        activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Empty div to balance the flex layout */}
            <div className="hidden md:block w-32"></div>
          </div>
        </div>

        {/* Mobile menu - with improved animations and touch targets */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-0 top-[57px] bg-white z-10 overflow-auto pb-20"
            >
              <nav className="container mx-auto px-4 py-6 space-y-3">
                {[
                  { name: 'Home', id: 'home-section' },
                  { name: 'About', id: 'about' },
                  { name: 'Classes', id: 'classes-section' },
                  { name: 'Book Now', id: 'booking-section' },
                  { name: 'Contact', id: 'location-section' },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    whileTap={{ scale: 0.98, backgroundColor: "rgba(147, 112, 219, 0.1)" }}
                    className={`block w-full py-3 px-4 text-left rounded-lg text-lg flex items-center ${
                      activeSection === item.id 
                        ? 'bg-royal-purple bg-opacity-10 text-royal-purple font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {/* Show active indicator */}
                    {activeSection === item.id && (
                      <motion.span 
                        layoutId="activeIndicator"
                        className="w-1.5 h-6 bg-royal-purple rounded-full mr-2.5"
                      />
                    )}
                    <span className={activeSection === item.id ? "" : "ml-4"}>
                      {item.name}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default LayoutWithHeader;

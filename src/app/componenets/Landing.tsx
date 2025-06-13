'use client';
import { useState, useEffect, useRef } from 'react';
import '../globals.css'

export default function HeroSection() {
  const [isDark, setIsDark] = useState(false);
  // FIX 1: Explicitly type the useRef for arrays
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const fixedTextRef = useRef<HTMLDivElement | null>(null);
  const section2ContentRef = useRef<HTMLDivElement | null>(null);
  const section3ContentRef = useRef<HTMLDivElement | null>(null);
  const section4ContentRef = useRef<HTMLDivElement | null>(null);
  const avatarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRef = useRef<(HTMLDivElement | null)[]>([]);

  // Section configurations
  const sectionConfigs: { [key: number]: { bg: string; text: string; } } = { // Added type for sectionConfigs
    1: { bg: 'bg-black', text: 'text-white' },
    2: { bg: 'bg-pink-bright', text: 'text-white' },
    3: { bg: 'bg-pink-dark', text: 'text-white' },
    4: { bg: 'bg-gray-50', text: 'text-gray-900' },
    5: { bg: 'bg-white', text: 'text-gray-900' }
  };

  // Avatar movement configurations
  const avatarConfigs = [
    { speedX: 0.3, speedY: 0.01, amplitude: 20, func: Math.sin },
    { speedX: -0.4, speedY: 0.01, amplitude: 15, func: Math.cos },
    { speedX: 0.2, speedY: 0.008, amplitude: 25, func: Math.sin },
    { speedX: -0.3, speedY: 0.012, amplitude: 18, func: Math.cos },
    { speedX: 0.5, speedY: 0.015, amplitude: 12, func: Math.sin }
  ];

  useEffect(() => {
    // Dark mode detection
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setIsDark(event.matches); // Added type for event

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Apply dark class
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    // Intersection Observer
    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px',
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const sectionNumber = parseInt(sectionId.replace('section', ''));

        if (entry.isIntersecting) {
          updateBodyBackground(sectionNumber);
          updateTextContent(sectionNumber, entry.intersectionRatio);
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) sectionObserver.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) sectionObserver.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    // Scroll effects
    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;

      // Update parallax elements
      parallaxRef.current.forEach((element) => {
        if (element) {
          element.style.transform = `translateY(${scrolled * -0.5}px)`;
        }
      });

      // Update avatar positions
      avatarsRef.current.forEach((avatar, index) => {
        if (!avatar || !avatarConfigs[index]) return;

        const config = avatarConfigs[index];
        const moveX = scrolled * config.speedX;
        const moveY = config.func(scrolled * config.speedY) * config.amplitude;

        const maxMoveX = window.innerWidth * 0.3;
        const constrainedX = Math.max(-maxMoveX, Math.min(maxMoveX, moveX));
        avatar.style.transform = `translate(${constrainedX}px, ${moveY}px)`;
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick);
    return () => window.removeEventListener('scroll', requestTick);
  }, []);

  function updateBodyBackground(sectionNumber: number) { // Added type for sectionNumber
    const body = document.body;
    const config = sectionConfigs[sectionNumber];

    if (!config) return;

    // Remove all background classes
    Object.values(sectionConfigs).forEach(({ bg, text }) => {
      body.classList.remove(bg, text);
    });

    // Add current section classes
    body.classList.add(config.bg, config.text);
  }

  function updateTextContent(sectionNumber: number, ratio: number) {
    const contents: { [key: number]: HTMLDivElement | null } = {
      1: fixedTextRef.current,
      2: section2ContentRef.current,
      3: section3ContentRef.current,
      4: section4ContentRef.current
    };

    // Hide all content
    Object.values(contents).forEach(content => {
      if (content) content.style.opacity = '0';
    });

    // Show current content if ratio > 0.3
    if (ratio > 0.3 && contents[sectionNumber]) {
      // FIX: Null check before accessing style
      if (contents[sectionNumber]) {
        contents[sectionNumber]!.style.opacity = '1';
      }
    }
  }

  return (
    <>
      <div className="bg-[#212020] text-white overflow-x-hidden">
        {/* Fixed centered text */}
        <div ref={el => { fixedTextRef.current = el; }} className="fixed-text text-center max-w-4xl px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="block">Soufflé </span>
            <span className="block text-primary"> macaroon shortbread tart .</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            Soufflé jelly-o macaroon shortbread tart chupa chups pastry tiramisu brownie. Cake carrot cake cake chupa chups marshmallow.
          </p>
        </div>



        {/* Section 1: Black Hero */}
        <section
          id="section1"
          ref={el => { sectionsRef.current[0] = el; }}
          className="section-transition relative h-screen bg-[#212020]text-white overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[0] = el; }} className="bg-image-moving hero-image absolute inset-0"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          <div className="parallax-element parallax-back hero-image"></div>

          {/* Moving Avatars */}
          <div className="floating-avatars absolute inset-0 pointer-events-none">
            {[
              { initials: 'AT', gradient: 'from-blue-400 to-purple-500', size: 'w-24 h-24 md:w-32 md:h-32', opacity: 'opacity-80', class: 'avatar-1', textSize: 'text-xl' },
              { initials: 'SB', gradient: 'from-green-400 to-teal-500', size: 'w-20 h-20 md:w-28 md:h-28', opacity: 'opacity-70', class: 'avatar-2', textSize: 'text-lg' },
              { initials: 'MK', gradient: 'from-orange-400 to-red-500', size: 'w-28 h-28 md:w-36 md:h-36', opacity: 'opacity-90', class: 'avatar-3', textSize: 'text-xl' },
              { initials: 'JL', gradient: 'from-pink-400 to-purple-600', size: 'w-22 h-22 md:w-30 md:h-30', opacity: 'opacity-60', class: 'avatar-4', textSize: '' },
              { initials: 'DR', gradient: 'from-indigo-400 to-blue-600', size: 'w-26 h-26 md:w-34 md:h-34', opacity: 'opacity-75', class: 'avatar-5', textSize: 'text-lg' }
            ].map((avatar, index) => (
              <div
                key={index}
                ref={el => { avatarsRef.current[index] = el; }}
                className={`avatar ${avatar.class} absolute ${avatar.size} rounded-full overflow-hidden ${avatar.opacity}`}
              >
                <div className={`w-full h-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white font-bold ${avatar.textSize}`}>
                  {avatar.initials}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Pink Transition */}
        <section
          id="section2"
          ref={el => { sectionsRef.current[1] = el; }}
          className="section-transition relative h-screen bg-[#FF1B6B] text-white overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[1] = el; }} className="bg-image-moving sport-image-1 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-1"></div>
          <div
            ref={el => { section2ContentRef.current = el; }}
            className="fixed-text text-center max-w-4xl px-6 opacity-0"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block">Soufflé  -</span>
              <span className="block text-accent">jelly-o macaroon shortbread tart chupa chups pastry tiramisu brownie.</span>
            </h2>
            <p className="text-lg md:text-xl opacity-90">
              Cake carrot cake cake chupa chups marshmallow.
            </p>
          </div>
        </section>

        {/* Section 3: Pink to White transition */}
        <section
          id="section3"
          ref={el => { sectionsRef.current[2] = el; }}
          className="section-transition relative h-screen bg-[#E8175D] text-white overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src="data:video/mp4;base64," type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>

          <div ref={el => { parallaxRef.current[2] = el; }} className="bg-image-moving sport-image-2 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-2"></div>
          <div
            ref={el => { section3ContentRef.current = el; }}
            className="fixed-text text-center max-w-4xl px-6 opacity-0"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block">Cake carrot cake </span>
              <span className="block text-accent">cake chupa chups marshmallow.</span>
            </h2>
            <p className="text-lg md:text-xl opacity-90">
              cake chupa chups marshmallow.
            </p>
          </div>
        </section>

        {/* Section 4: White */}
        <section
          id="section4"
          ref={el => { sectionsRef.current[3] = el; }}
          className="section-transition relative h-screen bg-gray-50 text-gray-900 overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[3] = el; }} className="bg-image-moving sport-image-3 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-3"></div>
          <div
            ref={el => { section4ContentRef.current = el; }}
            className="fixed-text text-center max-w-4xl px-6 opacity-0"
          >
            <div className="heart-image">
              <div className="heart-icon"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block">cake chupa chups marshmallow.</span>
              <span className="block text-primary">Toffee jelly beans chocolate cake cake icing. </span>
            </h2>
            <p className="text-lg md:text-xl opacity-80">
              Bear claw cupcake tart pudding pudding sweet. Croissant donut carrot cake jelly beans candy cheesecake marshmallow chocolate chu
            </p>
          </div>
        </section>

        {/* Final section */}
        <section
          id="section5"
          ref={el => { sectionsRef.current[4] = el; }}
          className="section-transition relative h-screen bg-white text-gray-900 overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl px-6">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Bear claw cupcake
                <span className="text-primary">tart pudding pudding sweet. </span>
              </h2>
              <button className="bg-[#E8175D] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors">
                jelly beans candy
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
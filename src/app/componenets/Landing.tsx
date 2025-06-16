'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '../globals.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const fixedTextRef = useRef<HTMLDivElement | null>(null);
  const section2ContentRef = useRef<HTMLDivElement | null>(null);
  const section3ContentRef = useRef<HTMLDivElement | null>(null);
  const section4ContentRef = useRef<HTMLDivElement | null>(null);
  const avatarsRef = useRef<(HTMLImageElement | null)[]>([]);
  const parallaxRef = useRef<(HTMLDivElement | null)[]>([]);


  const sectionConfigs: { [key: number]: { color: string; } } = {
    1: { color: '#FFFFFF' }, // White (Hero)
    2: { color: '#FF1B6B' }, // Bright Pink
    3: { color: '#212020' }, // Black
    4: { color: '#F9FAFB' }, // Light Gray
    5: { color: '#FFFFFF' }  // White (Final)
  };


  interface AvatarItem {
    imageUrl: string;
    class: string;
    size: string;
    baseWidth: number;
    baseHeight: number;
    positionClasses: string;
  }

  const commonAvatarWidth = 120;
  const commonAvatarHeight = 120;
  const commonAvatarSizeClass = 'w-28 h-28 md:w-28 md:h-28 lg:w-36 lg:h-36';


  const avatarData: AvatarItem[] = [
    // Top row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848933/3_p5ll41.png', class: 'avatar-1', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-8 top-16 sm:left-12 sm:top-20' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/4_fymrev.png', class: 'avatar-2', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-8 top-16 sm:right-12 sm:top-20' },

    // Middle-top row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/6_tufyle.png', class: 'avatar-3', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-20 top-40 sm:left-28 sm:top-44 md:left-36 md:top-48' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/5_hbo13q.png', class: 'avatar-4', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-20 top-40 sm:right-28 sm:top-44 md:right-36 md:top-48' },

    // Middle row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/7_jnabcr.png', class: 'avatar-5', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-4 top-1/2 transform -translate-y-1/2 sm:left-6' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848933/2_lbu6s9.png', class: 'avatar-6', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-4 top-1/2 transform -translate-y-1/2 sm:right-6' },

    // Bottom row
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/9_ziillq.png', class: 'avatar-7', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'left-16 bottom-20 sm:left-24 sm:bottom-24 md:left-32' },
    { imageUrl: 'https://res.cloudinary.com/dyczhwkws/image/upload/v1749848934/8_vdlo4t.png', class: 'avatar-8', size: commonAvatarSizeClass, baseWidth: commonAvatarWidth, baseHeight: commonAvatarHeight, positionClasses: 'right-16 bottom-20 sm:right-24 sm:bottom-24 md:right-32' }
  ];



  // Section content visibility observer
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px',
    };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const sectionNumber = parseInt(sectionId.replace('section', ''));
        if (entry.isIntersecting) {
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

  // GSAP ANIMATION LOGIC FOR AVATARS (Sequential Reveal)
  useEffect(() => {
    // Kill existing ScrollTriggers to prevent duplicates on re-renders
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    avatarsRef.current.forEach((img, index) => {
      if (!img) return;

      // Ensure initial state: hidden and slightly offset
      gsap.set(img, { opacity: 0, y: 50, scale: 0.8 });

      // Create a ScrollTriggered animation for each avatar with staggered timing
      gsap.to(img, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.7)",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: img,
          start: "top center+=50",
          end: "top center-=150",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    // Kill previous ScrollTriggers for global background
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && trigger.vars.id.startsWith("globalBgTransition")) {
        trigger.kill();
      }
    });

    const body = document.body;
    // Set initial background color of the body
    gsap.set(body, { backgroundColor: sectionConfigs[1].color });

    // Create seamless transitions between sections
    sectionsRef.current.forEach((section, index) => {
      if (!section || index === sectionsRef.current.length - 1) return;

      const currentSectionNumber = index + 1;
      const nextSectionNumber = index + 2;
      const nextSectionColor = sectionConfigs[nextSectionNumber]?.color;

      if (nextSectionColor) {
        gsap.to(body, {
          backgroundColor: nextSectionColor,
          ease: "none",
          scrollTrigger: {
            id: `globalBgTransition${currentSectionNumber}`,
            trigger: section,
            start: "bottom center",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true, // Recalculate on window resize
          },
        });
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id && trigger.vars.id.startsWith("globalBgTransition")) {
          trigger.kill();
        }
      });
    };
  }, [sectionsRef.current.length]);

  // BACKGROUND PARALLAX ELEMENTS
  useEffect(() => {
    let ticking = false;

    function updateBackgroundParallax() {
      const scrolled = window.scrollY;

      parallaxRef.current.forEach((element) => {
        if (element) {
          element.style.transform = `translateY(${scrolled * -0.3}px)`;
        }
      });
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateBackgroundParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    return () => window.removeEventListener('scroll', requestTick);
  }, []);

  function updateTextContent(sectionNumber: number, ratio: number) {
    const contents: { [key: number]: HTMLDivElement | null } = {
      1: fixedTextRef.current,
      2: section2ContentRef.current,
      3: section3ContentRef.current,
      4: section4ContentRef.current
    };
    Object.values(contents).forEach(content => {
      if (content) content.style.opacity = '0';
    });
    if (ratio > 0.3 && contents[sectionNumber]) {
      if (contents[sectionNumber]) {
        contents[sectionNumber]!.style.opacity = '1';
      }
    }
  }

  return (
    <>
      <div className="overflow-x-hidden">
        {/* Fixed centered text with dynamic color based on background */}
        <div ref={el => { fixedTextRef.current = el; }} className="fixed-text text-center max-w-4xl px-6 ">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="block">JMPN</span>
            <span className="block text-primary"> with Rachel</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            Make the days count for you!
          </p>
        </div>

        {/* Section 1: White Hero */}
        <section
          id="section1"
          ref={el => { sectionsRef.current[0] = el; }}
          className=" relative h-screen text-gray-900 overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[0] = el; }} className="bg-image-moving hero-image absolute inset-0"></div>
          <div className="absolute inset-0 from-transparent to-white/20"></div>
          <div className="parallax-element parallax-back hero-image"></div>

          {/* Moving Avatars with improved spacing */}
          <div className="floating-avatars absolute inset-0 pointer-events-none">
            {avatarData.map((avatar, index) => (
              <Image
                key={index}
                src={avatar.imageUrl}
                alt={`Avatar ${index + 1}`}
                width={avatar.baseWidth}
                height={avatar.baseHeight}
                className={`rounded-full object-cover absolute ${avatar.class} ${avatar.size} ${avatar.positionClasses} `}

                ref={el => { avatarsRef.current[index] = el as HTMLImageElement; }}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Pink Transition */}
        <section
          id="section2"
          ref={el => { sectionsRef.current[1] = el; }}
          className="section-transition relative h-screen text-white overflow-hidden"
        >
          <div ref={el => { parallaxRef.current[1] = el; }} className="bg-image-moving sport-image-1 absolute inset-0"></div>
          <div className="parallax-element parallax-back sport-image-1"></div>
          <div
            ref={el => { section2ContentRef.current = el; }}
            className="fixed-text text-center max-w-4xl px-6 opacity-0"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="block">Soufflé -</span>
              <span className="block text-accent">Let's stay <b>fit</b>for <b>life</b> I am committed to empower through movement and encourage others to build on their strengths. and maintain good habits</span>
            </h2>
            <h3> Consistency is key!</h3>
            <p className="text-lg md:text-xl opacity-90">
              Virtual Group Sessions
              <br /> 6AM  - 7AM <br />
              Monday / Wednesday / Friday
            </p>
            email for zoom link
          </div>
        </section>

        {/* Section 3: Black transition */}
        <section
          id="section3"
          ref={el => { sectionsRef.current[2] = el; }}
          className="section-transition relative h-screen text-white overflow-hidden"
        >
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          >
            <source src="https://res.cloudinary.com/dyczhwkws/video/upload/yplsk8xffg8auhaopprt.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0  animate-pulse"></div>
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

        {/* Section 4: Light Gray/White */}
        <section
          id="section4"
          ref={el => { sectionsRef.current[3] = el; }}
          className="section-transition relative h-screen text-gray-900 overflow-hidden"
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
          className="section-transition relative h-screen text-gray-900 overflow-hidden"
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
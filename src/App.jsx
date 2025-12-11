import React, { useState, useRef, useEffect } from 'react';
import { 
  Ticket, 
  Vote, 
  Heart, 
  Star, 
  Menu, 
  X, 
  ChevronRight, 
  Award, 
  Calendar,
  MapPin,
  Check,
  ChevronLeft,
  Home,
  Users,
  ArrowUpRight,
  Handshake,
  Sparkles,
  Drama,
  Quote,
  Gem,
  Crown,
  Video,
  Palette,
  Music,
  Mic,
  PenTool,
  ThumbsUp,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { awardsData } from './awardsData.js';

// --- Custom Hook for Intersection Observer (Scroll Reveal) ---
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

// --- Reveal Component ---
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useElementOnScreen({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref} 
      className={`${className} transition-all duration-1000 cubic-bezier(0.175, 0.885, 0.32, 1.275)`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// --- Helper Component for Spotlight Effect ---
const BentoItem = ({ children, className, colSpan = "", rowSpan = "", onClick, dark = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:scale-[1.01] hover:shadow-2xl hover:z-10
        ${colSpan} ${rowSpan} ${className}
        group border border-white/10 ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, ${dark ? 'rgba(212,175,55,0.15)' : 'rgba(123,30,38,0.08)'}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full w-full flex flex-col">{children}</div>
    </div>
  );
};

// --- Atmospheric Background (Gradient + Flowing Lines + Grain) ---
const AtmosphericBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-stone-50 pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#7B1E26] opacity-[0.12] blur-[120px] animate-blob mix-blend-multiply"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#90242D] opacity-[0.1] blur-[140px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
    <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[#D4AF37] opacity-[0.05] blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply"></div>
    <div className="absolute inset-0 opacity-30">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path className="animate-wave-slow" d="M-100,50 C200,200 400,0 600,100 S1000,200 1400,50" stroke="#7B1E26" strokeWidth="1" fill="none" opacity="0.3" />
        <path className="animate-wave-slow animation-delay-2000" d="M-100,350 C100,100 500,400 900,200 S1500,100 1800,300" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.3" />
        <path className="animate-wave-slow animation-delay-4000" d="M-100,750 C300,500 600,800 1000,600 S1600,500 2000,700" stroke="#7B1E26" strokeWidth="1" fill="none" opacity="0.2" />
      </svg>
    </div>
    <div className="absolute inset-[-200%] w-[400%] h-[400%] animate-grain opacity-[0.25] mix-blend-overlay">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // Navbar States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Menu State
  
  const ticketSectionRef = useRef(null);
  const [activePoster, setActivePoster] = useState(1);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nominees = {
    plays: [
      { id: 1, title: "White The Coffee Brews", director: "Sarah Jenkins", description: "A haunting exploration of memory and loss set in 1920s London. The set design utilizes mirrors to reflect the protagonist's fractured psyche.", quote: "A visual masterpiece that lingers.", imageColor: "bg-stone-800" },
      { id: 2, title: "Lovestruck", director: "Marcus Thorne", description: "A meta-theatrical thriller that breaks the fourth wall, challenging the audience to distinguish between the play and reality.", quote: "Daring and provocative.", imageColor: "bg-slate-900" },
      { id: 3, title: "Scott Pilgrim vs The Stage", director: "Elena Vane", description: "A delicate family drama about fragile relationships tested by a sudden inheritance. A masterclass in subtle tension.", quote: "Heartbreakingly beautiful.", imageColor: "bg-[#5A1218]" },
      { id: 4, title: "Have We Met Before?", director: "Alexei Petrov", description: "A tale of ambition and betrayal in the world of high finance. Features a minimalist, brutalist set design.", quote: "A powerful and timely story.", imageColor: "bg-gray-800" },
      { id: 5, title: "Midnight Rain", director: "Maria Rodriguez", description: "A historical epic about a naval battle, brought to life with stunning practical effects and a sweeping score.", quote: "An unforgettable spectacle.", imageColor: "bg-red-900" },
      { id: 6, title: "The Other Woman", director: "Chen Wei", description: "A whimsical musical comedy about finding love among the stars, with dazzling choreography and costumes.", quote: "Pure, unadulterated joy.", imageColor: "bg-indigo-900" },
      { id: 7, title: "Till Death Do Us Part", director: "Kenji Tanaka", description: "A mind-bending science fiction play that questions the nature of time and identity. Its use of holographic projections is groundbreaking.", quote: "A glimpse into the future of theater.", imageColor: "bg-teal-900" }
    ]
  };

  const sponsors = [
    { name: "Gilded Age Spirits", type: "Platinum Sponsor", icon: Gem },
    { name: "Velvet & Co. Tailors", type: "Gold Sponsor", icon: Star },
    { name: "City Arts Council", type: "Silver Sponsor", icon: Award },
    { name: "Lumina Lighting", type: "Bronze Sponsor", icon: Sparkles }
  ];

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const handleVote = (category, id) => {
    setVotes(prev => ({ ...prev, [category]: id }));
  };

  const submitVotes = () => {
    fetch(`${BACKEND_URL}/api/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, votes }),
    })
    .then(response => {
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('An error occurred while submitting your vote. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error submitting vote:', error);
      alert('An error occurred while submitting your vote. Please try again.');
    });
  };

  const handleNavClick = (id) => {
    setIsMenuOpen(false); // Close mobile menu on navigation
    if (id === 'tickets') {
      setActiveTab('home');
      setTimeout(() => {
        ticketSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActiveTab(id);
      window.scrollTo(0, 0);
    }
  };

  const nextPoster = () => setActivePoster((prev) => (prev + 1) % nominees.plays.length);
  const prevPoster = () => setActivePoster((prev) => (prev - 1 + nominees.plays.length) % nominees.plays.length);

  // Helper to calculate progress
  const totalCategories = Object.values(awardsData).reduce((acc, tier) => acc + tier.length, 0);
  const votesCast = Object.keys(votes).length;
  const progress = Math.min((votesCast / totalCategories) * 100, 100);

  return (
    <div className="min-h-screen text-black flex flex-col font-serif relative overflow-x-hidden selection:bg-[#7B1E26] selection:text-white">
      {/* Font Injection & Custom Animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Old Standard TT', serif; }
          .fade-in { animation: fadeIn 0.8s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll { animation: scroll 60s linear infinite; }
          .pause-on-hover:hover { animation-play-state: paused; }

          @keyframes luxuryReveal {
            0% { opacity: 0; transform: translateY(100%) skewY(5deg); filter: blur(8px); }
            100% { opacity: 1; transform: translateY(0) skewY(0deg); filter: blur(0); }
          }
          .animate-luxury-text {
            display: inline-block;
            animation: luxuryReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
          }

          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }

          @keyframes waveSlow {
            0% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-20px) translateY(10px); }
            100% { transform: translateX(0) translateY(0); }
          }
          .animate-wave-slow { animation: waveSlow 15s ease-in-out infinite; }

          @keyframes grain {
            0%, 100% { transform:translate(0, 0); }
            10% { transform:translate(-5%, -10%); }
            20% { transform:translate(-15%, 5%); }
            30% { transform:translate(7%, -25%); }
            40% { transform:translate(-5%, 25%); }
            50% { transform:translate(-15%, 10%); }
            60% { transform:translate(15%, 0%); }
            70% { transform:translate(0%, 15%); }
            80% { transform:translate(3%, 35%); }
            90% { transform:translate(-10%, 10%); }
          }
          .animate-grain { animation: grain 8s steps(10) infinite; }

          @keyframes expandPill {
            0% { transform: scaleX(0.2); opacity: 0; }
            100% { transform: scaleX(1); opacity: 1; }
          }
          .animate-expand { animation: expandPill 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { bg: #f1f1f1; }
          ::-webkit-scrollbar-thumb { bg: #7B1E26; border-radius: 4px; }
        `}
      </style>

      <AtmosphericBackground />

      {/* --- FLOATING NAVIGATION INTERFACE --- */}
      
      {/* Top Left: Logo (Hides on Scroll, No Box) */}
      <div 
        className="fixed top-6 left-6 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}"
      >
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <Award className="text-[#7B1E26] group-hover:scale-110 transition-transform duration-300" size={28} />
          <span className="font-bold text-lg tracking-tighter text-black">SPART AWARDS</span>
        </div>
      </div>

      {/* DESKTOP Top Right: Tickets CTA */}
      <div className="hidden md:flex fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <button 
          onClick={() => handleNavClick('tickets')}
          className="bg-[#7B1E26] text-white px-6 py-3 rounded-[4px] font-bold tracking-widest text-xs uppercase shadow-xl hover:bg-black hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <Ticket size={16} />
          Get Tickets
        </button>
      </div>

      {/* MOBILE Top Right: Hamburger Menu */}
      <div className="md:hidden fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="bg-[#7B1E26] text-white p-3 rounded-[4px] shadow-xl hover:bg-black transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* DESKTOP Top Center: Animated Pill Navbar */}
      <div className="hidden md:flex fixed top-6 left-0 w-full justify-center z-40 pointer-events-none">
        <nav 
          className="animate-expand origin-center pointer-events-auto"
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
        >
          <div className={`
            bg-[#90242D] text-white/80 rounded-full flex items-center shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${(!isScrolled || isNavHovered) 
              ? 'px-2 py-1 md:px-4 md:py-2 gap-1 md:gap-3 scale-100' // Normal State
              : 'px-3 py-2 gap-2 scale-90' // Minimized State
            }
          `}>
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'categories', icon: Crown, label: 'Categories' },
              { id: 'voting', icon: Vote, label: 'Vote' },
              { id: 'sponsors', icon: Star, label: 'Sponsors' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  relative rounded-full transition-all duration-300 flex items-center justify-center group
                  ${(!isScrolled || isNavHovered) ? 'px-3 py-2 gap-2' : 'p-2'}
                  ${activeTab === item.id ? 'bg-white text-[#7B1E26] font-bold shadow-md' : 'hover:text-white hover:bg-white/10'}
                `}
              >
                <item.icon size={16} className={activeTab === item.id ? 'stroke-[2.5px]' : ''} />
                <span className={`
                  text-xs uppercase tracking-wider overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out
                  ${(!isScrolled || isNavHovered) 
                    ? 'max-w-[100px] opacity-100 ml-1' // Expanded Text
                    : 'max-w-0 opacity-0 ml-0' // Hidden Text
                  }
                `}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#7B1E26] text-[#F5F5DC] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
           <button 
             onClick={() => setIsMenuOpen(false)}
             className="absolute top-6 right-6 p-2 hover:text-white transition-colors"
           >
             <X size={32} />
           </button>
           
           <div className="space-y-8 text-center">
              {[
                { id: 'home', label: 'Home' },
                { id: 'categories', label: 'Categories' },
                { id: 'voting', label: 'Vote' },
                { id: 'sponsors', label: 'Sponsors' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block text-4xl font-bold uppercase tracking-widest hover:text-white transition-all transform hover:scale-110 ${activeTab === item.id ? 'text-white border-b-2 border-white' : 'text-white/60'}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-8">
                 <button 
                   onClick={() => handleNavClick('tickets')}
                   className="bg-black text-white px-8 py-4 rounded-[4px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-black transition-colors flex items-center gap-3 mx-auto"
                 >
                    <Ticket size={20} /> Get Tickets
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-24">
        {/* HOME PAGE */}
        {activeTab === 'home' && (
          <div className="fade-in">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-8 pb-20 px-4 overflow-hidden">
              <div className="w-full max-w-7xl mx-auto z-10 flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                  <div className="inline-block border border-[#7B1E26] px-4 py-1 text-[#7B1E26] uppercase tracking-[0.3em] text-xs font-bold animate-luxury-text" style={{animationDelay: '0.2s'}}>The 1st Annual</div>
                  <h1 className="text-7xl md:text-[10rem] lg:text-[13rem] font-bold text-black leading-[0.8] tracking-tighter text-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                    <div className="inline-block overflow-hidden">{['S','P','A','R','T'].map((char, i) => (<span key={i} className="animate-luxury-text inline-block" style={{animationDelay: `${0.3 + (i * 0.1)}s`}}>{char}</span>))}</div><br/>
                    <div className="inline-block overflow-hidden"><span className="text-[#7B1E26] italic relative top-[-0.1em]">{['A','W','A','R','D','S'].map((char, i) => (<span key={i} className="animate-luxury-text inline-block" style={{animationDelay: `${0.8 + (i * 0.1)}s`}}>{char}</span>))}</span></div>
                  </h1>
                  <div className="overflow-hidden"><p className="text-xl text-gray-600 max-w-2xl mx-auto italic font-light mt-4 animate-luxury-text" style={{animationDelay: '1.5s'}}>"Honoring the boldest voices in modern theater."</p></div>
                </div>

                <div className="w-full max-w-4xl h-[500px] relative flex items-center justify-center mt-2 mb-8 perspective-1000 animate-luxury-text" style={{animationDelay: '1.8s'}}>
                   <button onClick={prevPoster} className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-[4px] bg-white/90 shadow-lg flex items-center justify-center text-[#7B1E26] hover:bg-[#7B1E26] hover:text-white transition-colors cursor-pointer border border-gray-100"><ChevronLeft size={24} /></button>
                   <button onClick={nextPoster} className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-[4px] bg-white/90 shadow-lg flex items-center justify-center text-[#7B1E26] hover:bg-[#7B1E26] hover:text-white transition-colors cursor-pointer border border-gray-100"><ChevronRight size={24} /></button>
                   <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                      {nominees.plays.map((play, index) => {
                        let position = 'hidden'; let opacity = 0; let transform = ''; let filter = ''; let zIndex = 0;
                        const len = nominees.plays.length;
                        if (index === activePoster) { position = 'center'; zIndex = 20; opacity = 1; transform = 'scale(1.1) translateX(0)'; filter = 'brightness(100%) grayscale(0%)'; }
                        else if (index === (activePoster - 1 + len) % len) { position = 'left'; zIndex = 10; opacity = 0.6; transform = 'scale(0.85) translateX(-80%) rotateY(15deg)'; filter = 'brightness(70%) grayscale(40%)'; }
                        else if (index === (activePoster + 1) % len) { position = 'right'; zIndex = 10; opacity = 0.6; transform = 'scale(0.85) translateX(80%) rotateY(-15deg)'; filter = 'brightness(70%) grayscale(40%)'; }
                        return (
                          <div key={play.id} onClick={() => setActivePoster(index)} className={`absolute transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer shadow-2xl bg-black border-[3px] border-white ${position === 'hidden' ? 'opacity-0 pointer-events-none' : ''}`} style={{ width: '260px', aspectRatio: '9/16', opacity: opacity, zIndex: zIndex, transform: transform, filter: filter, left: '50%', marginLeft: '-130px' }}>
                            <div className="w-full h-full bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white flex flex-col items-end justify-end p-6 text-left relative overflow-hidden group">
                               <div className="absolute top-0 left-0 w-full h-2/3 bg-gray-700 opacity-20 mix-blend-overlay"></div>
                               <div className="absolute top-4 right-4 text-[#7B1E26]"><Star fill="#7B1E26" size={24} /></div>
                               <div className="relative z-10 w-full">
                                 <div className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Nominee No. 0{play.id}</div>
                                 <h3 className="text-2xl font-bold mb-2 font-serif leading-tight">{play.title}</h3>
                                 <div className="h-0.5 w-10 bg-[#7B1E26] mb-2"></div>
                                 <p className="text-xs italic opacity-80 mb-4">Dir. {play.director}</p>
                                 {position === 'center' && <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mt-2">Read Description</div>}
                               </div>
                            </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
                
                <Reveal delay={2000} className="flex flex-col md:flex-row justify-center items-center gap-6 w-full mt-4">
                  <button onClick={() => handleNavClick('tickets')} className="group relative overflow-hidden bg-[#7B1E26] text-white px-10 py-4 text-lg uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 min-w-[200px] rounded-[4px] hover:shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform group-hover:-translate-y-1"><Ticket size={20} /> Get Tickets</span>
                    <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  <button onClick={() => setActiveTab('voting')} className="group relative overflow-hidden border-2 border-black text-black px-10 py-4 text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px] rounded-[4px] hover:text-white">
                    <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform group-hover:-translate-y-1"><Vote size={20} /> Cast Vote</span>
                    <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </Reveal>
              </div>
            </section>

            {/* UPDATED: CATEGORY PREVIEW SECTION ON HOME - INFINITE SCROLL - SIMPLIFIED */}
            <section className="px-4 py-24 max-w-full mx-auto bg-stone-50/50 backdrop-blur-sm my-12 border-y border-stone-200 shadow-sm overflow-hidden relative">
               <div className="flex flex-col items-center justify-center text-center mb-16">
                  <Reveal><h2 className="text-4xl md:text-6xl font-bold mb-4">AWARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B1E26] to-[#D4AF37]">CATEGORIES</span></h2></Reveal>
                  <Reveal delay={200}><p className="text-gray-500 max-w-2xl text-lg font-light">Excellence across every discipline of the stage.</p></Reveal>
               </div>
               
               {/* Infinite Scroll Container for Categories */}
               <div className="relative w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10"></div>

                    <div className="flex w-max animate-scroll pause-on-hover py-8">
                        {/* Loop 3 times for smoothness */}
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-8 px-4">
                                {[...awardsData.tier1, ...awardsData.tier2, ...awardsData.tier3].map((cat, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => handleNavClick('categories')}
                                        className="w-72 h-32 bg-gray-100 hover:bg-[#1F1F1F] hover:text-white transition-all duration-300 rounded-[4px] border border-gray-200 flex items-center justify-center p-6 cursor-pointer group shadow-sm hover:shadow-xl"
                                    >
                                        <h4 className="font-bold text-xl font-serif leading-tight text-center tracking-wide">{cat.title}</h4>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
               </div>
               
               <div className="flex justify-center mt-12">
                  <button 
                    onClick={() => handleNavClick('categories')}
                    className="flex items-center gap-3 border-b-2 border-[#D4AF37] pb-2 uppercase tracking-[0.2em] font-bold text-[#7B1E26] hover:text-black hover:border-black transition-all hover:pr-4"
                  >
                    View Nominees <ArrowUpRight size={18} />
                  </button>
               </div>
            </section>

            {/* BENTO GRID */}
            <section className="px-4 pb-24 max-w-7xl mx-auto">
  <div className="bg-[#7B1E26] rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative border-4 border-[#7B1E26]">
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
      {/* Main "About" Item */}
      <BentoItem 
        colSpan="md:col-span-2" 
        rowSpan="md:row-span-2" 
        className="bg-[#1F1F1F] text-white p-10 flex flex-col justify-between" 
        dark={true} 
        onClick={() => handleNavClick('tickets')}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <Reveal delay={100}>
              <div className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mb-6 rounded-[4px] border border-white/10">About the Event</div>
            </Reveal>
            <ArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={32} />
          </div>
          <Reveal delay={200}>
            <h3 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight">Defining <br/><span className="text-[#D4AF37]">Excellence.</span></h3>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-md font-light">The Student Performing Arts & Recognition Trophy (SPART) bridges the gap between academic study and professional excellence.</p>
          </Reveal>
        </div>
        <div className="relative z-10 mt-12 w-fit">
          <button onClick={(e) => { e.stopPropagation(); setActiveTab('voting'); }} className="group/btn relative px-10 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-[4px] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-3 group-hover/btn:text-black transition-colors">Vote Now <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/></span>
          </button>
        </div>
      </BentoItem>

      {/* Date, Time, and Venue Item */}
      <BentoItem 
        className="bg-stone-900/80 text-white p-8 flex flex-col justify-center gap-6"
        dark={true}
      >
        <Reveal>
          <div className="flex items-center gap-4">
            <Calendar size={24} className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-white/60">Date</p>
              <p className="text-xl font-bold">20th December</p>
            </div>
          </div>
        </Reveal>
         <Reveal delay={100}>
          <div className="flex items-center gap-4">
            <Clock size={24} className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-white/60">Time</p>
              <p className="text-xl font-bold">7 PM</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex items-center gap-4">
            <MapPin size={24} className="text-[#D4AF37]" />
            <div>
              <p className="text-sm text-white/60">Venue</p>
              <p className="text-xl font-bold">Taylor's University, LT13</p>
            </div>
          </div>
        </Reveal>
      </BentoItem>

      {/* Nominees & Sponsors Items */}
      <BentoItem className="bg-gray-100 p-8 flex flex-col justify-between" onClick={() => handleNavClick('categories')}>
        <Reveal><h3 className="text-2xl font-bold font-serif leading-tight">Explore the Nominees</h3></Reveal>
        <div className="w-full flex justify-end"><ArrowUpRight className="text-gray-300 group-hover:text-black transition-colors" size={48} /></div>
      </BentoItem>
    </div>
  </div>
</section>
            
            <section ref={ticketSectionRef} className="py-24 px-4 max-w-7xl mx-auto relative overflow-hidden scroll-mt-24"><div className="text-center mb-16 space-y-4"><Reveal><h2 className="text-5xl md:text-7xl font-bold tracking-tighter">SECURE YOUR <span className="text-[#7B1E26] italic">SPOT</span></h2></Reveal><Reveal delay={200}><p className="text-xl text-gray-500 italic font-serif">"Limited seating available for this exclusive evening."</p></Reveal></div>              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="group relative bg-gray-100 border border-gray-200 rounded-[2rem] p-4 md:p-8 hover:border-[#7B1E26] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full"></div>
                  <div className="text-center space-y-4 md:space-y-6">
                    <div className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-gray-400">Solo Entry</div>
                    <div className="text-5xl md:text-7xl font-bold font-serif text-[#7B1E26] flex justify-center items-start">
                      <span className="text-xl md:text-2xl mt-2 mr-1">RM</span>5
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold">Single</h3>
                    <ul className="space-y-2 text-gray-500 text-[10px] md:text-sm font-medium">
                      <li>• General Entry</li>
                      <li>• Standing</li>
                    </ul>
                  </div>
                </div>
                <div className="group relative bg-[#121212] text-white rounded-[2rem] p-4 md:p-8 hover:shadow-2xl hover:shadow-[#7B1E26]/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-black cursor-pointer">
                  <div className="absolute top-0 right-0 bg-[#7B1E26] text-white text-[8px] md:text-[10px] font-bold px-3 py-1 md:px-4 md:py-2 rounded-bl-[4px] uppercase tracking-widest z-20 shadow-md"><Sparkles size={10} className="inline mr-1"/> Best Value</div>
                  <div className="absolute top-0 left-0 bg-white text-black text-[8px] font-bold px-3 py-1 rounded-br-[4px] uppercase tracking-widest z-20">2 entries</div>
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                  <div className="text-center space-y-4 md:space-y-6">
                    <div className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-gray-400">Couples Pass</div>
                    <div className="text-5xl md:text-7xl font-bold font-serif text-[#7B1E26] flex justify-center items-start">
                      <span className="text-xl md:text-2xl mt-2 mr-1">RM</span>8
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold">Duo</h3>
                    <ul className="space-y-2 text-gray-200 text-[10px] md:text-sm font-medium">
                      <li>• Priority Entry</li>
                      <li>• Seating</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => handleNavClick('tickets')} 
                  className="bg-[#7B1E26] text-white px-8 py-4 rounded-[4px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <Ticket size={20} /> Purchase Tickets
                </button>
              </div>
              <div className="flex justify-center mt-12">
                
              </div></section>
            
            <section className="bg-white py-32 border-t border-gray-100 overflow-hidden"><div className="text-center mb-20"><h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Our Esteemed Partners</h3></div><div className="relative w-full"><div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white to-transparent z-10"></div><div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white to-transparent z-10"></div><div className="flex w-max animate-scroll pause-on-hover py-8">{[...Array(3)].map((_, i) => (<div key={i} className="flex gap-32 px-16">{sponsors.map((sponsor, idx) => (<div key={idx} className="flex flex-col items-center gap-6 group opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => setActiveTab('sponsors')}><div className="w-48 h-48 bg-gray-50 rounded-[2rem] flex items-center justify-center group-hover:bg-[#7B1E26] group-hover:text-white transition-colors shadow-lg group-hover:shadow-[#7B1E26]/30"><sponsor.icon size={80} strokeWidth={1} /></div><div className="text-center"><h4 className="font-bold text-2xl text-black">{sponsor.name}</h4><p className="text-sm uppercase tracking-widest text-gray-400 group-hover:text-[#7B1E26] mt-2">{sponsor.type}</p></div></div>))}</div>))}</div></div><div className="flex justify-center mt-20"><button onClick={() => setActiveTab('sponsors')} className="border border-gray-200 text-gray-500 px-8 py-3 rounded-[4px] uppercase tracking-widest text-xs font-bold hover:border-black hover:text-black transition-all hover:shadow-lg">Become a Partner</button></div></section>
          </div>
        )}

        {/* --- MERGED CATEGORIES & NOMINEES PAGE --- */}
        {activeTab === 'categories' && (
          <div className="max-w-7xl mx-auto px-6 py-16 fade-in">
            <div className="text-center mb-20 space-y-4">
               <Reveal><h2 className="text-5xl md:text-7xl font-bold tracking-tighter">AWARD <span className="text-[#7B1E26] italic">CATEGORIES</span></h2></Reveal>
               <Reveal delay={200}><p className="text-xl text-gray-500 italic font-serif">"Recognizing excellence across every discipline of the stage."</p></Reveal>
            </div>

            {/* TIER 1 SECTION */}
            <div className="mb-32">
               <Reveal delay={300}>
                 <div className="flex items-center gap-4 mb-16 border-b-4 border-[#7B1E26] pb-6">
                    <div className="w-16 h-16 bg-[#7B1E26] rounded-[2rem] text-white flex items-center justify-center shadow-lg"><Crown size={32}/></div>
                    <div><h3 className="text-2xl md:text-4xl font-bold tracking-tight">Tier 1: Major Awards</h3><p className="text-gray-500 text-sm uppercase tracking-widest mt-1">The Highest Honors</p></div>
                 </div>
               </Reveal>
               
               <div className="space-y-24">
                  {awardsData.tier1.map((cat, idx) => (
                     <div key={idx}>
                        <Reveal delay={idx * 100}>
                           <div className="flex items-end gap-4 mb-8">
                              <Star className="text-[#D4AF37] mb-1" fill="#D4AF37" size={24} />
                              <h4 className="text-2xl md:text-3xl font-bold font-serif">{cat.title}</h4>
                           </div>
                        </Reveal>
                        
                        {/* 4x4 Grid (Responsive: 2 cols mobile, 4 cols desktop) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                           {cat.nominees.map((nominee, nIdx) => (
                              <Reveal key={nIdx} delay={(idx * 100) + (nIdx * 50)}>
                                 <div className="group flex flex-col gap-4">
                                    {/* 1:1 Image Container */}
                                    <div className={`w-full aspect-square rounded-[2rem] overflow-hidden relative shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 ${nominee.img}`}>
                                       {/* Image Placeholder Overlay */}
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                       
                                       {/* Centered Initials/Icon as placeholder */}
                                       <div className="absolute inset-0 flex items-center justify-center text-white/20 font-serif text-6xl font-bold group-hover:scale-110 transition-transform duration-700">
                                          {nominee.name.charAt(0)}
                                       </div>
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="text-center">
                                       <h5 className="text-lg font-bold leading-tight mb-1 group-hover:text-[#7B1E26] transition-colors">{nominee.name}</h5>
                                       <p className="text-xs uppercase tracking-widest text-gray-500">{nominee.role}</p>
                                    </div>
                                 </div>
                              </Reveal>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* TIER 2 SECTION */}
            <div className="mb-24">
               <Reveal delay={300}>
                 <div className="flex items-center gap-4 mb-16 border-b-4 border-black pb-6">
                    <div className="w-16 h-16 bg-black rounded-[2rem] text-white flex items-center justify-center shadow-lg"><Sparkles size={32}/></div>
                    <div><h3 className="text-2xl md:text-4xl font-bold tracking-tight">Tier 2: Creative & Technical</h3><p className="text-gray-500 text-sm uppercase tracking-widest mt-1">Artistic Excellence</p></div>
                 </div>
               </Reveal>

               <div className="space-y-24">
                  {awardsData.tier2.map((cat, idx) => (
                     <div key={idx}>
                        <Reveal delay={idx * 100}>
                           <div className="flex items-end gap-4 mb-8">
                              <Award className="text-[#D4AF37] mb-1" size={24} />
                              <h4 className="text-2xl md:text-3xl font-bold font-serif">{cat.title}</h4>
                           </div>
                        </Reveal>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                           {cat.nominees.map((nominee, nIdx) => (
                              <Reveal key={nIdx} delay={(idx * 100) + (nIdx * 50)}>
                                 <div className="group flex flex-col gap-4">
                                    <div className={`w-full aspect-square rounded-[2rem] overflow-hidden relative shadow-sm border border-gray-100 group-hover:border-[#7B1E26] transition-all duration-500 group-hover:-translate-y-2 bg-white`}>
                                       <div className={`absolute inset-0 opacity-10 ${nominee.img}`}></div>
                                       <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:text-[#7B1E26] transition-colors">
                                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                             <Star size={24} />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-center">
                                       <h5 className="text-lg font-bold leading-tight mb-1 group-hover:text-[#7B1E26] transition-colors">{nominee.name}</h5>
                                       <p className="text-xs uppercase tracking-widest text-gray-500">{nominee.role}</p>
                                    </div>
                                 </div>
                              </Reveal>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* TIER 3 SECTION */}
            <div className="mb-24">
               <Reveal delay={300}>
                 <div className="flex items-center gap-4 mb-16 border-b-4 border-[#7B1E26] pb-6">
                    <div className="w-16 h-16 bg-[#7B1E26] rounded-[2rem] text-white flex items-center justify-center shadow-lg"><Heart size={32}/></div>
                    <div><h3 className="text-2xl md:text-4xl font-bold tracking-tight">Tier 3: Fan Favorites</h3><p className="text-gray-500 text-sm uppercase tracking-widest mt-1">Audience Choice</p></div>
                 </div>
               </Reveal>

               <div className="space-y-24">
                  {awardsData.tier3.map((cat, idx) => (
                     <div key={idx}>
                        <Reveal delay={idx * 100}>
                           <div className="flex items-end gap-4 mb-8">
                              <ThumbsUp className="text-[#D4AF37] mb-1" size={24} />
                              <h4 className="text-2xl md:text-3xl font-bold font-serif">{cat.title}</h4>
                           </div>
                        </Reveal>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                           {cat.nominees.map((nominee, nIdx) => (
                              <Reveal key={nIdx} delay={(idx * 100) + (nIdx * 50)}>
                                 <div className="group flex flex-col gap-4">
                                    <div className={`w-full aspect-square rounded-[2rem] overflow-hidden relative shadow-sm border border-gray-100 group-hover:border-[#7B1E26] transition-all duration-500 group-hover:-translate-y-2 bg-[#1F1F1F]`}>
                                       <div className={`absolute inset-0 opacity-10 ${nominee.img}`}></div>
                                       <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:text-[#D4AF37] transition-colors">
                                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                                             <Heart size={24} fill="currentColor" />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-center">
                                       <h5 className="text-lg font-bold leading-tight mb-1 group-hover:text-[#7B1E26] transition-colors">{nominee.name}</h5>
                                       <p className="text-xs uppercase tracking-widest text-gray-500">{nominee.role}</p>
                                    </div>
                                 </div>
                              </Reveal>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Voting, Sponsors... */}
        {activeTab === 'voting' && (
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">CAST YOUR <span className="text-[#7B1E26]">VOTE</span></h2>
            {!submitted ? (
              <>
                {!isEmailSubmitted ? (
                  <div className="max-w-md mx-auto bg-[#1F1F1F] p-8 border border-white/10 text-center shadow-lg rounded-[2rem] text-white relative">
                    <h3 className="text-2xl mb-4 font-serif">Verify Identity</h3>
                    <p className="mb-6 text-gray-400 text-sm">Please enter your email to access the ballot. One vote per attendee.</p>
                    <input type="email" placeholder="name@example.com" className="w-full p-3 border border-white/20 bg-white/5 mb-4 focus:outline-none focus:border-[#D4AF37] rounded-xl text-white placeholder-white/30" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <button onClick={() => { 
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if(emailRegex.test(email)) {
                        setIsEmailSubmitted(true);
                      } else {
                        alert('Please enter a valid email address.');
                      }
                    }} className="w-full bg-[#D4AF37] text-black font-bold py-3 uppercase tracking-widest hover:bg-white transition-colors rounded-[4px]">Continue to Ballot</button>
                    <a href={`${BACKEND_URL}/api/admin/dashboard`} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 text-xs text-gray-500 hover:text-white underline">Admin Portal</a>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Progress Bar */}
                    <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7B1E26] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {Object.entries(awardsData).map(([tierKey, categories]) => (
                      <div key={tierKey} className="space-y-8">
                        <div className="border-l-4 border-[#7B1E26] pl-4 py-1">
                           <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400">
                             {tierKey === 'tier1' ? 'Tier 1: Major Awards' : tierKey === 'tier2' ? 'Tier 2: Creative & Technical' : 'Tier 3: Fan Favorites'}
                           </h3>
                        </div>
                        
                        {categories.map((cat) => (
                          <div key={cat.id} className="bg-gray-50 p-4 md:p-6 rounded-[2rem] border border-gray-100">
                             <h4 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3">
                               <cat.icon size={24} className="text-[#7B1E26]" /> {cat.title}
                             </h4>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {cat.nominees.map((nominee, idx) => {
                                 const isSelected = votes[cat.id] === idx;
                                 return (
                                   <div 
                                     key={idx}
                                     onClick={() => handleVote(cat.id, idx)}
                                     className={`
                                       flex items-center gap-4 p-3 rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2
                                       ${isSelected 
                                          ? 'bg-[#1F1F1F] border-[#D4AF37] text-white shadow-lg scale-[1.02]' 
                                          : 'bg-white border-transparent hover:border-gray-200 text-black shadow-sm'
                                       }
                                     `}
                                   >
                                      {/* Nominee Image Thumbnail */}
                                      <div className={`w-16 h-16 rounded-full flex-shrink-0 ${nominee.img} overflow-hidden border-2 ${isSelected ? 'border-[#D4AF37]' : 'border-gray-100'}`}>
                                         {/* Placeholder content if no image */}
                                         <div className="w-full h-full bg-black/20 flex items-center justify-center text-xs text-white font-bold">
                                            {nominee.name.charAt(0)}
                                         </div>
                                      </div>
                                      
                                      <div className="flex-grow">
                                         <h5 className="font-bold leading-tight">{nominee.name}</h5>
                                         <p className={`text-xs uppercase tracking-wider ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`}>{nominee.role}</p>
                                      </div>
                                      
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-gray-300'}`}>
                                         {isSelected && <Check size={14} strokeWidth={4} />}
                                      </div>
                                   </div>
                                 );
                               })}
                             </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="sticky bottom-4 z-30 flex justify-center pt-4 pb-8">
                      <button 
                        onClick={submitVotes}
                        disabled={Object.keys(votes).length === 0}
                        className={`
                          px-12 py-4 text-lg font-bold uppercase tracking-[0.2em] rounded-[4px] shadow-2xl transition-all duration-300 transform hover:-translate-y-1
                          ${Object.keys(votes).length > 0 ? 'bg-[#7B1E26] text-white hover:bg-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                      >
                        Submit Ballot
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 fade-in bg-[#1F1F1F] border border-[#D4AF37] rounded-[2rem] text-white mx-4">
                 <Gem className="text-[#D4AF37] mx-auto mb-6 animate-bounce" size={64} />
                 <h3 className="text-5xl font-bold mb-6 font-serif">Thank You.</h3>
                 <p className="text-xl text-gray-300 mb-2">Your voice has been counted.</p>
                 <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em]">Votes will be announced on the event day</p>
                 <button onClick={() => {setSubmitted(false); setVotes({}); setIsEmailSubmitted(false); setEmail(''); setActiveTab('home');}} className="mt-16 text-sm underline text-gray-500 hover:text-white transition-colors">Go Home</button>
              </div>
            )}
          </div>
        )}

        {/* Sponsors... */}
        {activeTab === 'sponsors' && (
          <div className="max-w-6xl mx-auto px-6 py-24 fade-in text-center">
            <Reveal><h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">OUR <span className="text-[#D4AF37]">PARTNERS</span></h2></Reveal>
            <Reveal delay={200}><p className="text-gray-500 mb-20 max-w-2xl mx-auto text-lg">We extend our deepest gratitude to the organizations that make this evening of recognition possible.</p></Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{sponsors.map((sponsor, idx) => (<div key={idx}><Reveal delay={300 + (idx * 150)}><div className="border border-gray-200 p-12 flex flex-col items-center justify-center hover:border-[#D4AF37] transition-all duration-500 group rounded-[2rem] bg-white hover:shadow-2xl hover:-translate-y-2"><div className="w-20 h-20 bg-gray-50 rounded-full mb-8 flex items-center justify-center group-hover:bg-[#7B1E26] group-hover:text-white transition-colors duration-500"><sponsor.icon size={32} /></div><h3 className="text-2xl font-bold mb-2 font-serif">{sponsor.name}</h3><span className="text-xs uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#D4AF37] font-bold mt-2">{sponsor.type}</span></div></Reveal></div>))}</div>
            <div className="mt-32 pt-16 border-t border-gray-200"><p className="text-xl italic font-serif text-gray-600 mb-4">Interested in becoming a SPART sponsor?</p><a href="mailto:sponsors@spartawards.com" className="text-[#7B1E26] font-bold text-lg border-b-2 border-[#7B1E26] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors pb-1">Contact our press team</a></div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0"><span className="font-bold text-xl tracking-tighter">SPART<span className="text-[#7B1E26]">AWARDS</span></span><p className="text-xs text-gray-400 mt-1">© 2025 SPART Organization. All rights reserved.</p></div>
          <div className="flex space-x-6 text-sm uppercase tracking-widest text-gray-500"><button onClick={() => handleNavClick('home')} className="hover:text-black">Home</button><button onClick={() => handleNavClick('tickets')} className="hover:text-black">Tickets</button><a href="#" className="hover:text-black">Privacy</a><a href="#" className="hover:text-black">Press</a></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
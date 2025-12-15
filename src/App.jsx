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
  Globe,
  Instagram,
  Clapperboard
} from 'lucide-react';

// ==========================================
// 1. LOCAL ASSETS (Uncomment these for your app)
// ==========================================


// People
import aliyaYasmine from './assets/Aliya Yasmine-min.webp';
import dayronOoi from './assets/Dayron Ooi-min.webp';
import eddieLim from './assets/Eddie Lim-min.webp';
import edlinRaihana from './assets/Edlin Raihana-min.webp';
import erynnWong from './assets/Erynn Wong-min.webp';
import jacinta from './assets/Jacinta-min.webp';
import joanna from './assets/Joanna-min.webp';
import keiToo from './assets/Kei Too-min.webp';
import manny from './assets/Manny-min.webp';
import minoriGrace from './assets/Minori Grace-min.webp';
import ongXiaoWen from './assets/Ong Xiao Wen-min.webp';
import rasheeda from './assets/Rasheeda-min.webp';
import samitinjayDe from './assets/Samitinjay De-min.webp';
import sidRavidran from './assets/Sid Ravidran-min.webp';
import justinHeeman from './assets/justin-heeman-min.webp';
import andyandkhau from './assets/theotherwoman.webp';
import jerrycho from './assets/havewemetbefore.webp';
import mitunaandsheree from './assets/tilldeathdouspart.webp';
import natashaandkhaisern from './assets/whilethecoffeebrews.webp';
import rey from './assets/midnightrain.webp';
import zakyandkeeryn from './assets/scottpilgrim.webp';
import lovestruckdirector from './assets/lovestruck.webp';    

// Original Play Posters (Home & Categories)

// Charity & Sponsors
import charity1 from './assets/charity1.webp';
import charity2 from './assets/charity2.webp';
import charity3 from './assets/charity3.webp';
import charity4 from './assets/charity4.webp';
import sponsor from './assets/sponsorlogo.webp';
import logo from './assets/logo.svg';

// New Plays Page Images
import mr3 from './assets/mr3.webp';
import tddup3 from './assets/tddup3.webp';
import spvts3 from './assets/spvts3.webp';
import ls3 from './assets/ls3.webp';
import hwmb3 from './assets/hwmb3.webp';
import tow3 from './assets/tow3.webp';
import wtcb3 from './assets/wtcb3.webp';




// ==========================================
// END ASSET SETUP
// ==========================================


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
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(1.25rem)',
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
        relative overflow-hidden rounded-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:scale-[1.01] hover:shadow-2xl hover:z-10
        ${colSpan} ${rowSpan} ${className}
        group border border-white/10 ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(50rem circle at ${mousePosition.x}px ${mousePosition.y}px, ${dark ? 'rgba(123,30,38,0.15)' : 'rgba(0,0,0,0.05)'}, transparent 40%)`,
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
    
    {/* Flowing Lines */}
    <div className="absolute inset-0 opacity-60">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path className="animate-wave-slow" d="M-100,50 C200,200 400,0 600,100 S1000,200 1400,50" stroke="#7B1E26" strokeWidth="2" fill="none" opacity="0.4" />
        <path className="animate-wave-slow animation-delay-2000" d="M-100,350 C100,100 500,400 900,200 S1500,100 1800,300" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.4" />
        <path className="animate-wave-slow animation-delay-4000" d="M-100,750 C300,500 600,800 1000,600 S1600,500 2000,700" stroke="#7B1E26" strokeWidth="2" fill="none" opacity="0.3" />
        <path className="animate-wave-slow animation-delay-1000" d="M-100,150 C300,50 500,300 800,150 S1300,50 1600,200" stroke="#7B1E26" strokeWidth="2" fill="none" opacity="0.35" />
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [activePoster, setActivePoster] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Data Definitions ---
  
  // New Plays Data with Orientation details for the layout
  const plays2025 = [
    {
      id: "hwmb",
      title: "Have We Met Before?",
      genre: "Romance Drama",
      director: "Jerry Choi Hyunseo",
      description: "Sarah, a reserved young woman, finds an unexpected connection with Eric, a friendly barista at a local cafe. They click very well as if they have known each other for a long time. As their friendship deepens, Sarah experiences vivid deja vu moments and fleeting memories involving Eric, even though she does not recall meeting him before. She finds out that her fragmented recollections are tied to a devastating trauma: a tragic event that shattered her past with Eric. Torn between guilt, loss and an overflowing desire to mend what has broken, Sarah decided to confront her hidden pain and rediscover the love once defined her life.",
      image: hwmb3, 
      orientation: "portrait",
      color: "#D4AF37" // Gold
    },
    {
      id: "wtcb",
      title: "While The Coffee Brews",
      genre: "Experimental Theatre / Drama",
      director: "Chai Khai Sern & Natasha El-Hard",
      description: "While the Coffee Brews centers around Tom, the owner of a small Brooklyn diner, and his regular patrons, including Marcello, Dante, Dominic, and Lady Theresa. The diner serves as the setting for a bittersweet love story between Trey, an ambitious law student, and Carmen, a free-spirited local with a strong sense of home. Their romance is troubled by their differing dreams, leading to inevitable arguments and separation. Moved by their plight, Tom repeatedly turns back time to try to change their fate, but each attempt ends with the same outcome—Trey and Carmen parting ways. In his final effort, Tom ensures they never meet, but years later, fate brings them together once again. Tom ultimately accepts that some things, no matter how much he tries to rewrite them, are unchangeable.",
      image: wtcb3,
      orientation: "landscape",
      color: "#5C4033" // Coffee
    },
    {
      id: "tow",
      title: "The Other Woman",
      genre: "Historical Drama",
      director: "Kausalya A/P Sathia Moorthy & Andy Tan",
      description: "Set during mid to late 1960s America, amidst tragedies and revolutions that shook a nation to its core, fading actress and heiress Thalia Adler receives the news that her lung cancer has become terminal. With a clear end in her sights, she wonders what to make of the rest of her life. But what cracks laid beneath the pristine facade of the Adlers? What would be the legacy of Ms Thalia Adler? And was Thalia Adler herself as perfect as she was on the silver screen?",
      image: tow3,
      orientation: "portrait",
      color: "#800020" // Burgundy
    },
    {
      id: "tddup",
      title: "Till Death Do Us Part",
      genre: "Indie Game Adaptation",
      director: "Lee Sher Ee & Mitunasree Loganathan",
      description: "An adaptation of Married in Red by Studio Investigrave. It's the day of the wedding between the lovely couple Da-jeong and Myeong-hoon, when an unexpected guest shows up, clad in black. Bok-su, an old university friend of Da-jeong's, has come to visit her old friend, although she's not exactly there to offer her congratulations. Her goal? To make Choi Da-jeong atone.",
      image: tddup3,
      orientation: "portrait",
      color: "#000000" // Black/White
    },
    {
      id: "lovestruck",
      title: "Lovestruck",
      genre: "Teen Drama",
      director: "Bianca Theseira & Hong Min Thong",
      description: "\"An innocent high school girl, Audrey, unable to feel emotions throughout her life until she meets a guy, Jasper, who makes her finally feel what love is; however, there are a number of obstacles surrounding Jasper, will Audrey be able to clear them in time? Will she truly find her happy ending?\"",
      image: ls3,
      orientation: "landscape",
      color: "#1E3A8A" // Blue (yearbook)
    },
    {
      id: "mr",
      title: "Midnight Rain",
      genre: "Romantic Comedy",
      director: "Rey T Sivakumaran",
      description: "A poignant coming of age romance that follows Zion, a reserved university student and music enthusiast, whose life takes an unexpected turn one stormy night. At a deserted bus stop, they meet Sienna, a mysterious and captivating young woman who seems to embody the rain itself - ephemeral and unforgettable. What begins as a chance encounter, evolves into a transformative bond, as midnight rainstorms become their sanctuary for love and self-discovery. But Sienna harbours a haunting secret, she exists only in the echoes of a past, Zion can't yet understand.",
      image: mr3,
      orientation: "portrait",
      color: "#1F2937" // Dark Blue/Grey
    },
    {
      id: "spvts",
      title: "Scott Pilgrim vs The Stage",
      genre: "Scott Pilgrim Adaptation",
      director: "Zaky Aulia & Nyam Kee Ryn",
      description: "Welcome to the newest Spart play from directors Zaky Aulia and Nyam Kee Ryn: Scott Pilgrim Vs. The Stage—a high-voltage, rock-powered theatrical experience that fuses heart, humor, and epic battle choreography. When aspiring bassist and fledgling playwright Scott Pilgrim meets the enigmatic Actress Ramona Flowers, he must conquer her seven “evil exes” in stylized stage battles to prove he’s worthy of her love. He’ll rock the stage...and battle every ex to win the girl of his dream.",
      image: spvts3,
      orientation: "square",
      color: "#DC2626" // Red
    }
  ];

  const allPlays = [
    { name: "Lovestruck", role: "Original Play", img: ls3 },
    { name: "Have We Met Before?", role: "Original Play", img: hwmb3 },
    { name: "Midnight Rain", role: "Original Play", img: mr3 },
    { name: "Till Death Do Us Part", role: "Adaptation", img: tddup3 },
    { name: "The Other Woman", role: "Original Play", img: tow3 },
    { name: "Scott Pilgrim vs The Stage", role: "Adaptation", img: spvts3 },
    { name: "While The Coffee Brews", role: "Original Play", img: wtcb3 },
  ];

  const awardsData = {
    tier1: [
      {
        id: "play",
        title: "SPART Play of the Year",
        nominees: allPlays
      },
      {
        id: "director",
        title: "Director of the Year",
        nominees: [
          { name: "Bianca Theseira & Hong Min Thong", role: "Lovestruck", img: lovestruckdirector },
          { name: "Natasha El-Hard & Chai Khai Sern", role: "While The Coffee Brews", img: natashaandkhaisern },
          { name: "Rey T Sivakumaran", role: "Midnight Rain", img: rey },
          { name: "Jerry Choi Hyunseo", role: "Have We Met Before?", img: jerrycho },
          { name: "Kausalya A/P Sathia Moorthy & Andy Tan", role: "The Other Woman", img: andyandkhau },
          { name: "Lee Sher Ee & Mitunasree Loganathan", role: "Till Death Do Us Part", img: mitunaandsheree },
          { name: "Zaky Aulia & Nyam Kee Ryn", role: "Scott Pilgrim vs The Stage", img: zakyandkeeryn },
        ]
      },
      {
        id: "lead_actor",
        title: "Best Lead Actor",
        nominees: [
          { name: "Eddie Lim", role: "Lovestruck", img: eddieLim },
          { name: "Sid Ravindran", role: "Have We Met Before?", img: sidRavidran },
          { name: "Samitinjay De", role: "Midnight Rain", img: samitinjayDe },
          { name: "Dayron Ooi", role: "Till Death Do Us Part", img: dayronOoi },
        ]
      },
      {
        id: "lead_actress",
        title: "Best Lead Actress",
        nominees: [
          { name: "Aliya Yasmine", role: "The Other Woman", img: aliyaYasmine },
          { name: "Joanna Kean", role: "Till Death Do Us Part", img: joanna },
          { name: "Kei Too", role: "Till Death Do Us Part", img: keiToo },
          { name: "Minori Grace", role: "Lovestruck", img: minoriGrace },
        ]
      },
      {
        id: "newcomer",
        title: "Best Newcomer",
        nominees: [
          { name: "Kei Too", role: "Till Death Do Us Part", img: keiToo },
          { name: "Minori Grace", role: "Lovestruck", img: minoriGrace },
          { name: "Sid Ravindran", role: "Have We Met Before?", img: sidRavidran },
          { name: "Jacinta Anthony", role: "Midnight Rain", img: jacinta },
        ]
      },
      {
        id: "script",
        title: "Best Script",
        nominees: allPlays
      }
    ],
    tier2: [
      {
        id: "supporting",
        title: "Best Supporting Actor/Actress",
        nominees: [
          { name: "Erynn Wong", role: "While The Coffee Brews", img: erynnWong },
          { name: "Justin Hee", role: "While The Coffee Brews", img: justinHeeman },
          { name: "Edlin Raihana", role: "While The Coffee Brews", img: edlinRaihana },
          { name: "Kei Too", role: "Till Death Do Us Part", img: keiToo },
          { name: "Ong Xiao Wen", role: "Lovestruck", img: ongXiaoWen },
          { name: "Rasheeda", role: "Lovestruck", img: rasheeda },
          { name: "Manny", role: "Scott Pilgrim vs The Stage", img: manny },
        ]
      },
      {
        id: "ensemble",
        title: "Best Ensemble",
        nominees: [
          { name: "Till Death Do Us Part", role: "Ensemble Cast", img: tddup3 },
          { name: "Midnight Rain", role: "Ensemble Cast", img: mr3 },
          { name: "While The Coffee Brews", role: "Ensemble Cast", img: wtcb3 },
        ]
      },
      {
        id: "scenography",
        title: "Best Scenography",
        nominees: [
          { name: "Till Death Do Us Part", role: "Set & Props", img: tddup3 },
          { name: "While The Coffee Brews", role: "Set & Props", img: wtcb3 },
          { name: "The Other Woman", role: "Set & Props", img: tow3 },
        ]
      },
      {
        id: "audiovisual",
        title: "Best Audiovisual",
        nominees: [
          { name: "Till Death Do Us Part", role: "AV Design", img: tddup3 },
          { name: "While The Coffee Brews", role: "AV Design", img: wtcb3 },
          { name: "Midnight Rain", role: "AV Design", img: mr3 },
        ]
      },
      {
        id: "costume",
        title: "Best Costume Styling & Makeup",
        nominees: [
          { name: "Till Death Do Us Part", role: "Costume & Makeup", img: tddup3 },
          { name: "Scott Pilgrim", role: "Costume & Makeup", img: spvts3 },
          { name: "The Other Woman", role: "Costume & Makeup", img: tow3 },
        ]
      }
    ],
    tier3: [
      {
        id: "audience_play",
        title: "Audience Choice Award (Play)",
        nominees: allPlays
      },
      {
        id: "audience_actor",
        title: "Audience Choice Award (Actor/Actress)",
        nominees: [
          { name: "Eddie Lim", role: "Lovestruck", img: eddieLim },
          { name: "Sid Ravindran", role: "Have We Met Before?", img: sidRavidran },
          { name: "Samitinjay De", role: "Midnight Rain", img: samitinjayDe },
          { name: "Dayron Ooi", role: "Till Death Do Us Part", img: dayronOoi },
          { name: "Aliya Yasmine", role: "The Other Woman", img: aliyaYasmine },
          { name: "Joanna Kean", role: "Till Death Do Us Part", img: joanna },
          { name: "Kei Too", role: "Till Death Do Us Part", img: keiToo },
          { name: "Minori Grace", role: "Lovestruck", img: minoriGrace },
        ]
      }
    ]
  };

  const nominees = {
    plays: [
      { id: 1, title: "Midnight Rain", director: "Rey T Sivakumaran", description: "A haunting exploration of memory.", quote: "A visual masterpiece.", image: mr3 },
      { id: 2, title: "While The Coffee Brews", director: "Chai Khai Sern & Natasha El-Hard", description: "A meta-theatrical thriller.", quote: "Provocative.", image: wtcb3 },
      { id: 3, title: "Till Death Do Us Part", director: "Lee Sher Ee & Mitunasree Loganathan", description: "A delicate family drama.", quote: "Heartbreaking.", image: tddup3 },
      { id: 4, title: "Lovestruck", director: "Bianca Theseira & Hong Min Thong", description: "A gripping tale of suspense.", quote: "Edge of your seat.", image: ls3 },
      { id: 5, title: "Have We Met Before?", director: "Jerry Choi Hyunseo", description: "A bold exploration of modern themes.", quote: "Provocative.", image: hwmb3 },
      { id: 6, title: "The Other Woman", director: "Kausalya A/P Sathia Moorthy & Andy Tan", description: "A complex character study.", quote: "Unforgettable.", image: tow3 },
      { id: 7, title: "Scott Pilgrim vs The Stage", director: "Zaky Aulia & Nyam Kee Ryn", description: "A high-energy adaptation.", quote: "Electric.", image: spvts3 },
    ]
  };

  const sponsors = [
    { name: "pixy 360D", type: "Platinum Sponsor", image: sponsor },
  ];

  const handleGetTickets = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSffwSw63kUpZ_btCinGK2wvwAiYOX7PeeVgXGk5PL4mfTuktA/viewform?usp=dialog', '_blank');
  };

  const handleNavClick = (id) => {
    setIsMenuOpen(false); 
    setActiveTab(id);
    window.scrollTo(0, 0);
  };

  const nextPoster = () => setActivePoster((prev) => (prev + 1) % nominees.plays.length);
  const prevPoster = () => setActivePoster((prev) => (prev - 1 + nominees.plays.length) % nominees.plays.length);

  return (
    <div className="min-h-screen text-black flex flex-col font-serif relative overflow-x-hidden selection:bg-[#7B1E26] selection:text-white">
      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap');
          body { font-family: 'Old Standard TT', serif; }
          .fade-in { animation: fadeIn 0.8s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(1.25rem); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-scroll { animation: scroll 60s linear infinite; }
          .pause-on-hover:hover { animation-play-state: paused; }
          @keyframes luxuryReveal { 0% { opacity: 0; transform: translateY(100%) skewY(5deg); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0) skewY(0deg); filter: blur(0); } }
          .animate-luxury-text { display: inline-block; animation: luxuryReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
          @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
          .animate-blob { animation: blob 10s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          @keyframes waveSlow { 0% { transform: translateX(0) translateY(0); } 50% { transform: translateX(-2.5rem) translateY(1.25rem); } 100% { transform: translateX(0) translateY(0); } }
          .animate-wave-slow { animation: waveSlow 12s ease-in-out infinite; }
          @keyframes grain { 0%, 100% { transform:translate(0, 0); } 10% { transform:translate(-5%, -10%); } 90% { transform:translate(-10%, 10%); } }
          .animate-grain { animation: grain 8s steps(10) infinite; }
          @keyframes expandPill { 0% { transform: scaleX(0.2); opacity: 0; } 100% { transform: scaleX(1); opacity: 1; } }
          .animate-expand { animation: expandPill 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          ::-webkit-scrollbar { width: 0.5rem; }
          ::-webkit-scrollbar-track { background: #f1f1f1; }
          ::-webkit-scrollbar-thumb { background: #7B1E26; border-radius: 0.25rem; }
        `}
      </style>

      <AtmosphericBackground />

      {/* --- NAVIGATION --- */}
      <div className={`fixed top-6 left-6 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div onClick={() => setActiveTab('home')} className="cursor-pointer flex items-center gap-3 group">
           <div className="relative w-12 h-12 overflow-hidden group-hover:scale-110 transition-transform duration-300">
             <img src={logo} alt="SPART Logo" className="w-full h-full object-contain" />
           </div>
           <span className="font-bold text-lg tracking-tighter text-black">SPART AWARDS</span>
        </div>
      </div>

      <div className="hidden md:flex fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <button onClick={handleGetTickets} className="bg-[#7B1E26] text-white px-6 py-3 rounded-none font-bold tracking-widest text-xs uppercase shadow-xl hover:bg-black hover:scale-105 transition-all duration-300 flex items-center gap-2">
          <Ticket size={16} /> Get Tickets
        </button>
      </div>

      <div className="md:hidden fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <button onClick={() => setIsMenuOpen(true)} className="bg-[#7B1E26] text-white p-3 rounded-none shadow-xl hover:bg-black transition-colors">
          <Menu size={24} />
        </button>
      </div>

      <div className="hidden md:flex fixed top-6 left-0 w-full justify-center z-40 pointer-events-none">
        <nav className="animate-expand origin-center pointer-events-auto" onMouseEnter={() => setIsNavHovered(true)} onMouseLeave={() => setIsNavHovered(false)}>
          <div className={`bg-[#90242D] text-white/80 rounded-none flex items-center shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${(!isScrolled || isNavHovered) ? 'px-2 py-1 md:px-4 md:py-2 gap-1 md:gap-3 scale-100' : 'px-3 py-2 gap-2 scale-90'}`}>
            {[
                { id: 'home', icon: Home, label: 'Home' }, 
                { id: 'categories', icon: Crown, label: 'Categories' }, 
                { id: 'plays', icon: Clapperboard, label: 'Plays' }, // Added Plays here
                { id: 'charity', icon: Heart, label: 'Charity' }
            ].map((item) => (
              <button key={item.id} onClick={() => handleNavClick(item.id)} className={`relative rounded-none transition-all duration-300 flex items-center justify-center group ${(!isScrolled || isNavHovered) ? 'px-3 py-2 gap-2' : 'p-2'} ${activeTab === item.id ? 'bg-white text-[#7B1E26] font-bold shadow-md' : 'hover:text-white hover:bg-white/10'}`}>
                <item.icon size={16} className={activeTab === item.id ? 'stroke-[2.5px]' : ''} />
                <span className={`text-xs uppercase tracking-wider overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${(!isScrolled || isNavHovered) ? 'max-w-[6.25rem] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#7B1E26] text-[#F5F5DC] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 hover:text-white transition-colors"><X size={32} /></button>
           <div className="space-y-8 text-center">
             {[
                { id: 'home', label: 'Home' }, 
                { id: 'categories', label: 'Categories' }, 
                { id: 'plays', label: 'Plays' }, // Added Plays here
                { id: 'charity', label: 'Charity' }
            ].map(item => (
               <button key={item.id} onClick={() => handleNavClick(item.id)} className={`block text-4xl font-bold uppercase tracking-widest hover:text-white transition-all transform hover:scale-110 ${activeTab === item.id ? 'text-white border-b-2 border-white' : 'text-white/60'}`}>{item.label}</button>
             ))}
             <div className="pt-8"><button onClick={handleGetTickets} className="bg-black text-white px-8 py-4 rounded-none font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-black transition-colors flex items-center gap-3 mx-auto"><Ticket size={20} /> Get Tickets</button></div>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-24">
        {/* HOME PAGE */}
        {activeTab === 'home' && (
          <div className="fade-in">
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-8 pb-20 px-4 overflow-hidden">
              <div className="w-full max-w-7xl mx-auto z-10 flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                  <div className="inline-block border border-[#7B1E26] px-4 py-1 text-[#7B1E26] uppercase tracking-[0.3em] text-xs font-bold animate-luxury-text" style={{animationDelay: '0.2s'}}>The 1st Annual</div>
                  <h1 className="text-7xl md:text-[10rem] lg:text-[13rem] font-bold text-black leading-[0.8] tracking-tighter text-shadow-lg" style={{ textShadow: '0.125rem 0.125rem 0.25rem rgba(0,0,0,0.1)' }}>
                    <div className="inline-block overflow-hidden">{['S','P','A','R','T'].map((char, i) => (<span key={i} className="animate-luxury-text inline-block" style={{animationDelay: `${0.3 + (i * 0.1)}s`}}>{char}</span>))}</div><br/>
                    <div className="inline-block overflow-hidden"><span className="text-[#7B1E26] italic relative top-[-0.1em]">{['A','W','A','R','D','S'].map((char, i) => (<span key={i} className="animate-luxury-text inline-block" style={{animationDelay: `${0.8 + (i * 0.1)}s`}}>{char}</span>))}</span></div>
                  </h1>
                  <div className="overflow-hidden"><p className="text-xl text-gray-600 max-w-2xl mx-auto italic font-light mt-4 animate-luxury-text" style={{animationDelay: '1.5s'}}>"Honoring the boldest voices in modern theatre."</p></div>
                </div>

                <div className="w-full max-w-4xl h-[31.25rem] relative flex items-center justify-center mt-2 mb-8 perspective-1000 animate-luxury-text" style={{animationDelay: '1.8s'}}>
                   <button onClick={prevPoster} className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-none bg-white/90 shadow-lg flex items-center justify-center text-[#7B1E26] hover:bg-[#7B1E26] hover:text-white transition-colors cursor-pointer border border-gray-100"><ChevronLeft size={24} /></button>
                   <button onClick={nextPoster} className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-none bg-white/90 shadow-lg flex items-center justify-center text-[#7B1E26] hover:bg-[#7B1E26] hover:text-white transition-colors cursor-pointer border border-gray-100"><ChevronRight size={24} /></button>
                   <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                      {nominees.plays.map((play, index) => {
                        let position = 'hidden'; let opacity = 0; let transform = ''; let filter = ''; let zIndex = 0;
                        const len = nominees.plays.length;
                        if (index === activePoster) { position = 'center'; zIndex = 20; opacity = 1; transform = 'scale(1.1) translateX(0)'; filter = 'brightness(100%) grayscale(0%)'; }
                        else if (index === (activePoster - 1 + len) % len) { position = 'left'; zIndex = 10; opacity = 0.6; transform = 'scale(0.85) translateX(-85%) rotateY(35deg) rotateZ(-2deg)'; filter = 'brightness(70%) grayscale(40%)'; }
                        else if (index === (activePoster + 1) % len) { position = 'right'; zIndex = 10; opacity = 0.6; transform = 'scale(0.85) translateX(85%) rotateY(-35deg) rotateZ(2deg)'; filter = 'brightness(70%) grayscale(40%)'; }
                        return (
                          <div key={play.id} onClick={() => setActivePoster(index)} className={`absolute transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer shadow-2xl bg-black border-[3px] border-white ${position === 'hidden' ? 'opacity-0 pointer-events-none' : ''}`} style={{ width: '16.25rem', aspectRatio: '7/10', opacity: opacity, zIndex: zIndex, transform: transform, filter: filter, left: '50%', marginLeft: '-8.125rem' }}>
                            <img src={play.image} alt={play.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                            <div className="w-full h-full text-white flex flex-col items-end justify-end p-6 text-left absolute top-0 left-0 right-0 bottom-0">
                               <div className="absolute top-4 right-4 text-[#7B1E26]"><Star fill="#7B1E26" size={24} /></div>
                               <div className="relative z-10 w-full">
                                 <h3 className="text-2xl font-bold mb-2 font-serif leading-tight">{play.title}</h3>
                                 <div className="h-0.5 w-10 bg-[#7B1E26] mb-2"></div>
                                 <p className="text-xs italic opacity-80 mb-4"></p>
                                 {position === 'center' && <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mt-2">Read Description</div>}
                               </div>
                            </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
                
                <Reveal delay={2000} className="flex flex-col md:flex-row justify-center items-center gap-6 w-full mt-4">
                  <button onClick={handleGetTickets} className="group relative overflow-hidden bg-[#7B1E26] text-white px-10 py-4 text-lg uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 min-w-[12.5rem] rounded-none hover:shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform group-hover:-translate-y-1"><Ticket size={20} /> Get Tickets</span>
                    <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  <button onClick={() => window.open('https://forms.gle/VNTwMaaanYgJzBoo7', '_blank')} className="group relative overflow-hidden border-2 border-black text-black px-10 py-4 text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 min-w-[12.5rem] rounded-none hover:text-white">
                    <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform group-hover:-translate-y-1"><Vote size={20} /> Vote</span>
                    <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </Reveal>
              </div>
            </section>

            {/* Category Preview */}
            <section className="px-4 py-24 max-w-full mx-auto bg-stone-50/50 backdrop-blur-sm my-12 border-y border-stone-200 shadow-sm overflow-hidden relative">
               <div className="flex flex-col items-center justify-center text-center mb-16">
                  <Reveal><h2 className="text-4xl md:text-6xl font-bold mb-4">AWARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B1E26] to-[#7B1E26]">CATEGORIES</span></h2></Reveal>
                  <Reveal delay={200}><p className="text-gray-500 max-w-2xl text-lg font-light">Excellence across every discipline of the stage.</p></Reveal>
               </div>
               
               <div className="relative w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10"></div>
                    <div className="flex w-max animate-scroll pause-on-hover py-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-8 px-4">
                                {[...awardsData.tier1, ...awardsData.tier2, ...awardsData.tier3].map((cat, idx) => (
                                    <div key={idx} onClick={() => handleNavClick('categories')} className="w-72 h-32 bg-[#111] text-white transition-all duration-300 rounded-[4px] border border-gray-200 flex items-center justify-center p-6 cursor-pointer group shadow-sm hover:shadow-xl mx-4 relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                            <h4 className="font-bold text-xl font-serif leading-tight text-center tracking-wide relative z-10">{cat.title}</h4>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
               </div>
               <div className="flex justify-center mt-12"><button onClick={() => handleNavClick('categories')} className="flex items-center gap-3 border-b-2 border-[#7B1E26] pb-2 uppercase tracking-[0.2em] font-bold text-[#7B1E26] hover:text-black hover:border-black transition-all hover:pr-4">View Nominees <ArrowUpRight size={18} /></button></div>
            </section>

            {/* Bento Grid */}
            <section className="px-4 pb-24 max-w-7xl mx-auto">
              <div className="bg-[#7B1E26] rounded-none p-6 md:p-8 shadow-2xl overflow-hidden relative border-4 border-[#7B1E26]">
                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-auto md:min-h-[43.75rem]">
                  <BentoItem colSpan="md:col-span-2" rowSpan="md:row-span-2" className="bg-black text-white p-10 flex flex-col justify-between relative overflow-hidden" dark={true} onClick={handleGetTickets}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <Reveal delay={100}><div className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mb-6 rounded-none border border-white/10">About the Event</div></Reveal>
                        <ArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={32} />
                      </div>
                      <Reveal delay={200}><h3 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight">SPART AWARDS <br/><span className="text-[#7B1E26]">2025</span></h3></Reveal>
                      <Reveal delay={300}><p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-md font-light">Society of Performing Arts @ Taylor’s (SPART) is hosting its first annual awards show to celebrate and recognize the theatre events and productions they brought to life throughout 2025.</p></Reveal>
                    </div>
                    <div className="relative z-10 mt-12 w-fit">
                      <button onClick={() => window.open('https://forms.gle/VNTwMaaanYgJzBoo7', '_blank')} className="group/btn relative px-10 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-none overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        <div className="absolute inset-0 bg-[#7B1E26] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <span className="relative z-10 flex items-center gap-3 group-hover/btn:text-white transition-colors">Vote<ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/></span>
                      </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10"><Award size={300} strokeWidth={0.5} /></div>
                  </BentoItem>
                  <BentoItem colSpan="md:col-span-1" rowSpan="md:row-span-2" className="bg-white text-black p-8 flex flex-col items-center justify-center text-center" dark={false}>
                    <Reveal delay={150}><div className="w-16 h-16 rounded-none bg-[#7B1E26] text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300"><Calendar size={32} /></div></Reveal>
                    <Reveal delay={250}><h4 className="text-4xl font-bold mb-1 font-serif">Dec 20</h4><p className="text-gray-500 mb-8 font-serif text-lg">7:00 PM</p></Reveal>
                    <div className="w-px bg-gray-200 h-16 mb-8"></div>
                    <Reveal delay={350}><div className="w-16 h-16 rounded-none bg-black text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300 delay-75"><MapPin size={32} /></div><h4 className="text-xl font-bold mb-1">LT13</h4><p className="text-gray-500 text-sm leading-tight">Taylor's University,<br/>Subang Jaya</p></Reveal>
                  </BentoItem>
                  <BentoItem colSpan="md:col-span-1" rowSpan="md:row-span-1" className="bg-black/40 backdrop-blur-md text-white p-8 flex flex-col justify-center gap-2 border border-white/5" dark={true} onClick={() => setActiveTab('categories')}>
                    <div className="bg-white/10 w-12 h-12 rounded-none flex items-center justify-center mb-2"><Drama size={24} /></div>
                    <Reveal delay={400}><h4 className="font-bold text-2xl">Categories</h4><p className="text-white/60 text-sm leading-relaxed">Meet the incredible talent nominated for this year's awards.</p></Reveal>
                  </BentoItem>
                  <BentoItem colSpan="md:col-span-1" rowSpan="md:row-span-1" className="bg-black/40 backdrop-blur-md text-white p-8 flex flex-col justify-center gap-2 border border-white/5" dark={true} onClick={() => setActiveTab('plays')}>
                    <div className="bg-white/10 w-12 h-12 rounded-none flex items-center justify-center mb-2"><Clapperboard size={24} /></div>
                    <Reveal delay={450}><h4 className="font-bold text-2xl">Plays</h4><p className="text-white/60 text-sm leading-relaxed">Discover the captivating theatre events from this year.</p></Reveal>
                  </BentoItem>
                  <BentoItem colSpan="md:col-span-1" rowSpan="md:row-span-1" className="bg-gradient-to-r from-[#90242D] to-[#5A1218] p-8 flex flex-col md:flex-row items-center justify-between gap-6" onClick={() => setActiveTab('charity')} dark={true}>
                    <div className="relative z-10 flex-1">
                      <Reveal delay={300}>
                        <div className="flex items-center gap-2 mb-3 text-white/60"><Heart size={16} /><span className="text-xs uppercase tracking-widest">Our Mission</span></div>
                        <p className="text-xl md:text-3xl font-serif italic text-white leading-tight">"To empower the next generation of storytellers."</p>
                      </Reveal>
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-none bg-white text-[#7B1E26] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"><ChevronRight size={28} /></div>
                    </div>
                  </BentoItem>
                </div>
              </div>
            </section>
            
            <section className="py-24 px-4 max-w-7xl mx-auto relative overflow-hidden scroll-mt-24">
              <div className="text-center mb-16 space-y-4">
                <Reveal><h2 className="text-5xl md:text-7xl font-bold tracking-tighter">SECURE YOUR <span className="text-[#7B1E26] italic">SPOT</span></h2></Reveal>
                <Reveal delay={200}><p className="text-xl text-gray-500 italic font-serif">"Limited seating available for this exclusive evening."</p></Reveal>
              </div>
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="group relative bg-gray-100 border border-gray-200 rounded-none p-4 md:p-8 hover:border-[#7B1E26] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-none"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-none"></div>
                    <div className="text-center space-y-4 md:space-y-6">        
                      <div className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-gray-400">Non Member</div>
                      <div className="text-5xl md:text-7xl font-bold font-serif text-[#7B1E26] flex justify-center items-start"><span className="text-xl md:text-2xl mt-2 mr-1">RM</span>15</div>
                      <h3 className="text-xl md:text-3xl font-bold">Non Member</h3>
                      <ul className="space-y-2 text-gray-500 text-[10px] md:text-sm font-medium">
                          <li>• General Entry</li>
                      </ul>
                    </div>
                  </div>
                  <div className="group relative bg-[#121212] text-white rounded-none p-4 md:p-8 hover:shadow-2xl hover:shadow-[#7B1E26]/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-black cursor-pointer">
                    <div className="absolute top-0 right-0 bg-[#7B1E26] text-white text-[8px] md:text-[10px] font-bold px-3 py-1 md:px-4 md:py-2 rounded-bl-none uppercase tracking-widest z-20 shadow-md"><Sparkles size={10} className="inline mr-1"/> Best Value</div>
                    <div className="absolute top-0 left-0 bg-white text-black text-[8px] md:text-[10px] font-bold px-3 py-1 md:px-4 md:py-2 rounded-br-none uppercase tracking-widest z-20">-20%</div>
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-none"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-none"></div>
                    <div className="text-center space-y-4 md:space-y-6 relative z-10">
                      <div className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-white/50">Member</div>
                      <div className="text-5xl md:text-7xl font-bold font-serif text-white flex justify-center items-start"><span className="text-xl md:text-2xl mt-2 mr-1 text-white/50">RM</span>20</div>
                      <h3 className="text-xl md:text-3xl font-bold">Member</h3>
                      <ul className="space-y-2 text-white/60 text-[10px] md:text-sm font-medium"><li>• General Entry</li></ul>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex justify-center"><button onClick={handleGetTickets} className="bg-black text-white px-12 py-5 rounded-none font-bold uppercase tracking-[0.2em] hover:bg-[#7B1E26] hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3 text-sm md:text-base group"><Ticket size={20} className="group-hover:-rotate-12 transition-transform"/> Purchase Ticket</button></div>
              </div>
            </section>
            
            <section className="bg-white py-32 border-t border-gray-100 overflow-hidden">
              <div className="text-center mb-20">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Our Esteemed Partner</h3>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-6 group">
                  <div className="w-64 h-64 bg-gray-50 rounded-none flex items-center justify-center transition-transform duration-300 shadow-lg group-hover:scale-110">
                    <img src={sponsor} alt="pixy 360D" loading="lazy" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-2xl text-black">pixy 360D</h4>
                    <p className="text-sm uppercase tracking-widest text-gray-400 mt-2">Platinum Sponsor</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- CATEGORIES & NOMINEES PAGE --- */}
        {activeTab === 'categories' && (
          <div className="fade-in pb-20">
             {/* 1. Immersive Header (Kept from new design) */}
             <section className="relative py-24 px-6 flex flex-col items-center justify-center bg-[#111] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <Reveal><h2 className="text-4xl md:text-8xl font-bold tracking-tighter text-center mb-6">AWARD <span className="text-[#7B1E26] italic">CATEGORIES</span></h2></Reveal>
                <Reveal delay={200}><p className="text-xl md:text-2xl text-gray-400 font-serif italic max-w-2xl text-center">"Recognizing excellence across every discipline of the stage."</p></Reveal>
             </section>

             <div className="max-w-7xl mx-auto px-6 py-16">
                {['tier1', 'tier2', 'tier3'].map((tierKey, index) => {
                   const tierTitle = tierKey === 'tier1' ? 'Major Awards' : tierKey === 'tier2' ? 'Creative & Technical' : 'Fan Favorites';
                   const tierColor = tierKey === 'tier1' ? '#D4AF37' : tierKey === 'tier2' ? '#800020' : '#1F2937';
                   
                   return (
                     <div key={tierKey} className="mb-40 relative">
                        <Reveal delay={300}>
                          <div className="flex items-center gap-4 mb-20 border-b-4 pb-6" style={{borderColor: tierColor}}>
                              <h3 className="text-3xl md:text-5xl font-bold tracking-tight" style={{color: tierColor}}>Tier {index + 1}: {tierTitle}</h3>
                          </div>
                        </Reveal>
                        
                        <div className="space-y-32">
                           {awardsData[tierKey].map((cat, idx) => (
                              <div key={idx}>
                                 <Reveal delay={100}>
                                    <div className="text-center mb-12">
                                       <h4 className="text-2xl md:text-4xl font-bold font-serif mb-2">{cat.title}</h4>
                                       <div className="h-1 w-24 mx-auto bg-gray-200"></div>
                                    </div>
                                 </Reveal>
                                 
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                                    {cat.nominees.map((nominee, nIdx) => (
                                       <Reveal key={nIdx} delay={nIdx * 50}>
                                          <div className="group flex flex-col gap-4 relative">
                                             {/* Card Container */}
                                             <div className="w-full relative overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 bg-gray-100" style={{aspectRatio: '7/10'}}>
                                                {/* Image */}
                                                {nominee.img.startsWith('bg-') ? (
                                                  <div className={`w-full h-full ${nominee.img}`}></div>
                                                ) : (
                                                  <img src={nominee.img} alt={nominee.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                )}
                                                
                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                                
                                                {/* Floating Badge (optional aesthetic touch) */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                   <div className="bg-white text-black p-1.5 rounded-full shadow-lg">
                                                      <Star size={12} fill="black" />
                                                   </div>
                                                </div>
                                             </div>

                                             {/* Text Content */}
                                             <div className="text-center">
                                                <h5 className="text-lg font-bold leading-tight mb-1 group-hover:text-[#7B1E26] transition-colors">{nominee.name}</h5>
                                                <p className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">{nominee.role}</p>
                                             </div>
                                          </div>
                                       </Reveal>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                   )
                })}
             </div>
          </div>
        )}
        
        {/* --- PLAYS PAGE (NEW) --- */}
        {activeTab === 'plays' && (
          <div className="fade-in pb-20">
             <section className="relative py-24 px-6 flex flex-col items-center justify-center bg-[#111] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <Reveal><h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-center mb-6">THE <span className="text-[#7B1E26] italic">PLAYS</span></h2></Reveal>
                <Reveal delay={200}><p className="text-xl md:text-2xl text-gray-400 font-serif italic max-w-2xl text-center">"Stories that moved us. Moments that defined 2025."</p></Reveal>
             </section>

             <div className="flex flex-col">
                {plays2025.map((play, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div key={play.id} className={`min-h-[85vh] md:min-h-[80vh] flex flex-col md:flex-row relative group overflow-hidden border-b border-gray-100/10 ${!isEven ? 'bg-gray-50 md:bg-transparent' : 'bg-white'}`}>
                       {/* Background Mood Color */}
                       <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000" style={{backgroundColor: play.color}}></div>
                       
                       {/* Image Section */}
                       <div className={`w-full md:w-1/2 relative p-8 md:p-16 flex items-center justify-center z-10 ${isEven ? 'md:order-1' : 'md:order-2 md:bg-gray-50'}`}>
                          <Reveal delay={100} className="w-full h-full flex items-center justify-center">
                             <div className={`relative shadow-2xl transition-transform duration-700 hover:scale-[1.02] hover:rotate-1 
                                ${play.orientation === 'landscape' ? 'w-full aspect-video' : 
                                  play.orientation === 'square' ? 'w-full max-w-md aspect-square' : 
                                  'h-[60vh] aspect-[2/3]'}`}>
                                <img src={play.image} alt={play.title} loading="lazy" className="w-full h-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
                                {/* Reflection/Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                             </div>
                          </Reveal>
                       </div>

                       {/* Text Section */}
                       <div className={`w-full md:w-1/2 p-8 md:p-20 flex flex-col justify-center z-10 ${isEven ? 'md:order-2 bg-white' : 'md:order-1 md:bg-white'} ${!isEven ? 'bg-transparent' : ''}`}>
                          <Reveal delay={300}>
                             <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-12 bg-[#7B1E26]"></span>
                                <span className="text-[#7B1E26] font-bold uppercase tracking-widest text-xs">{play.genre}</span>
                             </div>
                          </Reveal>
                          
                          <Reveal delay={400}>
                             <h3 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-[1.1]">{play.title}</h3>
                          </Reveal>
                          
                          <Reveal delay={500}>
                             <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 font-light">{play.description}</p>
                          </Reveal>
                          
                          <Reveal delay={600}>
                             <div className="space-y-2 mb-10">
                                <p className="text-sm font-bold uppercase tracking-widest text-black">Directed by</p>
                                <p className="text-gray-600 font-serif italic text-lg">{play.director}</p>
                             </div>
                          </Reveal>

                          <Reveal delay={700}>
                             <button 
                                onClick={() => window.open('https://forms.gle/VNTwMaaanYgJzBoo7', '_blank')}
                                className="self-start px-8 py-3 border border-black text-black uppercase tracking-widest text-xs font-bold hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2">
                                <Vote size={16} /> Vote for Play
                             </button>
                          </Reveal>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* Charity Tab Content */}
        {activeTab === 'charity' && (
          <div className="fade-in max-w-7xl mx-auto px-6 py-20">
             <div className="text-center mb-20 space-y-4">
                <Reveal><h2 className="text-5xl md:text-7xl font-bold tracking-tighter">OUR <span className="text-[#7B1E26] italic">CAUSE</span></h2></Reveal>
                <Reveal delay={200}><p className="text-xl text-gray-500 italic font-serif">"Art with a purpose. Solidarity in action."</p></Reveal>
             </div>

             <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-12 text-lg leading-relaxed text-gray-700 font-serif">
                   <Reveal delay={300}>
                      <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#7B1E26] first-letter:mr-1 float-left">T</p>
                      <p>he Spart Awards is also a charity event, with all proceeds going towards emergency aid in Gaza. For the past years, an ongoing humanitarian crisis has tragically unfolded in Palestine. Hundreds of thousands of innocent men, women, and children have lost their lives or suffered life-altering injuries.</p>
                   </Reveal>
                   
                   <Reveal delay={400}>
                      <div className="w-full h-64 bg-stone-200 flex items-center justify-center text-stone-400 border border-stone-300 mb-8 md:hidden">
                        <img src={charity1} alt="Charity 1" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <p>The hostilities have displaced an estimated 90% of Gaza’s population, leaving them with severely limited access to medical care, food, and shelter—a situation made even more dire as winter approaches.</p>
                   </Reveal>

                   <Reveal delay={500}>
                      <div className="border-l-4 border-[#7B1E26] pl-6 py-2 my-8 italic text-xl text-[#7B1E26]">"While we can't change the world overnight, we believe that every small act makes a difference."</div>
                   </Reveal>

                   <Reveal delay={600}>
                      <p>SPART was blessed to have a year that brought our community together to make memories and smile through various events. However, we are fully aware and acknowledge that this is a blessing not many have had the privilege of experiencing this year. The world is going through immense hardship in Gaza, Sudan, Congo, and various other places.</p>
                   </Reveal>

                   <Reveal delay={700}>
                      <p>We have been lucky enough to partner with a trustworthy organization that sends emergency funds to Gaza in the form of food and aid. By attending the Spart Awards, you are directly contributing to this vital relief effort.</p>
                   </Reveal>

                   <div className="text-center mt-8">
                      <a href="https://www.instagram.com/yaqob.salama" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm inline-flex items-center gap-2 hover:text-[#7B1E26] transition-colors">
                          <Instagram size={16} />
                          source: @yaqob.salama
                      </a>
                   </div>

                   <Reveal delay={800}>
                      <div className="pt-8">
                        <button onClick={handleGetTickets} className="bg-[#7B1E26] text-white px-8 py-4 rounded-none font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-black transition-all flex items-center gap-3"><Ticket size={20} /> Purchase Ticket to Support</button>
                      </div>
                   </Reveal>
                </div>

                <div className="hidden md:flex flex-col gap-8 sticky top-24">
                   <Reveal delay={400}>
                      <div className="w-full aspect-[4/3] bg-stone-200 flex flex-col items-center justify-center text-stone-400 border border-stone-300 relative group overflow-hidden">
                         <img src={charity1} alt="Charity 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                         <Heart size={64} strokeWidth={0.5} className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <span className="mt-4 uppercase tracking-widest text-xs font-bold absolute z-10 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">Aid Distribution</span>
                      </div>
                   </Reveal>
                   <Reveal delay={600}>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="w-full aspect-square bg-[#1F1F1F] flex items-center justify-center text-white/20 border border-black/10">
                            <img src={charity2} alt="Charity 2" loading="lazy" className="w-full h-full object-cover" />
                         </div>
                         <div className="w-full aspect-square bg-[#7B1E26] flex items-center justify-center text-white/20 border border-[#7B1E26]/10">
                            <img src={charity3} alt="Charity 3" loading="lazy" className="w-full h-full object-cover" />
                         </div>
                      </div>
                   </Reveal>
                   <Reveal delay={800}>
                      <div className="w-full aspect-video bg-stone-100 flex flex-col items-center justify-center text-stone-400 border border-stone-200">
                        <img src={charity4} alt="Charity 4" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                   </Reveal>
                </div>
             </div>
             
             <div className="mt-24 border-t border-[#7B1E26]/20 pt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                   <Reveal delay={900}>
                      <h4 className="text-6xl font-bold text-[#7B1E26] mb-2">100%</h4>
                      <p className="text-gray-500 uppercase tracking-widest text-sm">Proceeds Donated</p>
                   </Reveal>
                   <Reveal delay={1000}>
                      <h4 className="text-6xl font-bold text-[#7B1E26] mb-2">Gaza</h4>
                      <p className="text-gray-500 uppercase tracking-widest text-sm">Primary Focus</p>
                   </Reveal>
                   <Reveal delay={1100}>
                      <h4 className="text-6xl font-bold text-[#7B1E26] mb-2">Urgent</h4>
                      <p className="text-gray-500 uppercase tracking-widest text-sm">Aid Status</p>
                   </Reveal>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0"><span className="font-bold text-xl tracking-tighter">SPART<span className="text-[#7B1E26]">AWARDS</span></span><p className="text-xs text-gray-400 mt-1">© 2025 SPART Organization. All rights reserved.</p></div>
          <div className="flex space-x-6 text-sm uppercase tracking-widest text-gray-500"><button onClick={() => handleNavClick('home')} className="hover:text-black">Home</button><button onClick={handleGetTickets} className="hover:text-black">Tickets</button><a href="#" className="hover:text-black">Privacy</a><a href="#" className="hover:text-black">Press</a></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
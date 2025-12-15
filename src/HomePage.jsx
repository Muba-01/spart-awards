import React, { useState, useRef, useEffect } from 'react';
import { 
  Ticket, 
  Vote, 
  Heart, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';

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


const HomePage = ({ activeTab, handleNavClick, handleGetTickets, nominees, awardsData, sponsors }) => {
  const [activePoster, setActivePoster] = useState(1);
  const nextPoster = () => setActivePoster((prev) => (prev + 1) % nominees.plays.length);
  const prevPoster = () => setActivePoster((prev) => (prev - 1 + nominees.plays.length) % nominees.plays.length);

  return (
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
                      <img src={play.image} alt={play.title} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      <div className="w-full h-full text-white flex flex-col items-end justify-end p-6 text-left absolute top-0 left-0 right-0 bottom-0">
                         <div className="absolute top-4 right-4 text-[#7B1E26]"><Star fill="#7B1E26" size={24} /></div>
                         <div className="relative z-10 w-full">
                           <h3 className="text-2xl font-bold mb-2 font-serif leading-tight">{play.title}</h3>
                           <div className="h-0.5 w-10 bg-[#7B1E26] mb-2"></div>
                           <p className="text-xs italic opacity-80 mb-4"></p>

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
  );
};

export default HomePage;
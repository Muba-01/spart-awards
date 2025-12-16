import React, { useState, useRef, useEffect } from 'react';

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

const PlaysPage = ({ plays2025 }) => {
  return (
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
                          onClick={() => window.open('https://forms.gle/4eUHWjgGphPeqzH98', '_blank')}
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
  );
};

export default PlaysPage;
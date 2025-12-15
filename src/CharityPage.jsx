import React, { useState, useRef, useEffect } from 'react';
import { Heart, Instagram, Ticket } from 'lucide-react';

// Charity & Sponsors
import charity1 from './assets/charity1.webp';
import charity2 from './assets/charity2.webp';
import charity3 from './assets/charity3.webp';
import charity4 from './assets/charity4.webp';


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

const CharityPage = ({ handleGetTickets }) => {
  return (
    <div className="fade-in max-w-7xl mx-auto px-6 py-20">
       <div className="text-center mb-20 space-y-4">
          <Reveal><h2 className="text-5xl md:text-7xl font-bold tracking-tighter">OUR <span className="text-[#7B1E26] italic">CAUSE</span></h2></Reveal>
          <Reveal delay={200}><p className="text-xl text-gray-500 italic font-serif">"Art with a purpose. Solidarity in action."</p></Reveal>
       </div>

       <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-12 text-lg leading-relaxed text-gray-700 font-serif">
                   <Reveal delay={300}>
                      <div className="flex items-end">
                         <span className="text-5xl font-bold text-[#7B1E26] mr-2">The</span>
                         <span className="text-lg leading-relaxed text-gray-700 font-serif">Spart Awards is also a charity event, with all proceeds going towards emergency aid in Gaza. For the past years, an ongoing humanitarian crisis has tragically unfolded in Palestine. Hundreds of thousands of innocent men, women, and children have lost their lives or suffered life-altering injuries.</span>
                      </div>
                   </Reveal>             <Reveal delay={400}>
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
  );
};

export default CharityPage;
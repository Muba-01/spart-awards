import React from 'react';
import { Star } from 'lucide-react';

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


const CategoriesPage = ({ activeTab, handleNavClick, awardsData }) => {
  return (
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
          </div>
  );
};

export default CategoriesPage;
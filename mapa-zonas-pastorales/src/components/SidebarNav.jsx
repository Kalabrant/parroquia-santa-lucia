import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Map, MapPin } from 'lucide-react';
import zonas from '../data/zonas.json';
import { getTheme } from '../lib/theme';

export default function SidebarNav({ activeZoneId, onZoneSelect }) {
  const scrollContainerRef = useRef(null);
  const activeItemRef = useRef(null);

  // Efecto para hacer scroll automático hacia el elemento seleccionado (si se seleccionó desde el mapa)
  useEffect(() => {
    if (activeZoneId && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Mantiene el elemento centrado verticalmente en el sidebar
      });
    }
  }, [activeZoneId]);

  return (
    <nav className="relative h-full flex-shrink-0 w-20 md:w-72 bg-white/80 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-crema flex flex-col z-40 transition-all duration-300">
      
      <div className="p-4 md:p-8 flex items-center md:items-start justify-center md:justify-start gap-3 border-b border-crema/50">
        <div className="bg-azul-esencial p-2 md:p-3 rounded-2xl shadow-lg shadow-azul-esencial/20">
          <Map className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div className="hidden md:block">
          <h2 className="text-xl font-bold font-serif text-azul-esencial leading-tight m-0">Zonas<br/>Pastorales</h2>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-2 md:px-6 custom-scrollbar">
        {zonas.map((zona, idx) => {
          const isActive = activeZoneId === zona.id;
          const theme = getTheme(zona.id);
          
          return (
            <button
              key={zona.id}
              ref={isActive ? activeItemRef : null}
              onClick={() => onZoneSelect(zona.id)}
              className={cn(
                "group relative w-full block p-3 md:p-4 rounded-xl transition-all duration-300 text-left",
                isActive 
                  ? `${theme.text} shadow-md` // Text color is overridden by white on text contents when active, but kept here for fallback
                  : `hover:bg-crema/50 text-gray-600 ${theme.hoverText}`
              )}
            >
              {/* Background fill animation */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={cn("absolute inset-0 rounded-xl z-0", theme.bg)}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors",
                  isActive ? "bg-white/20 text-white" : `bg-crema/60 ${theme.text} group-hover:bg-white group-hover:shadow-sm`
                )}>
                  {idx + 1}
                </div>
                <div className="hidden md:block flex-1 py-1 pr-2">
                  <span className={cn(
                    "block font-bold text-[0.90rem] leading-snug mb-1 transition-colors",
                    isActive ? "text-white" : "" // inherits gray-600 or hoverText from parent if not active
                  )}>{zona.nombre}</span>
                  {zona.eslogan && (
                    <span className={cn(
                      "block text-[0.75rem] leading-snug transition-colors",
                      isActive ? "text-white/80" : `text-gray-500`
                    )}>{zona.eslogan}</span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  );
}

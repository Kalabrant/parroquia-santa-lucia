import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Crown, Info, Map as MapIcon, MapPin, X } from 'lucide-react';
import { cn } from '../lib/utils';
import zonas from '../data/zonas.json';
import { getTheme } from '../lib/theme';

export default function ZoneDetails({ activeZoneId, onClose }) {
  const zona = zonas.find(z => z.id === activeZoneId);
  const theme = zona ? getTheme(zona.id) : null;

  return (
    <AnimatePresence>
      {zona && (
        <>
          {/* Overlay oscuro móvil / md:none */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Panel Lateral con Glassmorphism */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-[90%] md:w-[450px] lg:w-[500px] z-50 overflow-hidden flex flex-col bg-white/90 backdrop-blur-xl shadow-2xl border-l border-white/50"
          >
            {/* Cabecera / Hero Interno del Panel */}
            <div className={cn("relative h-48 md:h-56 bg-gradient-to-br flex flex-col justify-end p-6 md:p-8 shrink-0", theme.gradient)}>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-[60] p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <span className="inline-block px-3 py-1 bg-white/20 text-white backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  Zona {zona.id}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight shadow-black/20">
                  {zona.nombre}
                </h2>
                {zona.eslogan && (
                  <p className="text-white/80 mt-2 font-medium italic">"{zona.eslogan}"</p>
                )}
              </motion.div>
            </div>

            {/* Contenido Scrolleable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
              
              {/* Historia Eliminada a Petición */}

              {/* Sección: Patrono */}
              {zona.patrono && (
                <motion.section 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                  className="bg-crema/40 p-5 rounded-2xl border border-crema"
                >
                  <div className={cn("flex items-center gap-2 mb-3", theme.text)}>
                    <Crown className="w-5 h-5" />
                    <h3 className="text-xl font-serif font-bold m-0 border-none">
                      {zona.patrono.genero === "F" ? "Su Patrona" : "Su Patrono"}
                    </h3>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{zona.patrono.nombre}</h4>
                  <p className="text-sm font-bold text-marron-madera mb-3">Fiesta: {zona.patrono.fiesta}</p>
                  <p className="text-gray-600 leading-relaxed text-sm italic font-serif">
                    {zona.patrono.hagiografia}
                  </p>
                </motion.section>
              )}

              {/* Galería / Lugares eliminada a petición */}

              {/* Map CTA Eliminado */}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

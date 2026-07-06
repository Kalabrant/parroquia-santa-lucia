import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Map as MapIcon, Users, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function WelcomeCard({ isVisible, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ x: '100%', opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           exit={{ x: '100%', opacity: 0 }}
           className="hidden md:flex absolute right-0 top-0 h-full w-[90%] md:w-[450px] lg:w-[500px] z-40 overflow-hidden flex-col bg-white/90 backdrop-blur-xl shadow-2xl border-l border-white/50"
        >
          <div className="relative h-48 md:h-56 bg-gradient-to-br from-azul-esencial to-azul-oscuro flex flex-col justify-end p-6 md:p-8 shrink-0">
             <button 
               onClick={onClose}
               className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
               aria-label="Cerrar detalles"
             >
               <X className="w-5 h-5" />
             </button>
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="relative z-10"
             >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                    <MapIcon className="w-4 h-4" /> Territorio y Misión
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight shadow-black/20">
                  Zonas Pastorales
                </h2>
                <p className="text-white/80 mt-2 font-medium italic">"Una iglesia en salida, cercana a todos."</p>
             </motion.div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 custom-scrollbar text-gray-700">
             <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center gap-2 mb-3 text-azul-esencial">
                   <Info className="w-6 h-6" />
                   <h3 className="text-xl font-serif font-bold m-0 border-none text-azul-esencial">¿Qué son?</h3>
                </div>
                <p className="leading-relaxed text-[0.95rem]">
                   Las <strong>Zonas Pastorales</strong> son divisiones territoriales estratégicas impulsadas por nuestra parroquia para descentralizar la evangelización y acercar la misión de la Iglesia a cada comunidad de manera personalizada.
                </p>
             </motion.section>

             <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-crema/40 p-5 rounded-2xl border border-crema/80">
                <div className="flex items-center gap-2 mb-3 text-marron-madera">
                   <Users className="w-5 h-5" />
                   <h3 className="text-[1.1rem] font-serif font-bold m-0 border-none">Propósito Comunitario</h3>
                </div>
                <p className="leading-relaxed text-sm">
                   Organizadas gráfica y organizativamente, su principal fin es garantizar que la atención pastoral, los sacramentos y la caridad fraterna lleguen dinámicamente a todos los rincones, asegurando que ninguna familia quede desatendida.
                </p>
             </motion.section>

             <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="leading-relaxed italic text-gray-400 text-sm md:text-[0.95rem] text-center border-t border-gray-200 block pt-6">
                   💡 Selecciona un número en el <strong>mapa</strong> o un sector en el <strong>menú lateral</strong> para descubrir su patrono asignado.
                </p>
             </motion.section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

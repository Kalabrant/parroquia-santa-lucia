import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import zonas from '../data/zonas.json';
import { getTheme } from '../lib/theme';

// Las coordenadas ahora se leen directamente del archivo zonas.json
// para que el usuario pueda editarlas fácilmente a mano.

export default function InteractiveMap({ activeZoneId, onZoneSelect, isPanelOpen }) {
  // Función de ayuda para ubicar coordenadas:
  // Haz clic en cualquier parte de la imagen y mira la consola del navegador.
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`Coordenada clickeada -> "x": "${x.toFixed(1)}%", "y": "${y.toFixed(1)}%"`);
  };

  return (
    <div className={cn(
      "relative w-full h-full bg-[#f8f9fa] overflow-hidden flex items-center justify-center p-4 transition-all duration-500",
      isPanelOpen ? "xl:pr-[500px]" : "xl:pr-0"
    )}>
      
      {/* Contenedor principal que se ajusta exacto a las medidas máximas permitidas del viewport */}
      <motion.div 
        layout 
        className="relative inline-block" 
      >
        {/* LA IMAGEN DEL MAPA REAL con restricciones de alto y ancho */}
        <img 
          src="./mapa-parroquia.webp" 
          alt="Mapa Original de las Zonas Pastorales"
          className="w-auto h-auto max-w-full md:max-w-3xl xl:max-w-4xl max-h-[55vh] md:max-h-[75vh] lg:max-h-[85vh] object-contain rounded-xl drop-shadow-xl cursor-crosshair"
          onClick={handleMapClick}
        />

        {/* Capa conteniendo los pines sobre la imagen */}
        {zonas.map((zona) => {
          const isActive = activeZoneId === zona.id;
          // Usar coordenadas directamente del archivo JSON
          const pos = zona.coordenadas || { x: '50%', y: '50%' };
          const theme = getTheme(zona.id);

          return (
            <motion.div
              key={zona.id}
              className="absolute"
              style={{ left: pos?.x, top: pos?.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * zona.id, type: "spring" }}
            >
              <button
                onClick={() => onZoneSelect(zona.id)}
                className="relative group focus:outline-none -translate-x-1/2 -translate-y-1/2" // -translate para centrar exacto en la coord
              >
                {/* Ping animation behind the dot */}
                {isActive && (
                  <span className={cn("absolute -inset-4 rounded-full animate-ping opacity-40", theme.bg)} />
                )}

                {/* El pin estilo marcador que resalta la zona - AHORA SEMITRANSPARENTE */}
                <motion.div 
                  className={cn(
                    "relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 z-10 shadow-lg backdrop-blur-md",
                    isActive 
                      ? `${theme.bg} border-2 border-white scale-125` 
                      : "bg-white/80 border border-gray-300 hover:scale-110"
                  )}
                  style={!isActive ? { borderColor: theme.style.color, color: theme.style.color } : {}}
                  whileHover={{ scale: isActive ? 1.25 : 1.15 }}
                >
                  <span className={cn(
                    "text-sm md:text-base font-black",
                    isActive ? "text-white" : ""
                  )} style={!isActive ? { color: theme.style.color } : {}}>
                    {zona.id}
                  </span>
                </motion.div>

                {/* Etiqueta Flotante con el Nombre para orientarse mejor */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-3 w-max max-w-[150px] md:max-w-[200px] text-center",
                        "pointer-events-none transition-all duration-300 z-50"
                      )}
                    >
                      <div className="px-3 py-1.5 p-1 rounded-lg bg-azul-oscuro text-white text-xs md:text-sm font-bold shadow-xl shadow-azul-oscuro/40 border border-white/20 backdrop-blur-sm">
                        {zona.nombre}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

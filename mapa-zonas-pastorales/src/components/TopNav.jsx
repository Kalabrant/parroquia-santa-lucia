import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export default function TopNav() {
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    // Autohide badge if date is after May 22, 2026
    const expireDate = new Date('2026-05-22');
    if (new Date() > expireDate) {
      setShowBadge(false);
    }
  }, []);

  return (
    <nav className="flex justify-between items-center px-4 md:px-[5%] h-[72px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-0 z-[100] w-full border-b border-crema flex-shrink-0">
      <div className="font-extrabold text-lg md:text-xl text-azul-esencial tracking-tight">
        <a href="../index.html" className="hover:opacity-80 transition-opacity">PARROQUIA DE SANTA LUCÍA</a>
      </div>
      
      {/* Menú normal para escritorio */}
      <ul className="hidden lg:flex list-none m-0 p-0 items-center gap-4 xl:gap-7">
        <li><a href="../index.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial transition-colors whitespace-nowrap">Inicio</a></li>
        <li><a href="../nosotros.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial transition-colors whitespace-nowrap">Nosotros</a></li>
        <li><a href="../evangelizacion.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial transition-colors whitespace-nowrap">Evangelización</a></li>
        <li><a href="../sacramentos.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial transition-colors whitespace-nowrap">Sacramentos</a></li>
        <li><a href="../comunidad.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial transition-colors whitespace-nowrap">Comunidad</a></li>
        <li><a href="../eventos.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial transition-colors whitespace-nowrap">Eventos</a></li>
        <li>
          <a href="#" className="font-semibold text-sm text-azul-esencial transition-colors text-center inline-block">
            <span className="block">Zonas Pastorales</span>
            {showBadge && (
              <span className="inline-block bg-[#ff3b30] text-white text-[0.65rem] px-[6px] py-[2px] rounded-[10px] font-bold animate-pulse mt-0.5">
                ¡Nuevo!
              </span>
            )}
          </a>
        </li>
        <li><a href="../150-anos.html" className="bg-gradient-to-br from-[#b8860b] via-[#d4af37] to-[#b8860b] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap">150 Años</a></li>
        <li><a href="../contacto.html" className="bg-azul-esencial text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-azul-oscuro transition-all hover:-translate-y-0.5 whitespace-nowrap">Contáctanos</a></li>
      </ul>
      
      {/* Botón menú móvil básico */}
      <div className="lg:hidden">
         <a href="../index.html" className="font-semibold text-sm text-gray-800 hover:text-azul-esencial">
            &#8592; Volver a web
         </a>
      </div>
    </nav>
  );
}

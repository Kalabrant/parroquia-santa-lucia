import React, { useState } from 'react';
import TopNav from './components/TopNav';
import InteractiveMap from './components/InteractiveMap';
import SidebarNav from './components/SidebarNav';
import ZoneDetails from './components/ZoneDetails';
import WelcomeCard from './components/WelcomeCard';

function App() {
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  const handleZoneSelect = (id) => {
    setActiveZoneId(id);
    // Para no ser molesto, si el usuario selecciona una zona, asumimos que ya no necesita la tarjeta de bienvenida activa para después
    setIsWelcomeOpen(false);
  };

  const handleClosePanel = () => {
    setActiveZoneId(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] overflow-hidden font-sans">
      {/* Barra de Navegación Global */}
      <TopNav />
      
      {/* Contenedor Inferior */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Navegación Lateral */}
        <SidebarNav 
          activeZoneId={activeZoneId} 
          onZoneSelect={handleZoneSelect} 
        />

        {/* Área Principal (Mapa) */}
        <main className="flex-1 relative overflow-hidden w-full h-full flex"> 
          <InteractiveMap 
            activeZoneId={activeZoneId} 
            onZoneSelect={handleZoneSelect} 
            isPanelOpen={!!activeZoneId || isWelcomeOpen}
          />
          
          {/* Tarjeta de Bienvenida explicativa (Activa al inicio o si la reabren) */}
          <WelcomeCard 
            isVisible={!activeZoneId && isWelcomeOpen} 
            onClose={() => setIsWelcomeOpen(false)}
          />

          {/* Panel de Detalles (Oculto si no hay zona seleccionada) */}
          <ZoneDetails 
            activeZoneId={activeZoneId} 
            onClose={handleClosePanel} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;

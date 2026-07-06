export const zoneThemes = {
  1: { 
    id: 1, name: "Azul Esencial", 
    gradient: "from-[#0077b6] to-black/80", 
    bg: "bg-[#0077b6]",
    text: "text-[#0077b6]",
    border: "border-[#0077b6]",
    ring: "ring-[#0077b6]",
    hoverText: "hover:text-[#0077b6]",
    style: { color: "#0077b6" }
  },
  2: { 
    id: 2, name: "Verde Esmeralda", 
    gradient: "from-[#059669] to-black/80", 
    bg: "bg-[#059669]",
    text: "text-[#059669]",
    border: "border-[#059669]",
    ring: "ring-[#059669]",
    hoverText: "hover:text-[#059669]",
    style: { color: "#059669" }
  },
  3: {
    id: 3, name: "Ámbar Miel",
    gradient: "from-[#b45309] to-black/80",
    bg: "bg-[#b45309]",
    text: "text-[#b45309]",
    border: "border-[#b45309]",
    ring: "ring-[#b45309]",
    hoverText: "hover:text-[#b45309]",
    style: { color: "#b45309" }
  },
  4: {
    id: 4, name: "Rojo Vino",
    gradient: "from-[#be123c] to-black/80",
    bg: "bg-[#be123c]",
    text: "text-[#be123c]",
    border: "border-[#be123c]",
    ring: "ring-[#be123c]",
    hoverText: "hover:text-[#be123c]",
    style: { color: "#be123c" }
  },
  5: {
    id: 5, name: "Azul Cerúleo",
    gradient: "from-[#0284c7] to-black/80",
    bg: "bg-[#0284c7]",
    text: "text-[#0284c7]",
    border: "border-[#0284c7]",
    ring: "ring-[#0284c7]",
    hoverText: "hover:text-[#0284c7]",
    style: { color: "#0284c7" }
  },
  6: {
    id: 6, name: "Púrpura Real",
    gradient: "from-[#6d28d9] to-black/80",
    bg: "bg-[#6d28d9]",
    text: "text-[#6d28d9]",
    border: "border-[#6d28d9]",
    ring: "ring-[#6d28d9]",
    hoverText: "hover:text-[#6d28d9]",
    style: { color: "#6d28d9" }
  },
  7: {
    id: 7, name: "Naranja Óxido",
    gradient: "from-[#9a3412] to-black/80",
    bg: "bg-[#9a3412]",
    text: "text-[#9a3412]",
    border: "border-[#9a3412]",
    ring: "ring-[#9a3412]",
    hoverText: "hover:text-[#9a3412]",
    style: { color: "#9a3412" }
  },
  8: {
    id: 8, name: "Oliva Bosque",
    gradient: "from-[#3f6212] to-black/80",
    bg: "bg-[#3f6212]",
    text: "text-[#3f6212]",
    border: "border-[#3f6212]",
    ring: "ring-[#3f6212]",
    hoverText: "hover:text-[#3f6212]",
    style: { color: "#3f6212" }
  },
  9: {
    id: 9, name: "Borgoña Oscuro",
    gradient: "from-[#701a75] to-black/80",
    bg: "bg-[#701a75]",
    text: "text-[#701a75]",
    border: "border-[#701a75]",
    ring: "ring-[#701a75]",
    hoverText: "hover:text-[#701a75]",
    style: { color: "#701a75" }
  }
};

export const getTheme = (id) => {
  return zoneThemes[id] || zoneThemes[1];
};

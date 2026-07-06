import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { rename } from 'node:fs/promises'
import { resolve } from 'node:path'

// El index.html de la raíz es el ARTEFACTO desplegado (build copiado),
// así que la entrada de desarrollo vive en dev.html. Al compilar,
// dist/dev.html se renombra a dist/index.html para poder desplegar
// dist/* tal cual sobre esta carpeta.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'renombrar-dev-html',
      closeBundle: async () => {
        await rename(
          resolve(__dirname, 'dist/dev.html'),
          resolve(__dirname, 'dist/index.html')
        )
      },
    },
  ],
  base: './',
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'dev.html'),
    },
  },
})

import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite';

export default defineConfig({
    server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),  // 👈 before viteReact
    nitro(),
    viteReact(),
  ],
})


// import { tanstackStart } from '@tanstack/react-start/plugin/vite';
// import { defineConfig } from 'vite';
// import viteReact from '@vitejs/plugin-react';
// import { nitro } from 'nitro/vite';

// export default defineConfig({
//   plugins: [tanstackStart(), nitro(), viteReact()],
// });
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Forces PWA to work in npm run dev!
      },
      manifest: {
        name: "SafeLink - Smart City Safety",
        short_name: "SafeLink",
        theme_color: "#4f46e5",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192 512x512 1024x1024",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        shortcuts: [
          {
            name: "🚨 SOS Emergency",
            short_name: "SOS",
            description: "Immediately trigger an SOS emergency alert with your live location",
            url: "/sos",
            icons: [
              {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png"
              }
            ]
          }
        ]
      }
    })
  ],
})

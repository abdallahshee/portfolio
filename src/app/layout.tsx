import './globals.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'

import type { Metadata } from 'next'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scroll-top'
import { ScrollToTopOnRouteChange } from '@/components/scroll-top-on-route-chnage'

export const metadata: Metadata = {
  title: 'Abdallah Shee',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

const THEME_INIT_SCRIPT = `(function(){
  try {
    var stored = window.localStorage.getItem('theme');
    var resolved = stored === 'light' ? 'light' : 'dark'; // ← defaults to dark if nothing stored
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
    root.setAttribute('data-mantine-color-scheme', resolved);
    root.setAttribute('data-theme', resolved);

    document.addEventListener('DOMContentLoaded', function() {
      root.setAttribute('data-mantine-color-scheme', resolved);
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
    });
  } catch(e) {}
})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="top-right" />

          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 w-full px-3 pb-10 pt-20 sm:px-4 sm:pb-12 md:px-6 md:pb-14 lg:px-8 lg:pb-16">
              <ScrollToTopOnRouteChange />
              {children}
              <ScrollToTop />
            </main>
            <Footer />
          </div>
        </MantineProvider>
      </body>
    </html>
  )
}

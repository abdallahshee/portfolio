import {
  ErrorComponent,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'

import '@mantine/core/styles.css'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Container, MantineProvider } from '@mantine/core'
import '@mantine/notifications/styles.css'
import "@mantine/tiptap/styles.css"
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Notifications } from '@mantine/notifications'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollTop'
import { useEffect } from 'react'
import { ScrollToTopOnRouteChange } from '@/components/ScrollTopOnRouteChnage'
import { getUserAndRole } from '@/server/user.functions'

interface MyRouterContext {
  queryClient: QueryClient
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

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const { user, isAdmin } = await getUserAndRole()
    return { user, isAdmin }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Abdallah Shee' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
  // notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
})

function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = (event: any) => {
      console.warn("Vite preload error detected → reloading app")
      event.preventDefault()
      window.location.reload()
    }
    window.addEventListener("vite:preloadError", handler)
    return () => window.removeEventListener("vite:preloadError", handler)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Notifications position="top-right" />

      <Header />
<Container size='2xl'>
      <main className="flex-1 px-3 pb-10 pt-20 sm:px-4 sm:pb-12 md:px-6 md:pb-14 lg:px-8 lg:pb-16">
        <ScrollToTopOnRouteChange />
        {children}
        <ScrollToTop />
      </main>
</Container>
      <Footer />

      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          TanStackQueryDevtools,
        ]}
      />
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <MantineProvider defaultColorScheme="dark">
          <TanStackQueryProvider>
            <AppShell>{children}</AppShell>
          </TanStackQueryProvider>
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  )
}
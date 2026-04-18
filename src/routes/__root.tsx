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
import { MantineProvider } from '@mantine/core'
import '@mantine/notifications/styles.css'
import "@mantine/tiptap/styles.css"
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Notifications } from '@mantine/notifications'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollTop'
import NotFound from "../components/NotFound"
import { useRouterState } from '@tanstack/react-router'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { ScrollToTopOnRouteChange } from '@/components/ScrollTopOnRouteChnage'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){
  try {
    var stored = window.localStorage.getItem('theme');
    var resolved = stored === 'dark' ? 'dark' : 'light';
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
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
})

function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowserClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ EXISTING AUTH EFFECT
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data?.session ?? null)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setIsLoading(false)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  // ✅ NEW: Handle Vite dynamic import errors (VERY IMPORTANT)
  useEffect(() => {
    const handler = (event: any) => {
      console.warn("Vite preload error detected → reloading app")
      event.preventDefault()
      window.location.reload()
    }

    window.addEventListener("vite:preloadError", handler)

    return () => {
      window.removeEventListener("vite:preloadError", handler)
    }
  }, [])



  return (
    <>
      <Notifications position="top-right" />



      <main
        className=

        'container mx-auto w-full max-w-full px-3 pb-10 pt-20 sm:px-4 sm:pb-12 md:px-6 md:pb-14 lg:px-8 lg:pb-16'


      >
        <ScrollToTopOnRouteChange />
        {children}
        <ScrollToTop />
      </main>

      <Footer />

      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          TanStackQueryDevtools,
        ]}
      />
    </>
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
        <MantineProvider defaultColorScheme="auto">
          <TanStackQueryProvider>
            <AppShell>{children}</AppShell>
          </TanStackQueryProvider>
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  )
}
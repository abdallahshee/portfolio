import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'

import '@mantine/core/styles.css';
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { MantineProvider} from '@mantine/core';
import '@mantine/notifications/styles.css'
import "@mantine/tiptap/styles.css"
import appCss from '../styles.css?url'

import { useQuery, type QueryClient } from '@tanstack/react-query'
import { Notifications } from '@mantine/notifications'
import Header from '@/components/Header'
import ScrollToTop from '@/components/ScrollTop'
import NotFound from "../components/NotFound"
import { getSessionQueryOptions } from '@/server/utils.function'
import { useRouterState } from '@tanstack/react-router';

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

    // Reapply after DOM loads to win against Mantine hydration
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
      { title: 'TanStack Start Starter' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getSessionQueryOptions())
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

// ✅ This component is INSIDE the providers — useQuery works here
function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session,isLoading } = useQuery(getSessionQueryOptions())
 

  const isAdminRoute = useRouterState({
    select: (s) => s.location.pathname.startsWith('/admin'),
  })

  const showHeader = !isAdminRoute

  return (
    <>
      {/* <ThemeToggle /> */}
      {/* {isLoading && 
       <Skeleton height={34} width={120} radius="xl" className="ml-4 flex-shrink-0" />
      } */}
      {showHeader && <Header />}
       <main className={showHeader || isLoading ? "pt-20" : ""}>
        <Notifications />
        {children}
        <ScrollToTop />
      </main>
      {!isAdminRoute && <Footer />}
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

// ✅ RootDocument just sets up providers — no hooks here
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
          <MantineProvider
          defaultColorScheme="auto"
      
        >
          <TanStackQueryProvider>
            <AppShell>
              {children}
            </AppShell>
          </TanStackQueryProvider>
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  )
}
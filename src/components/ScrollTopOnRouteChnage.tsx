import { useEffect } from "react"
import { useRouterState } from "@tanstack/react-router"

export function ScrollToTopOnRouteChange() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return null
}
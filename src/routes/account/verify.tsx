import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/verify')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/verify"!</div>
}

import { createFileRoute } from '@tanstack/react-router'
import { Route as ParentRoute } from './route'


export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects" list page!</div>
}
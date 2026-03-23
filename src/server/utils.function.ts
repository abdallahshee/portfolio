import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import { queryOptions } from '@tanstack/react-query'

export const getUserSession = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return session
  } catch (error) {
    // auth.api.getSession throws an HTTPError when no session exists
    return null
  }
})

export const getSessionQueryOptions=()=>queryOptions({
    queryKey:["session"],
    queryFn:()=>getUserSession()
})


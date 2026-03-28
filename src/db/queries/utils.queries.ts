
import { getSessionFn } from "@/server/auth.functions";

import { queryOptions } from "@tanstack/react-query";

export const getSessionQueryOptions = () => queryOptions({
  queryKey: ["theSession"],
  queryFn: () => getSessionFn()
})




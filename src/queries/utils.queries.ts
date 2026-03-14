import { getSession } from "@/server/utils.function";
import { queryOptions } from "@tanstack/react-query";

export const getSessionQueryOptions = () => queryOptions({
    queryKey: ["session"],
    queryFn: () => getSession()
})
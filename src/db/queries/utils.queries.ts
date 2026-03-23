import { getHireStatus, toggleHireModeStatus } from "@/server/setting.functions";
import { getUserSession } from "@/server/utils.function";

import { queryOptions } from "@tanstack/react-query";

export const getSessionQueryOptions = () => queryOptions({
    queryKey: ["session"],
    queryFn: () => getUserSession()
})

export const toggleSettingQueyOptions=(settingId:string)=>queryOptions({
    queryKey:["settings", settingId],
    queryFn:()=>toggleHireModeStatus({data:{settingId}})
})

export const hireStatusQueryOptions = (settingId: string) => queryOptions({
  queryKey: ["settings", settingId],
  queryFn: () => getHireStatus({ data: { settingId } }),
})


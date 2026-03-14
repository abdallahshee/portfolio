import { getHireStatus, toggleHireModeStatus } from "@/server/setting.functions";
import { getSession } from "@/server/utils.function";
import { queryOptions } from "@tanstack/react-query";

export const getSessionQueryOptions = () => queryOptions({
    queryKey: ["session"],
    queryFn: () => getSession()
})

export const toggleSettingQueyOptions=(settingId:string)=>queryOptions({
    queryKey:["settings", settingId],
    queryFn:()=>toggleHireModeStatus({data:{settingId}})
})

export const hireStatusQueryOptions = (settingId: string) => queryOptions({
  queryKey: ["settings", settingId],
  queryFn: () => getHireStatus({ data: { settingId } }),
})
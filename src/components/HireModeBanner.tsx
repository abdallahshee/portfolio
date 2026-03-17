// components/HireModeBanner.tsx
import { Avatar, Button, Text } from "@mantine/core"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toggleHireModeStatus } from "@/server/setting.functions"
import { hireStatusQueryOptions } from "@/queries/utils.queries"
import { authClient } from "@/lib/auth-client"

const SETTING_ID = import.meta.env.VITE_HIRE_MODE_ID

export default function HireModeBanner() {
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const [toggleLoading, setToggleLoading] = useState(false)

  const { data, isLoading } = useQuery(hireStatusQueryOptions(SETTING_ID))

  const isAdmin = session.data?.user?.role === "admin"
  const open = data?.isOpenForHire ?? false

  const handleToggle = async () => {
    console.log("SETTING_ID:", SETTING_ID) // ← add this temporarily
    try {
      setToggleLoading(true)
      const result = await toggleHireModeStatus({ data: { settingId: SETTING_ID } })
      queryClient.setQueryData(hireStatusQueryOptions(SETTING_ID).queryKey, {
        isOpenForHire: result.isOpenForHire,
      })
    } finally {
      setToggleLoading(false)
    }
  }

  if (isLoading) return null
  if (!isAdmin && !open) return null

  return (
    <div className="flex items-center gap-2">
      {open && (
        <div className="hire-banner-animate flex items-center gap-4 rounded-full border-2 border-green-300 bg-green-100 px-4 py-2 shadow-lg dark:border-green-700 dark:bg-green-900">
          {/* Pulsing dot */}
          <Avatar
            src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
            size={40}
            radius="xl"
          />

          {/* Text */}
          <Text
            size="lg"
            fw={800}
            className=" whitespace-nowrap text-green-800 dark:text-green-200"
          >

            Open to Freelance Work
          </Text>
          <span className="text-xl">💡</span>
          {/* Second emoji */}

        </div>
      )}

      {isAdmin && (
        <button
          onClick={handleToggle}
          disabled={toggleLoading}
          className={`flex items-center gap-2 rounded-full border px-4 py-2  text-lg font-700 shadow-sm transition disabled:opacity-50 whitespace-nowrap ${open
            ? "border-red-300 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-200"
            : "border-green-300 bg-green-100 text-green-800 hover:bg-green-200 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
            }`}
        >
          {toggleLoading ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <span className={`h-3.5 w-3.5 rounded-full flex-shrink-0 ${open ? "bg-red-500" : "bg-green-500"}`} />
          )}
          {toggleLoading ? "Updating…" : open ? "Disable" : "Enable"}
        </button>
      )}
    </div>
  )
}
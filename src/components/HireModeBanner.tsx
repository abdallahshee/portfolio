import { Text } from "@mantine/core"

interface HireModeBannerProps {
  open: boolean
}

export default function HireModeBanner({ open }: HireModeBannerProps) {
  if (!open) return null

  return (
    <div className="hire-banner-animate flex items-center gap-2 rounded-full border-1 border-green-300 bg-green-200 px-6 py-1 shadow-sm">
      <Text size="md" fw={600} className="whitespace-nowrap text-green-800 dark:text-green-200">
        Open for Work
      </Text>
      <span className="text-lg">💡</span>
    </div>
  )
}
import { Text } from "@mantine/core"

interface HireModeBannerProps {
  open: boolean
}

export default function HireModeBanner({ open }: HireModeBannerProps) {
  if (!open) return null

  return (
    <div className="hire-banner-animate flex items-center gap-2 rounded-full border-2  px-6 py-1 shadow-sm ">
      <Text size="md" fw={600} className="whitespace-nowrap">
        Open for Work
      </Text>
      <span className="text-lg">💡</span>
    </div>
  )
}
import { Card, Skeleton } from "@mantine/core"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Card withBorder radius="sm" p="xl">
        <Skeleton height={28} width="60%" mb="sm" />
        <Skeleton height={16} width="40%" />
      </Card>
      <Skeleton height={300} radius="lg" />
      <Card withBorder p="lg">
        <Skeleton height={16} mb="xs" />
        <Skeleton height={16} width="80%" />
      </Card>
    </div>
  )
}

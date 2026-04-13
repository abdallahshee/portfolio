import { Card, Group, Skeleton, Stack } from "@mantine/core"

export default function ArticleCardSkeleton() {
  return (
    <Card
      withBorder
      radius="lg"
      p={0}
      style={{ width: "100%", height: 520, display: "flex", flexDirection: "column" }}
    >
      <Skeleton height={230} radius={0} />
      <Stack p="md" gap="sm" style={{ flex: 1 }}>
        <Skeleton height={12} width="30%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="60%" />
        <Group gap={6} mt={4}>
          <Skeleton height={20} width={50} radius="xl" />
          <Skeleton height={20} width={60} radius="xl" />
          <Skeleton height={20} width={45} radius="xl" />
        </Group>
        <Skeleton height={12} width="90%" mt="auto" />
        <Skeleton height={12} width="70%" />
        <Group justify="space-between" mt="xs">
          <Group gap={6}>
            <Skeleton height={22} width={22} radius="xl" />
            <Skeleton height={12} width={80} />
          </Group>
          <Skeleton height={12} width={60} />
        </Group>
      </Stack>
    </Card>
  )
}
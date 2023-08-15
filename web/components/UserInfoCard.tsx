import { Avatar, Text, Paper } from '@mantine/core'

interface UserInfoCardProps {
  avatar: string
  name: string
  children?: React.ReactNode
}

export function UserInfoCard({ avatar, name, children }: UserInfoCardProps) {
  return (
    <Paper
      radius="md"
      withBorder
      sx={(theme) => ({
        padding: theme.spacing.lg,

        [theme.fn.smallerThan('md')]: {
          padding: theme.spacing.sm,
        },

        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <Avatar src={avatar} size="lg" radius={120} mx="auto" />
      <Text ta="center" fz="lg" weight={500} mt="md">
        {name}
      </Text>

      {children}
    </Paper>
  )
}

import { forwardRef } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Group, Avatar, Text, Menu, UnstyledButton, Skeleton } from '@mantine/core'
import { IconChevronRight, IconSettings, IconLogout, IconApps } from '@tabler/icons-react'
import InstallPWA from '@/components/InstallPWA'

interface UserButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'name'> {
  image: string
  name?: string | null
  email?: string | null
  icon?: React.ReactNode
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name ? name : <Skeleton height={10} />}
          </Text>

          <Text color="dimmed" size="xs">
            {email ? email : <Skeleton height={10} mt="xs" />}
          </Text>
        </div>

        {icon || <IconChevronRight size={16} />}
      </Group>
    </UnstyledButton>
  )
)

UserButton.displayName = 'UserButton'

export function UserButtonMenu(props: UserButtonProps) {
  const { image, name, email, icon } = props

  return (
    <Group position="center">
      <Menu withArrow width="95%" transitionProps={{ transition: 'pop-top-right' }}>
        <Menu.Target>
          <UserButton image={image} name={name} email={email} icon={icon} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item
            icon={<IconSettings size={14} stroke={1.5} />}
            component={Link}
            href="/profile"
          >
            Profile
          </Menu.Item>

          <InstallPWA icon={<IconApps size={14} stroke={1.5} />} />

          <Menu.Divider />

          <Menu.Item
            color="red"
            icon={<IconLogout size={14} stroke={1.5} />}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

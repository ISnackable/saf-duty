import { forwardRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { signOut } from 'next-auth/react'
import { Group, Avatar, Text, Menu, UnstyledButton, Skeleton, Switch } from '@mantine/core'
import {
  IconChevronRight,
  IconSettings,
  IconLogout,
  IconApps,
  IconX,
  IconCheck,
  IconBell,
  IconAlertCircle,
} from '@tabler/icons-react'
import InstallPWA from '@/components/InstallPWA'
import usePushNotifications from '@/hooks/usePushNotification'
import { showNotification } from '@mantine/notifications'
import siteConfig from '@/../site.config'

interface UserButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'name'> {
  image: string
  userId?: string
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
  ),
)

UserButton.displayName = 'UserButton'

export function UserButtonMenu(props: UserButtonProps) {
  const { userId, image, name, email, icon } = props
  const [checked, setChecked] = useState(false)

  const {
    onClickAskUserPermission,
    onClickSubscribeToPushNotification,
    onClickUnsubscribeToPushNotification,
    onClickSendSubscriptionToServer,
    onClickDeleteSubscriptionFromServer,
    userConsent,
    pushNotificationSupported,
    userSubscription,
  } = usePushNotifications()

  useEffect(() => {
    if (pushNotificationSupported && userSubscription) {
      setChecked(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushNotificationSupported, userSubscription])

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
            prefetch={false}
          >
            Profile
          </Menu.Item>

          <InstallPWA closeMenuOnClick={false} icon={<IconApps size={14} stroke={1.5} />} />

          {pushNotificationSupported && (
            <Menu.Item closeMenuOnClick={false} icon={<IconBell size={14} stroke={1.5} />}>
              <Switch
                labelPosition="left"
                checked={checked}
                onChange={(event) => {
                  if (userId === siteConfig.demoUserId) return

                  setChecked(event.currentTarget.checked)

                  if (event.currentTarget.checked) {
                    if (userConsent === 'granted') {
                      onClickSubscribeToPushNotification().then((subscription) => {
                        if (userId && subscription)
                          onClickSendSubscriptionToServer(userId, subscription)
                      })
                    } else if (userConsent === 'default') {
                      onClickAskUserPermission()
                      setChecked(false)
                      showNotification({
                        title: 'Warning',
                        message:
                          'Accept push notifications permission request, then click again to enable push notifications',
                        color: 'yellow',
                        icon: <IconAlertCircle />,
                      })
                    } else {
                      setChecked(false)
                      showNotification({
                        title: 'Error',
                        message:
                          'Please enable push notifications permission in your browser/phone',
                        color: 'red',
                        icon: <IconX />,
                      })
                    }
                  } else if (!event.currentTarget.checked && userSubscription) {
                    onClickUnsubscribeToPushNotification().then(() => {
                      if (userId) onClickDeleteSubscriptionFromServer(userId)
                    })
                  }
                }}
                color="teal"
                label="Push Notification"
                size="sm"
                thumbIcon={
                  checked ? (
                    <IconCheck size="0.8rem" color="green" stroke={3} />
                  ) : (
                    <IconX size="0.8rem" color="red" stroke={3} />
                  )
                }
              />
            </Menu.Item>
          )}

          <Menu.Divider />

          <Menu.Item
            color="red"
            icon={<IconLogout size={14} stroke={1.5} />}
            onClick={async () => {
              const data = await signOut({ redirect: false, callbackUrl: '/login' })
              Router.replace(data.url)
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Button, Divider, List, Menu, Text } from '@mantine/core'
import type { MenuItemProps } from '@mantine/core'
import { useOs } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconDotsVertical, IconShare2, IconSquareRoundedPlusFilled } from '@tabler/icons-react'

export default function InstallPWA(props: MenuItemProps) {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const deferredPrompt = useRef<Event>()
  const os = useOs()

  useEffect(() => {
    const A2HSHandler = (beforeInstallPromptEvent: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      beforeInstallPromptEvent.preventDefault()

      // Stash the event so it can be triggered later.
      deferredPrompt.current = beforeInstallPromptEvent
      setSupportsPWA(true)
    }

    window.addEventListener('beforeinstallprompt', A2HSHandler)

    return () => window.removeEventListener('transitionend', A2HSHandler)
  }, [])

  const onClick = () => {
    if (
      !supportsPWA &&
      (os === 'macos' || os === 'ios' || os === 'android' || os === 'undetermined')
    ) {
      modals.open({
        title: 'Install Web App',
        centered: true,
        children: (
          <>
            <Text>
              This website has app functionality. Add it to your home screen to use it in fullscreen
              and notifications.
            </Text>
            <Divider my="sm" />
            <List spacing="xs" size="md" center type="ordered">
              <List.Item
                icon={
                  os === 'android' ? <IconDotsVertical size="1rem" /> : <IconShare2 size="1rem" />
                }
              >
                {os === 'android'
                  ? `Press the 'three dot' icon in Chrome`
                  : `Press the 'Share' button`}
              </List.Item>
              <List.Item icon={<IconSquareRoundedPlusFilled size="1rem" />}>
                Press &apos;Add to Home Screen&apos;
              </List.Item>
            </List>
            <Button fullWidth onClick={() => modals.closeAll()} mt="md">
              Close
            </Button>
          </>
        ),
      })
    }

    if (!deferredPrompt.current) {
      return
    }

    // Show the prompt
    // @ts-expect-error - TS doesn't know about prompt() as BeforeInstallPromptEvent is not a standard interface
    deferredPrompt?.current.prompt()
  }
  return (
    <>
      <Menu.Item {...props} onClick={onClick}>
        Install Web App
      </Menu.Item>
    </>
  )
}

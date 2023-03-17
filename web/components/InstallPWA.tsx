import { useState, useEffect } from 'react'
import { Button, Divider, List, Menu, Text } from '@mantine/core'
import type { MenuItemProps } from '@mantine/core'
import { useOs } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconShare2, IconSquareRoundedPlusFilled } from '@tabler/icons-react'

export default function InstallPWA(props: MenuItemProps) {
  const [supportsPWA, setSupportsPWA] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event>()
  const os = useOs()

  useEffect(() => {
    const A2HSHandler = (beforeInstallPromptEvent: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      beforeInstallPromptEvent.preventDefault()

      // Stash the event so it can be triggered later.
      setDeferredPrompt(beforeInstallPromptEvent)
      setSupportsPWA(true)
    }

    window.addEventListener('beforeinstallprompt', A2HSHandler)

    return () => window.removeEventListener('transitionend', A2HSHandler)
  }, [])

  const onClick = () => {
    if (!supportsPWA && (os === 'macos' || os === 'ios' || os === 'undetermined')) {
      modals.open({
        title: 'Install Web App',
        centered: true,
        children: (
          <>
            <Text>
              This website has app functionality. Add it to your home screen to use it in fullscreen
            </Text>
            <Divider my="sm" />
            <List spacing="xs" size="md" center type="ordered">
              <List.Item icon={<IconShare2 size="1rem" />}>
                Press the &apos;Share&apos; button
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

    if (!deferredPrompt) {
      return
    }

    // Show the prompt
    // @ts-expect-error - TS doesn't know about prompt() as BeforeInstallPromptEvent is not a standard interface
    deferredPrompt.prompt()
  }
  return (
    <>
      <Menu.Item {...props} onClick={onClick}>
        Install Web App
      </Menu.Item>
    </>
  )
}

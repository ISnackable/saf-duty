import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Footer, Group, Stack, Text, Transition, createStyles } from '@mantine/core'

export type BottomNavigationProps = {
  children: React.ReactNode
}

export type StyleProps = {
  active: boolean
}

export type IconProps = {
  active?: boolean
  icon: JSX.Element
  to: string
  isActive: boolean
  title?: string
}

const useStyles = createStyles((theme) => ({
  footer: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    marginBottom: 'env(safe-area-inset-bottom, 50px)',
  },
  icons: {
    height: '100%',
  },
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[8],
  },
  iconActive: {
    color: theme.colors.blue[6],
  },
  title: {
    color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[8],
  },
  titleActive: {
    color: theme.colors.blue[6],
  },
  link: {
    textDecoration: 'none',
  },
}))

function NavigationIcon({ icon: Icon, to, title, isActive }: IconProps): JSX.Element {
  const { classes, cx } = useStyles()

  return (
    <Link href={to} className={classes.link}>
      <Stack align="center" spacing={0}>
        <Icon.type
          {...Icon.props}
          size={24}
          className={cx(classes.icon, { [classes.iconActive]: isActive })}
        />
        <Text size="xs" className={cx(classes.title, { [classes.titleActive]: isActive })}>
          {title}
        </Text>
      </Stack>
    </Link>
  )
}

export function BottomNavigation(props: BottomNavigationProps): JSX.Element {
  const { children } = props
  const [mounted, setMounted] = useState(false)
  const { classes } = useStyles()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Transition mounted={mounted} transition="slide-up" duration={400} timingFunction="ease">
      {(styles) => (
        <Footer height={60} className={classes.footer} style={styles}>
          <Group grow className={classes.icons}>
            {children}
          </Group>
        </Footer>
      )}
    </Transition>
  )
}

BottomNavigation.Button = NavigationIcon

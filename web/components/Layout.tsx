import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  createStyles,
  AppShell,
  Header,
  Text,
  Burger,
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
  Transition,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import {
  IconCalendarEvent,
  IconArrowsExchange,
  IconMathFunctionY,
  IconMoonStars,
  IconSun,
  IconHome2,
  IconEdit,
} from '@tabler/icons-react'
import { NavbarMin } from '@/components/Navbar'
import { BottomNavigation } from '@/components/BottomNavbar'

import config from '../../site.config'

const useStyles = createStyles(() => ({
  innerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  innerTwo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

export default function Layout({ children }: { children: React.ReactNode }) {
  const { classes } = useStyles()

  const theme = useMantineTheme()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [opened, { close, toggle }] = useDisclosure(true)
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const { pathname } = useRouter()
  const dark = colorScheme === 'dark'

  useEffect(() => {
    if (isMobile) close()
  }, [close, pathname, isMobile])

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      navbar={
        <Transition mounted={opened} transition="slide-right" duration={400} timingFunction="ease">
          {(styles) => (
            <NavbarMin
              style={styles}
              p="md"
              hiddenBreakpoint="sm"
              hidden={!opened}
              width={{ sm: 300 }}
            />
          )}
        </Transition>
      }
      header={
        <Header height={60} p="xs">
          <div className={classes.innerHeader}>
            <Burger onClick={toggle} opened={opened} />
            <div className={classes.innerTwo}>
              <IconMathFunctionY size={38} />
              <Text
                span
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                fz="xl"
                ml="sm"
              >
                {config.title || 'Duty Roster'}
              </Text>
            </div>
            <ActionIcon
              size={30}
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={20} /> : <IconMoonStars size={20} />}
            </ActionIcon>
          </div>
        </Header>
      }
      footer={
        isMobile ? (
          <BottomNavigation>
            <BottomNavigation.Button
              icon={<IconHome2 />}
              to="/"
              title="Home"
              isActive={pathname === '/'}
            />
            <BottomNavigation.Button
              icon={<IconCalendarEvent />}
              to="/duty-roster"
              title="Duty Rosters"
              isActive={pathname === '/duty-roster'}
            />
            <BottomNavigation.Button
              icon={<IconEdit />}
              to="/manage-blockouts"
              title="My Availability"
              isActive={pathname === '/manage-blockouts'}
            />
            <BottomNavigation.Button
              icon={<IconArrowsExchange />}
              to="/swap-duties"
              title="Swap Duties"
              isActive={pathname === '/swap-duties'}
            />
          </BottomNavigation>
        ) : undefined
      }
      styles={(theme) => ({
        main: {
          transition: 'padding-left 400ms ease',
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  )
}

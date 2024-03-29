import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  createStyles,
  Navbar,
  UnstyledButton,
  // Badge,
  Text,
  Group,
  type NavbarProps,
  NavLink,
  rem,
} from '@mantine/core'
import {
  IconUsers,
  IconSelector,
  IconFingerprint,
  IconCalendarEvent,
  IconEdit,
  IconChessKnight,
  IconCloudLock,
  IconCe,
  IconMessageCircleQuestion,
  IconHome2,
  IconArrowsExchange,
} from '@tabler/icons-react'
import { UserButtonMenu } from '@/components/UserButton'

import config from '@/../site.config'

type NavbarMinProps = Omit<NavbarProps, 'children'>

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: '0 !important',
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    '&:not(:last-of-type)': {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    },
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },

  // mainLinkBadge: {
  //   padding: 0,
  //   width: rem(20),
  //   height: rem(20),
  //   pointerEvents: 'none',
  // },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },

  collectionLink: {
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
}))

const links = [
  {
    icon: IconHome2,
    label: 'Home',
    // notifications: 4,
    link: '/',
  },
  { icon: IconCalendarEvent, label: 'Duty Roster', link: '/duty-roster' },
  { icon: IconEdit, label: 'My Availability', link: '/manage-blockouts' },
  { icon: IconArrowsExchange, label: 'Swap Duties', link: '/swap-duties' },
  { icon: IconUsers, label: 'Duty Personnels', link: '/duty-personnels' },
]

const adminLinks = [
  { icon: IconUsers, label: 'Manage Users', link: '/admin' },
  {
    icon: IconChessKnight,
    label: 'Generate Duty',
    link: '/admin/generate-duty',
  },
]

const collections = [
  { emoji: '✨', label: 'IPPT', link: '/collections/ippt' },
  { emoji: '💰', label: 'Pay Day', link: '/collections/pay-day' },
  { emoji: '📅', label: 'ORD', link: '/collections/ord' },
]

const othersLinks = [
  { icon: IconCloudLock, label: 'Privacy', link: '/privacy' },
  {
    icon: IconCe,
    label: 'Terms and Conditions',
    link: '/terms',
  },
  { label: 'FAQ', link: '/faq', icon: IconMessageCircleQuestion },
]

export function NavbarMin(props: NavbarMinProps) {
  const { data: session } = useSession()
  const { classes } = useStyles()

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <Link href={link.link} key={link.label} className={classes.mainLinkInner} prefetch={false}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </Link>
      {/* {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )} */}
    </UnstyledButton>
  ))

  const secondaryLinks = adminLinks.map((link) => (
    <NavLink
      key={link.label}
      styles={(theme) => ({
        label: {
          fontSize: theme.fontSizes.xs,
        },
      })}
      component={Link}
      label={link.label}
      href={link.link}
      icon={<link.icon size={22} className={classes.mainLinkIcon} stroke={1.5} />}
      prefetch={false}
    />
  ))

  const collectionLinks = collections.map((collection) => (
    <Link
      href={collection.link}
      key={collection.label}
      className={classes.collectionLink}
      prefetch={false}
    >
      <span style={{ marginRight: 9, fontSize: 16 }}>{collection.emoji}</span> {collection.label}
    </Link>
  ))

  const thirdLinks = othersLinks.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <Link href={link.link} key={link.label} className={classes.mainLinkInner} prefetch={false}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </Link>
    </UnstyledButton>
  ))

  return (
    <Navbar className={classes.navbar} {...props}>
      <Navbar.Section className={classes.section}>
        <UserButtonMenu
          userId={session?.user?.id}
          image={session?.user?.image || ''}
          name={session?.user?.name}
          email={session?.user?.email}
          icon={<IconSelector size="0.9rem" stroke={1.5} />}
        />
      </Navbar.Section>

      {session && (session.user?.role === 'admin' || session.user?.id === config.demoUserId) && (
        <Navbar.Section className={classes.section}>
          <Group className={classes.collectionsHeader}>
            <Text size="xs" weight={500} color="dimmed">
              Admin
            </Text>
          </Group>
          <div className={classes.mainLinks}>
            <NavLink
              styles={(theme) => ({
                label: {
                  fontSize: theme.fontSizes.xs,
                },
              })}
              icon={<IconFingerprint size={22} className={classes.mainLinkIcon} stroke={1.5} />}
              label="Admin Panel"
            >
              {secondaryLinks}
            </NavLink>
          </div>
        </Navbar.Section>
      )}

      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Collections
          </Text>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Others
          </Text>
        </Group>
        <div className={classes.mainLinks}>{thirdLinks}</div>
      </Navbar.Section>
    </Navbar>
  )
}

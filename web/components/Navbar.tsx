import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  createStyles,
  Navbar,
  UnstyledButton,
  Badge,
  Text,
  Group,
  type NavbarProps,
  NavLink,
} from "@mantine/core";
import {
  IconUsers,
  IconCheckbox,
  IconSelector,
  IconFingerprint,
  IconCalendarEvent,
  IconEdit,
  IconApps,
  IconChessKnight,
} from "@tabler/icons-react";
import { UserButtonMenu } from "@/components/UserButton";
import { SegmentedToggle } from "@/components/ThemeToggle";

type NavbarMinProps = Omit<NavbarProps, "children">;

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `8px ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: 20,
    height: 20,
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - 6px)`,
    paddingRight: `calc(${theme.spacing.md} - 6px)`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + 2px)`,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: "block",
    padding: `8px ${theme.spacing.xs}`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const links = [
  { icon: IconCalendarEvent, label: "Duty Roster", link: "/" },
  { icon: IconEdit, label: "Manage Blockouts", link: "/manage-blockouts" },
  {
    icon: IconCheckbox,
    label: "Upcoming Duties",
    notifications: 4,
    link: "/upcoming-duties",
  },
  { icon: IconUsers, label: "Duty Personnels", link: "/duty-personnels" },
];

const adminLinks = [
  { icon: IconApps, label: "Overview", link: "/admin" },
  {
    icon: IconChessKnight,
    label: "Generate duty",
    link: "/admin/generate-duty",
  },
];

const collections = [
  { emoji: "✨", label: "IPPT", link: "/collections/ippt" },
  { emoji: "💰", label: "Pay Day", link: "/collections/pay-day" },
  { emoji: "📅", label: "ORD", link: "/collections/ord" },
];

export function NavbarMin(props: NavbarMinProps) {
  const { data: session } = useSession();
  const { classes } = useStyles();

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <Link href={link.link} key={link.label} className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </Link>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

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
      icon={
        <link.icon size={22} className={classes.mainLinkIcon} stroke={1.5} />
      }
    />
  ));

  const collectionLinks = collections.map((collection) => (
    <Link
      href={collection.link}
      key={collection.label}
      className={classes.collectionLink}
    >
      <span style={{ marginRight: 9, fontSize: 16 }}>{collection.emoji}</span>{" "}
      {collection.label}
    </Link>
  ));

  return (
    <Navbar className={classes.navbar} {...props}>
      <Navbar.Section className={classes.section}>
        <UserButtonMenu
          image={session?.user?.image || "https://i.imgur.com/fGxgcDF.png"}
          name={session?.user?.name || "Test Name"}
          email={session?.user?.email || "Test Email"}
          icon={<IconSelector size={14} stroke={1.5} />}
        />
      </Navbar.Section>

      {session && session.user?.role === "admin" && (
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
              icon={
                <IconFingerprint
                  size={22}
                  className={classes.mainLinkIcon}
                  stroke={1.5}
                />
              }
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

      <Navbar.Section>
        <SegmentedToggle />
      </Navbar.Section>
    </Navbar>
  );
}

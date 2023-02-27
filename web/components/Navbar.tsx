import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  createStyles,
  Navbar,
  UnstyledButton,
  Badge,
  Text,
  Group,
} from "@mantine/core";
import {
  IconUsers,
  IconCheckbox,
  IconSelector,
  IconFingerprint,
  IconCalendarEvent,
  IconEdit,
} from "@tabler/icons-react";
import { UserButtonMenu } from "@/components/UserButton";
import { SegmentedToggle } from "@/components/ThemeToggle";

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
    paddingLeft: theme.spacing.md - theme.spacing.xs,
    paddingRight: theme.spacing.md - theme.spacing.xs,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `8px ${theme.spacing.xs}px`,
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
    paddingLeft: theme.spacing.md - 6,
    paddingRight: theme.spacing.md - 6,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: theme.spacing.md + 2,
    paddingRight: theme.spacing.md,
    marginBottom: 5,
  },

  collectionLink: {
    display: "block",
    padding: `8px ${theme.spacing.xs}px`,
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
  { icon: IconUsers, label: "Teams", link: "/teams" },
];

const collections = [
  { emoji: "💰", label: "Pay Day", link: "/collections/pay-day" },
  { emoji: "✨", label: "IPPT", link: "/collections/ippt" },
  { emoji: "📅", label: "ORD", link: "/collections/ord" },
];

export function NavbarMin() {
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
    <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
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
            <UnstyledButton className={classes.mainLink}>
              <Link href="/admin" className={classes.mainLinkInner}>
                <IconFingerprint
                  size={20}
                  className={classes.mainLinkIcon}
                  stroke={1.5}
                />
                <span>Secret Admin Panel</span>
              </Link>
            </UnstyledButton>
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

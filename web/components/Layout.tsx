import { NavbarMin } from "@/components/Navbar";
import { createStyles, AppShell, Header, Text, Burger } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBulb } from "@tabler/icons-react";
import { useEffect } from "react";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  innerTwo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { classes } = useStyles();
  const [opened, { open, close, toggle }] = useDisclosure(true);
  const matches = useMediaQuery("(min-width: 900px)");

  useEffect(() => {
    if (matches) {
      open();
    } else {
      close();
    }
  }, [matches, open, close]);

  return (
    <AppShell
      padding="md"
      navbar={opened ? <NavbarMin /> : undefined}
      header={
        <Header height={60} p="xs">
          <div className={classes.inner}>
            <div className={classes.innerTwo}>
              <IconBulb size={38} />
              <Text
                span
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                fz="xl"
              >
                Duty Roster
              </Text>
            </div>
            <Burger onClick={toggle} opened={opened} />
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}

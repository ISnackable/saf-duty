import { NavbarMin } from "@/components/Navbar";
import { createStyles, AppShell, Header, Container, Text } from "@mantine/core";
import { IconBulb } from "@tabler/icons-react";

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

  return (
    <AppShell
      padding="md"
      navbar={<NavbarMin />}
      header={
        <Header height={60} p="xs">
          <Container className={classes.inner}>
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
          </Container>
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

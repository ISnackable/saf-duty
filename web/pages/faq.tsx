import Link from 'next/link'
import {
  createStyles,
  Image,
  Accordion,
  Grid,
  Col,
  Container,
  Title,
  Button,
  Group,
  Anchor,
} from '@mantine/core'
import image from '@/public/undraw_questions_re_1fy7.svg'

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
  },

  title: {
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  item: {
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
  },
}))

FaqWithImage.Title = 'Frequently Asked Questions'

export default function FaqWithImage() {
  const { classes } = useStyles()
  return (
    <div className={classes.wrapper}>
      <Container my="xl" size="xl">
        <Grid id="faq-grid" gutter={50}>
          <Col span={12} md={6}>
            <Image src={image.src} alt="Frequently Asked Questions" />
          </Col>
          <Col span={12} md={6}>
            <Title order={2} ta="left" className={classes.title}>
              Frequently Asked Questions
            </Title>

            <Accordion chevronPosition="right" defaultValue="reset-password" variant="separated">
              <Accordion.Item className={classes.item} value="reset-password">
                <Accordion.Control>How can I reset my password?</Accordion.Control>
                <Accordion.Panel>
                  For now, you have to contact the admin to reset your password. However, you can
                  change your password if you are logged in at the{' '}
                  <Anchor component={Link} href="/profile" prefetch={false}>
                    profile page
                  </Anchor>
                  .
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="another-account">
                <Accordion.Control>Can I create more that one account?</Accordion.Control>
                <Accordion.Panel>Yes, however it is generally not recommended.</Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item className={classes.item} value="report-bugs">
                <Accordion.Control>
                  Whom do I contact if I find a bug on the website?
                </Accordion.Control>
                <Accordion.Panel>
                  If you find a bug regarding the website, or if you want to suggest an improvement,
                  do contact the developer{' '}
                  <Anchor href="https://github.com/ISnackable/">@ISnackable</Anchor>.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Grid>

        <Group position="center" mt="lg">
          <Button variant="subtle" size="md" component={Link} href="/login" prefetch={false}>
            Take me back to home page
          </Button>
        </Group>
      </Container>
    </div>
  )
}

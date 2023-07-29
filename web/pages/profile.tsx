import { useEffect, useState } from 'react'
import Image from 'next/image'
import { DatePickerInput } from '@mantine/dates'
import { isEmail, useForm } from '@mantine/form'
import {
  createStyles,
  Card,
  Tabs,
  Text,
  Title,
  TextInput,
  Button,
  Group,
  Container,
  PasswordInput,
  AspectRatio,
  FileButton,
} from '@mantine/core'
// import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import {
  IconCheck,
  IconInfoCircle,
  IconPhoto,
  IconSettings,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import { useSession } from 'next-auth/react'

import { checkPasswordValidation } from '@/pages/login'

/*
// Function that checks if the date is valid, returns an error message if not
export function validateEnlistmentDate(enlistmentDate?: Date, ordDate?: Date) {
  if (!enlistmentDate || !ordDate) return "Dates cannot be empty";
  /*
  const minMonths = 22; // 1 year and 10 months in months
  const maxMonths = 24; // 2 years in months
  const timeDiff = ordDate.getTime() - enlistmentDate.getTime();
  const monthsDiff = timeDiff / (1000 * 3600 * 24 * 30);

  if (monthsDiff >= minMonths && monthsDiff <= maxMonths) {
    return "Enlistment date must be between 1 year and 10 months and 2 years after ORD date";
  }
  
}
/*
export function validateOrdDate(enlistmentDate?: Date, ordDate?: Date) {
  if (!enlistmentDate || !ordDate) return "Dates cannot be empty";
  
  if (ordDate < enlistmentDate) {
    return "ORD date cannot be less than enlistment date";
  }
  
}
*/
const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    lineHeight: 1,
    textTransform: 'uppercase',
  },

  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.sm,
    },
  },

  form: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },
}))

ProfilePage.title = 'Profile'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const { classes } = useStyles()

  const user = session?.user

  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // // Listen for when the page is visible, if the user switches tabs
  // // and makes our tab visible again, re-fetch the session
  // useEffect(() => {
  //   const visibilityHandler = () => document.visibilityState === 'visible' && update()
  //   window.addEventListener('visibilitychange', visibilityHandler, false)
  //   return () => window.removeEventListener('visibilitychange', visibilityHandler, false)
  // }, [update])

  // const openDeleteModal = () =>
  //   modals.openConfirmModal({
  //     title: 'Delete your profile',
  //     centered: true,
  //     children: (
  //       <Text size="sm">
  //         Are you sure you want to delete your profile? This action is destructive and you will have
  //         to contact support to restore your data.
  //       </Text>
  //     ),
  //     labels: { confirm: 'Delete account', cancel: "No don't delete it" },
  //     confirmProps: { color: 'red' },
  //     onCancel: () => console.log('Cancel'),
  //     onConfirm: () => console.log('Confirmed'),
  //   })

  //userDetail form
  const userDetailForm = useForm({
    initialValues: {
      name: user?.name || '',
      enlistment: user?.enlistment ? new Date(user?.enlistment) : null,
      ord: user?.ord ? new Date(user?.ord) : null,
    },
    validate: {
      name: (value) => (value && value.length < 2 ? 'Name must have at least 2 letters' : null),
      // enlistment: (value, values) => validateEnlistmentDate(value, values.ord),
      //ord: (value, values) => validateOrdDate(values.enlistment, value),
    },
  })
  //user account form
  const userAccountForm = useForm({
    initialValues: {
      email: user?.email || '',
      oldPassword: '',
      password: '',
    },
    validate: {
      email: isEmail('Invalid email'),
      password: (value) => checkPasswordValidation(value),
      oldPassword: (value) => checkPasswordValidation(value),
    },
  })

  useEffect(() => {
    if (user) {
      userDetailForm.setValues({
        name: user?.name || '',
        enlistment: user?.enlistment ? new Date(user?.enlistment) : null,
        ord: user?.ord ? new Date(user?.ord) : null,
      })
      userDetailForm.resetDirty()
      userAccountForm.setValues({
        email: user?.email || '',
      })
      userAccountForm.resetDirty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  //update user detail to backend
  const handleUserDetailSubmit = async (values: typeof userDetailForm.values) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/sanity/user/${user?.id}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          enlistment: values.enlistment?.toLocaleDateString('sv-SE'),
          ord: values.ord?.toLocaleDateString('sv-SE'),
        }),
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update user details, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        update(values)
        showNotification({
          title: 'Success',
          message: 'User details updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  //update user account to backend
  const handlePasswordSubmit = async (values: typeof userAccountForm.values) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/sanity/user/${user?.id}/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
        }),
        cache: 'no-cache',
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update user account, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        update(values)
        showNotification({
          title: 'Success',
          message: 'User account updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  const handleAvatarSubmit = async () => {
    setIsSubmitting(true)

    if (!file) {
      showNotification({
        title: 'Error',
        message: 'Please select an image to upload',
        color: 'red',
        icon: <IconX />,
      })
      setIsSubmitting(false)
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()

      const res = await fetch(`/api/sanity/user/${user?.id}/avatar`, {
        method: 'POST',
        body: arrayBuffer,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update user avatar, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        showNotification({
          title: 'Success',
          message: 'User avatar updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })

        update({ ...user, image: imageUrl })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  const imageUrl = file ? URL.createObjectURL(file) : user?.image

  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  return (
    <Container my="xl" size="xl">
      <div className={classes.titleWrapper}>
        <IconSettings size={48} />
        <Title className={classes.title}>Profile</Title>
      </div>

      <Text color="dimmed" mt="md">
        Update your profile information and settings here. You can also change your password.
        Enlistment and ORD are optional but recommended.
      </Text>

      <Tabs keepMounted={false} defaultValue="general" mt="xl">
        <Tabs.List grow>
          <Tabs.Tab value="general" icon={<IconInfoCircle size="0.8rem" />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value="avatar" icon={<IconPhoto size="0.8rem" />}>
            Avatar
          </Tabs.Tab>
          <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
            Account Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="xs">
          <div className={classes.form}>
            <form onSubmit={userDetailForm.onSubmit(handleUserDetailSubmit)}>
              <TextInput
                mt="sm"
                label="Name"
                placeholder="Name"
                description="Your name as it is on your NRIC"
                {...userDetailForm.getInputProps('name')}
              />

              <DatePickerInput
                clearable
                mt="sm"
                label="Enlistment date"
                placeholder="Pick date"
                {...userDetailForm.getInputProps('enlistment')}
              />

              <DatePickerInput
                clearable
                mt="sm"
                label="ORD date"
                placeholder="Pick date"
                {...userDetailForm.getInputProps('ord')}
              />

              <Group position="right" mt="lg">
                <Button color="gray">Cancel</Button>
                <Button type="submit" loading={isSubmitting}>
                  Save
                </Button>
              </Group>
            </form>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="avatar" pt="xs">
          <div className={classes.form}>
            <Card shadow="sm" mt="lg">
              <Card.Section>
                <AspectRatio ratio={350 / 350} sx={{ maxWidth: 350 }} mx="auto">
                  <Image
                    priority
                    src={imageUrl || '/images/avatars/avatar-1.jpg'}
                    alt="User avatar"
                    width={350}
                    height={350}
                    className="rounded-full"
                    style={{ objectFit: 'cover' }}
                  />
                </AspectRatio>
              </Card.Section>
            </Card>

            <Group position="left" mt="lg">
              <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => (
                  <Button {...props} leftIcon={<IconUpload size={14} />}>
                    Upload image
                  </Button>
                )}
              </FileButton>
            </Group>
            <Group position="right">
              <Button type="submit" onClick={handleAvatarSubmit} loading={isSubmitting}>
                Save
              </Button>
            </Group>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xs">
          <div className={classes.form}>
            <form onSubmit={userAccountForm.onSubmit(handlePasswordSubmit)}>
              <TextInput
                mt="sm"
                label="Email"
                placeholder="Email"
                {...userAccountForm.getInputProps('email')}
              />

              <PasswordInput
                mt="sm"
                label="Old password"
                placeholder="Old password"
                {...userAccountForm.getInputProps('oldPassword')}
              />

              <PasswordInput
                mt="sm"
                label="New Password"
                placeholder="New Password"
                {...userAccountForm.getInputProps('password')}
              />

              <Group position="apart" mt="lg">
                {/* <Button onClick={openDeleteModal} color="red">
                  Delete account
                </Button> */}
                <Button type="submit" loading={isSubmitting}>
                  Save
                </Button>
              </Group>
            </form>
          </div>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

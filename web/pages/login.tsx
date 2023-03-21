import { useEffect, useRef, useState } from 'react'
import Router, { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { signIn, useSession } from 'next-auth/react'
import type { User } from 'next-auth'
import { signUp } from 'next-auth-sanity/client'
import { useToggle, upperFirst } from '@mantine/hooks'
import { isEmail, useForm } from '@mantine/form'
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
  Container,
  Title,
  Checkbox,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { IconAt, IconCheck, IconLock, IconSignature, IconX } from '@tabler/icons-react'

import svgImage from '@/public/undraw_fingerprint_re_uf3f.svg'
import siteConfig from '../../site.config'

const PasswordStrength = dynamic(() =>
  import('@/components/PasswordRequirement').then((mod) => mod.PasswordStrength)
)

// Function that checks if the password is valid, returns an error message if not
export function checkPasswordValidation(value: string) {
  const isWhitespace = /^(?=.*\s)/
  if (isWhitespace.test(value)) {
    return 'Password must not contain Whitespaces.'
  }

  const isContainsUppercase = /^(?=.*[A-Z])/
  if (!isContainsUppercase.test(value)) {
    return 'Password must have at least one Uppercase Character.'
  }

  const isContainsLowercase = /^(?=.*[a-z])/
  if (!isContainsLowercase.test(value)) {
    return 'Password must have at least one Lowercase Character.'
  }

  const isContainsNumber = /^(?=.*[0-9])/
  if (!isContainsNumber.test(value)) {
    return 'Password must contain at least one Digit.'
  }

  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/
  if (!isContainsSymbol.test(value)) {
    return 'Password must contain at least one Special Symbol.'
  }

  const isValidLength = /^.{10,16}$/
  if (!isValidLength.test(value)) {
    return 'Password must be 10-16 Characters Long.'
  }
  return null
}

// Function that checks if the name is valid, returns an error message if not
export function checkNameValidation(value: string) {
  const isName = /^[a-zA-Z '.-]*$/
  if (!isName.test(value)) {
    return 'Name is not valid. Only letters, spaces, apostrophes, dashes and periods are allowed.'
  }
  return null
}

type NextAuthSanityResponse = {
  error?: string
  status?: 'error' | 'success'
  message?: string
} & User

AuthenticationForm.title = 'Login'

export default function AuthenticationForm() {
  const { status } = useSession()
  const router = useRouter()

  const hcaptchaRef = useRef<HCaptcha>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formType, setFormType] = useToggle(['login', 'register'])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [router, status])

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      termsOfService: true,
    },

    validate: {
      name: (value) => formType === 'register' && checkNameValidation(value),
      email: isEmail('Invalid email'),
      password: (value) => formType === 'register' && checkPasswordValidation(value),
      termsOfService: (value) =>
        formType === 'register' && (value ? null : 'You must agree to the terms of service'),
    },

    validateInputOnChange: ['password'],
  })

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    // Execute the hCaptcha when the form is submitted
    if (formType === 'register' && hcaptchaRef.current !== null) {
      hcaptchaRef.current.execute()
    }

    // If type is login then execute the signIn function
    else if (formType === 'login') {
      // const { email, password } = form.values
      setIsSubmitting(true)
      try {
        const response = await signIn('sanity-login', {
          email,
          password,
          redirect: false,
        })

        if (!response?.ok) {
          showNotification({
            title: 'Error',
            message: 'Invalid credentials',
            color: 'red',
            icon: <IconX />,
          })
        } else {
          showNotification({
            title: 'Success',
            message: 'Successfully logged in',
            color: 'green',
            icon: <IconCheck />,
          })
        }
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } finally {
        setTimeout(() => {
          setIsSubmitting(false)
        }, 1500)
      }
    }
  }

  const onHCaptchaChange = async (captchaCode: string | null | undefined) => {
    const { name, email, password } = form.values
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    if (!captchaCode || (formType === 'register' && !name) || !email || !password) {
      return
    }

    setIsSubmitting(true)

    try {
      if (formType === 'register') {
        const response: NextAuthSanityResponse = await signUp({
          email,
          password,
          name,
          captcha: captchaCode,
        })

        if (response?.status === 'error') {
          showNotification({
            title: 'Error',
            message: response?.message || 'Something went wrong',
            color: 'red',
            icon: <IconX />,
          })
        } else if (response?.error) {
          showNotification({
            title: 'Error',
            message: response?.error || 'Something went wrong',
            color: 'red',
            icon: <IconX />,
          })
        } else {
          showNotification({
            title: 'Success',
            message: 'Account has been created',
            color: 'teal',
            icon: <IconCheck />,
          })

          await signIn('sanity-login', {
            email,
            password,
            redirect: false,
          })

          // If the user is authenticated, redirect to the home page
          Router.push('/')
        }
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
        icon: <IconX />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container size={420} my={80}>
      <div style={{ position: 'relative', height: '30vh' }}>
        <Image
          priority
          src={svgImage}
          fill={true}
          alt="Undraw personal information logo"
          style={{ objectFit: 'fill' }}
        />
      </div>

      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back to {siteConfig.title || ''}!
      </Title>

      <Paper radius="md" p="xl" mt={30} withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {formType === 'login' && (
            <Anchor
              disabled={isSubmitting}
              component="button"
              type="button"
              color="dimmed"
              onClick={() => {
                handleSubmit({
                  email: siteConfig.demoEmail,
                  password: siteConfig.demoPassword,
                })
              }}
              size="xs"
            >
              Interested but lazy to create an account? Click here to login as demo user to see the
              app in action
            </Anchor>
          )}

          <Stack>
            {formType === 'register' && (
              <TextInput
                data-autofocus
                required
                label="Name"
                placeholder="Your name"
                icon={<IconSignature size={16} stroke={1.5} />}
                {...form.getInputProps('name')}
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              icon={<IconAt size={16} stroke={1.5} />}
              {...form.getInputProps('email')}
            />

            {formType === 'register' ? (
              <PasswordStrength
                required
                label="Password"
                placeholder="Your password"
                icon={<IconLock size={16} stroke={1.5} />}
                {...form.getInputProps('password')}
              />
            ) : (
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                icon={<IconLock size={16} stroke={1.5} />}
                {...form.getInputProps('password')}
              />
            )}

            {formType === 'register' && (
              <Checkbox
                label={
                  <>
                    I accept{' '}
                    <Anchor
                      component={Link}
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      terms and conditions
                    </Anchor>
                  </>
                }
                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => setFormType()}
              size="xs"
            >
              {formType === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" disabled={isSubmitting}>
              {upperFirst(formType)}
            </Button>
          </Group>

          <HCaptcha
            size="invisible"
            ref={hcaptchaRef}
            sitekey={
              process.env.NODE_ENV === 'development'
                ? '10000000-ffff-ffff-ffff-000000000001'
                : process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ''
            }
            onVerify={onHCaptchaChange}
            onExpire={() => onHCaptchaChange(null)}
            onError={(err) => {
              onHCaptchaChange(null)
              showNotification({
                title: 'Error',
                message: 'Cannot verify captcha',
              })
              console.error(err)
            }}
          />
        </form>
      </Paper>
    </Container>
  )
}

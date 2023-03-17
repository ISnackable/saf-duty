import {defineType, defineField} from 'sanity'
import {LockIcon} from '@sanity/icons'

export default defineType({
  name: 'account',
  title: 'Account',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'providerType',
      type: 'string',
    }),
    defineField({
      name: 'providerId',
      type: 'string',
    }),
    defineField({
      name: 'providerAccountId',
      type: 'string',
    }),
    defineField({
      name: 'refreshToken',
      type: 'string',
    }),
    defineField({
      name: 'accessToken',
      type: 'string',
    }),
    defineField({
      name: 'accessTokenExpires',
      type: 'string',
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      weak: true,
      to: {type: 'user'},
      options: {
        disableNew: true,
      },
    }),
  ],
})

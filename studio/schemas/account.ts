import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'account',
  title: 'Account',
  type: 'document',
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
      to: {type: 'personnel'},
    }),
  ],
})

import {defineType, defineField} from 'sanity'
import {TokenIcon} from '@sanity/icons'

export default defineType({
  name: 'verification-token',
  title: 'Verification Token',
  type: 'document',
  icon: TokenIcon,
  fields: [
    defineField({
      name: 'identifier',
      title: 'Identifier',
      type: 'string',
    }),
    defineField({
      name: 'token',
      title: 'Token',
      type: 'string',
    }),
    defineField({
      name: 'expires',
      title: 'Expires',
      type: 'date',
    }),
  ],
})

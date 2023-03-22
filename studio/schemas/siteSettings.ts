import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'maxBlockouts',
      title: 'Maxiumum no. of blockouts per month',
      type: 'number',
      initialValue: 8,
      validation: (Rule) => Rule.required().min(1).max(31),
    }),
  ],
})

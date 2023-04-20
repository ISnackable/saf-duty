import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons'

export default defineType({
  name: 'unit',
  title: 'Unit',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'unitCode',
      title: 'Unit Code',
      type: 'string',
      description: "A type of code identifier that represent a unit. It is usually a 4 digit numeric code.",
      validation: (Rule) => Rule.required().min(2).max(10)
    }),
]
})

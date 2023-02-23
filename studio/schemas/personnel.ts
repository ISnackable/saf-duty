import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'personnel',
  title: 'Personnel',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'url',
      hidden: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          {title: 'Admin', value: 'admin'},
          {title: 'User', value: 'user'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'user',
    }),
    defineField({
      // this is only if you use credentials provider
      name: 'password',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'weekdayPoints',
      title: 'Weekday Points',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'weekendPoints',
      title: 'Weekday Points',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'extraPoints',
      title: 'Extra',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'blockouts',
      title: 'Blockout Days',
      type: 'array',
      of: [{type: 'date'}],
    }),
  ],
})

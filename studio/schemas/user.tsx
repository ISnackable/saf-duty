import {defineType, defineField} from 'sanity'
import {UsersIcon, UserIcon} from '@sanity/icons'

const MediaPreview = ({value}: {value: string}) => {
  return (
    <img
      alt="User media preview"
      src={value}
      style={{
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: UsersIcon,
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
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
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
      name: 'unit',
      title: 'Unit Reference No.',
      type: 'reference',
      to: [{type: 'unit'}],
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'ord',
      title: 'ORD Date',
      type: 'date',
    }),
    defineField({
      name: 'enlistment',
      title: 'Enlistment Date',
      type: 'date',
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
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'weekendPoints',
      title: 'Weekday Points',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'extra',
      title: 'No. of Extra',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: 'maxBlockouts',
      title: 'Maximum No. of Blockouts',
      type: 'number',
      initialValue: 8,
      validation: (Rule) => Rule.integer().positive().max(120),
    }),
    defineField({
      name: 'blockouts',
      title: 'Blockout Dates',
      type: 'array',
      of: [{type: 'date'}],
    }),
    defineField({
      name: 'pushSubscription',
      title: 'Push Subscription',
      hidden: true,
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title,
        media: media?.startsWith('http') ? <MediaPreview value={media} /> : UserIcon,
      }
    },
  },
})

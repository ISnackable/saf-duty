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
      name: 'ord',
      title: 'ORD Date',
      type: 'date',
      readOnly: true,
    }),
    defineField({
      name: 'enlistment',
      title: 'enlistment Date',
      type: 'date',
      readOnly: true,
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
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: 'blockouts',
      title: 'Blockout Days',
      type: 'array',
      of: [{type: 'date'}],
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

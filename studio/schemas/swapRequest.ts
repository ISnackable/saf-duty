import {defineType, defineField} from 'sanity'
import {TransferIcon} from '@sanity/icons'

export default defineType({
  name: 'swapRequest',
  title: 'Swap Request',
  type: 'document',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'calendar',
      title: 'Calendar',
      weak: true,
      type: 'reference',
      to: [{type: 'calendar'}],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requester',
      title: 'Requester',
      weak: true,
      type: 'reference',
      to: [{type: 'user'}],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requesterDate',
      title: 'Requester Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'receiver',
      title: 'Receiver',
      weak: true,
      type: 'reference',
      to: [{type: 'user'}],
      options: {
        disableNew: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'receiverDate',
      title: 'Receiver Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reason',
      title: 'Reason (optional)',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Accepted', value: 'accepted'},
          {title: 'Declined', value: 'declined'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      requesterName: 'requester.name',
      requesterDate: 'requesterDate',

      receiverName: 'receiver.name',
      receiverDate: 'receiverDate',
    },
    prepare({requesterName, receiverName, requesterDate, receiverDate}) {
      const title = `${requesterName} <-> ${receiverName}`
      const subtitle = `${requesterDate} <-> ${receiverDate}`

      return {
        title,
        subtitle,
      }
    },
  },
})

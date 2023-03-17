import {defineField, defineType} from 'sanity'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

interface Duty {
  date?: number
  dutyPersonnel?: string
}

export default defineType({
  name: 'roster',
  title: 'Roster',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        defineField({
          name: 'date',
          title: 'Date',
          type: 'date',
          options: {
            dateFormat: 'Do MMM',
          },
          validation: (Rule) =>
            Rule.required().custom((date, context) => {
              if (!date) return "Date can't be empty"

              // Date must be within the month of the document it is in
              const docDate = context.document?.date as string

              const year = new Date(docDate).getFullYear()
              const month = new Date(docDate).getMonth()

              const firstDayOfTheMonth = new Date(year, month, 1).toLocaleDateString('sv-SE')
              const lastDayOfTheMonth = new Date(year, month + 1, 0).toLocaleDateString('sv-SE')

              if (!docDate) {
                return 'Month and year must be set'
              }

              if (date < firstDayOfTheMonth.valueOf() || date > lastDayOfTheMonth.valueOf()) {
                return 'Date must be within the month of the document it is in'
              }

              return true
            }),
        }),
        defineField({
          name: 'dutyPersonnel',
          title: 'Duty Personnel',
          type: 'reference',
          weak: true,
          to: [{type: 'user'}],
          options: {
            disableNew: true,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'dutyPersonnelStandIn',
          title: 'Duty Personnel Stand In',
          weak: true,
          type: 'reference',
          to: [{type: 'user'}],
          options: {
            disableNew: true,
          },
        }),
      ],
      preview: {
        select: {
          title: 'date',
          subtitle: 'dutyPersonnel.name',
          standIn: 'dutyPersonnelStandIn.name',
        },
        prepare({title, subtitle, standIn}) {
          if (!title) {
            return {
              title: 'No date',
              subtitle: 'No duty personnel',
            }
          }

          return {
            title: subtitle
              ? `${dayjs(new Date(title)).format('Do MMM')} - ${subtitle}`
              : dayjs(new Date(title)).format('Do MMM'),
            subtitle: standIn ? `Stand in: ${standIn}` : `No stand in`,
          }
        },
      },
    },
  ],
  validation: (Rule) => [
    Rule.required().custom((duties?: Duty[]) => {
      const dates = duties?.map((duty) => duty.date)
      const uniqueDates = new Set(dates)

      if (dates?.length !== uniqueDates.size) {
        return 'All dates must be unique'
      }

      return true
    }),
  ],
})

import {defineField, defineType, NumberInputProps, useFormValue} from 'sanity'
import {getDaysInMonth} from 'date-fns'
import {format} from 'date-fns-tz'

const DateInput = (props: NumberInputProps) => {
  const {schemaType, renderDefault} = props
  const {options} = schemaType

  const {list} = options || {}
  const month = useFormValue(['month'])

  const listItems = month
    ? [...Array(getDaysInMonth(new Date(`${month} 1`))).keys()].map((day) => day + 1)
    : list

  return renderDefault({
    ...props,
    schemaType: {...schemaType, options: {...options, list: listItems}},
  })
}

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
          type: 'number',
          options: {
            list: [...Array(getDaysInMonth(new Date())).keys()].map((day) => day + 1),
          },
          components: {
            input: DateInput,
          },
          validation: (Rule) => Rule.positive().integer().required(),
        }),
        defineField({
          name: 'dutyPersonnel',
          title: 'Duty Personnel',
          type: 'reference',
          to: [{type: 'user'}],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'dutyPersonnelStandIn',
          title: 'Duty Personnel Stand In',
          type: 'reference',
          to: [{type: 'user'}],
        }),
      ],
      preview: {
        select: {
          title: 'date',
          subtitle: 'dutyPersonnelStandIn.name',
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
              ? `${format(new Date(2023, 1, title), 'do')} - ${subtitle}`
              : format(new Date(2023, 1, title), 'do'),
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

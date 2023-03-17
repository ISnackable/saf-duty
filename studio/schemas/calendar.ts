import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {MONTH_NAMES} from '../constants'
import {CustomValidatorResult, ValidationContext} from 'sanity'
// https://www.sanity.io/schemas/is-your-microcopy-unique-c7b3785e
const uniqueMicrocopyKeyQuery =
  '!defined(*[_type==$type && date >= $firstDayOfTheMonth && date <= $lastDayOfTheMonth && !(_id in [$draftId, $publishedId])][0]._id)'

const executeQuery = async (ctx: ValidationContext, query: string, value?: string) => {
  const {document} = ctx
  if (!value || !document) return true
  const id = document._id.replace('drafts.', '')

  const year = new Date(value).getFullYear()
  const month = new Date(value).getMonth()

  const firstDayOfTheMonth = new Date(year, month, 1).toLocaleDateString('sv-SE')
  const lastDayOfTheMonth = new Date(year, month + 1, 0).toLocaleDateString('sv-SE')

  const params = {
    type: 'calendar',
    firstDayOfTheMonth,
    lastDayOfTheMonth,
    draftId: `drafts.${id}`,
    publishedId: id,
  }

  return await ctx.getClient({apiVersion: '2023-01-01'}).fetch(query, params)
}

export const isUniqueMicrocopyKey = async (
  value: string | undefined,
  ctx: ValidationContext
): Promise<CustomValidatorResult> => {
  const isUnique = await executeQuery(ctx, uniqueMicrocopyKeyQuery, value)
  return isUnique ? true : 'There is another microcopy with the same key for this namespace'
}

export default defineType({
  name: 'calendar',
  title: 'Calendar',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      initialValue: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString(
        'sv-SE'
      ),
      options: {
        dateFormat: 'MMMM, YYYY',
      },
      validation: (Rule) => [
        Rule.required(),
        Rule.custom(isUniqueMicrocopyKey).error(
          'A document with this month and year already exists'
        ),
      ],
    }),
    defineField({
      name: 'roster',
      title: 'Roster',
      type: 'roster',
    }),
  ],
  preview: {
    select: {
      title: 'date',
    },
    prepare({title}) {
      const year = new Date(title).getFullYear()
      const month = MONTH_NAMES[new Date(title).getMonth()]

      return {
        title: `${month}, ${year}`,
        subtitle: `${year}`,
      }
    },
  },
})

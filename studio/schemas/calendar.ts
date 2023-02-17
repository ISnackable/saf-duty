import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {MONTH_NAMES} from '../constants'
import {CustomValidatorResult, ValidationContext} from 'sanity'
// https://www.sanity.io/schemas/is-your-microcopy-unique-c7b3785e
const uniqueMicrocopyKeyQuery =
  '!defined(*[_type==$type && month==$value && year==$year && !(_id in [$draftId, $publishedId])][0]._id)'

const executeQuery = async (ctx: ValidationContext, query: string, value?: string) => {
  const {document} = ctx
  if (!value || !document || !document.year) return true
  const id = document._id.replace('drafts.', '')

  const params = {
    type: 'calendar',
    value,
    year: document.year,
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
      name: 'year',
      title: 'Year',
      type: 'number',
      initialValue: new Date().getFullYear(),
      validation: (Rule) =>
        Rule.integer().min(1900).max(2100).required().error('Must be a valid year'),
    }),
    defineField({
      name: 'month',
      title: 'Month',
      type: 'string',
      options: {
        list: MONTH_NAMES.map((month) => month),
      },
      initialValue: MONTH_NAMES[new Date().getMonth()],
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
      title: 'month',
      subtitle: 'year',
    },
    prepare({title, subtitle}) {
      const titleAndYear = `${title}, ${subtitle}`

      return {
        title: titleAndYear,
        subtitle,
      }
    },
  },
})

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
    }),
  ],
})

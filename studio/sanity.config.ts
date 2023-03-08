import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {myStructure} from './deskStructure'
import config from '../site.config'

export default defineConfig({
  name: 'default',
  title: config.title,

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    deskTool({
      structure: myStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})

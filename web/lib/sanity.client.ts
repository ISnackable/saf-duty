import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from './sanity.api'

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.SANITY_API_TOKEN,
})

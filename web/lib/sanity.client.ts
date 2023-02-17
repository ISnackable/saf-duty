import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "./sanity.api";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.SANITY_API_TOKEN,
});

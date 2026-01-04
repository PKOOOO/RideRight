
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2025-01-04',
})

async function runTest() {
    const query1 = "7 seat"
    console.log(`\nTesting search for: "${query1}"`)
    const result1 = await client.fetch(`*[
    _type == "product" && (
      name match $q + "*" || description match $q + "*" || category->title match $q + "*"
    )
  ]{name}`, { q: query1 })
    console.log(`Found ${result1.length} results.`)
    if (result1.length > 0) console.log(result1[0].name)

    const query2 = "7 seater"
    console.log(`\nTesting search for: "${query2}"`)
    const result2 = await client.fetch(`*[
    _type == "product" && (
      name match $q + "*" || description match $q + "*" || category->title match $q + "*"
    )
  ]{name}`, { q: query2 })
    console.log(`Found ${result2.length} results.`)
}

runTest()

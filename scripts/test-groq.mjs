
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
    const searchQuery = "7 seater"
    console.log(`Testing search for: "${searchQuery}"`)

    const query = `*[
    _type == "product"
    && (
      name match $searchQuery + "*"
      || description match $searchQuery + "*"
      || category->title match $searchQuery + "*"
    )
  ] {
    name,
    description
  }`

    const results = await client.fetch(query, { searchQuery })
    console.log(`Found ${results.length} results.`)
    results.forEach(r => console.log(`- ${r.name}`))

    // Debug: Find the Peugeot specifically to see its description
    console.log('\n--- Checking Peugeot 5008 Description ---')
    const peugeot = await client.fetch(`*[_type == "product" && name match "Peugeot 5008"][0]{name, description}`)
    if (peugeot) {
        console.log(`Name: ${peugeot.name}`)
        console.log(`Description: ${peugeot.description}`)
    } else {
        console.log("Peugeot 5008 not found in DB.")
    }
}

runTest()

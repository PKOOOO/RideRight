
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
    console.error('Missing required environment variables:')
    console.error('NEXT_PUBLIC_SANITY_PROJECT_ID:', projectId)
    console.error('NEXT_PUBLIC_SANITY_DATASET:', dataset)
    console.error('SANITY_API_TOKEN or SANITY_API_WRITE_TOKEN:', token ? '***' : 'MISSING')
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2025-12-22',
})

async function deleteAll() {
    try {
        console.log(`Connecting to Sanity project: ${projectId}, dataset: ${dataset}`)

        // Fetch all documents
        console.log('Fetching all documents...')
        const query = '*[_id != ""]' // Select all documents

        // We'll use a transaction for batch deletion, but Sanity has limits.
        // It's safer to just delete by query which Sanity client supports implicitly or via explicit method if supported.
        // client.delete({query: '*'}) is the most efficient if supported, otherwise fetch and delete loop.

        console.log('Deleting all documents...')
        const result = await client.delete({ query: '*' })

        console.log('Deletion result:', result)
        console.log('Successfully deleted all documents.')

    } catch (error) {
        console.error('Error deleting documents:', error)
        process.exit(1)
    }
}

deleteAll()

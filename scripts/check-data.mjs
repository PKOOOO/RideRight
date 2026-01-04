
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-22'

console.log(`Config: ProjectID=${projectId}, Dataset=${dataset}`)

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion,
})

async function checkData() {
    try {
        // Check Categories
        console.log('\n--- Checking Categories (Makes) ---')
        const categories = await client.fetch(`*[_type == "category"]{ _id, title, slug }`)
        console.log(`Found ${categories.length} categories:`)
        categories.forEach(c => console.log(` - ${c.title} (${c._id})`))

        // Check Featured Products
        console.log('\n--- Checking Featured Products ---')
        // Query matches FEATURED_PRODUCTS_QUERY: _type == "product" && featured == true && stock > 0
        const featured = await client.fetch(`*[_type == "product" && featured == true && stock > 0]{ _id, name, stock, featured }`)
        console.log(`Found ${featured.length} featured products (with stock > 0):`)
        featured.forEach(p => console.log(` - ${p.name} (Stock: ${p.stock})`))

        // Check ALL Products to see if 'featured' flag is set at all
        const allFeatured = await client.fetch(`*[_type == "product" && featured == true]{ _id, name, stock, featured }`)
        if (featured.length === 0 && allFeatured.length > 0) {
            console.log(`\nNOTE: Found ${allFeatured.length} products marked 'featured' but with stock <= 0 (so they are hidden).`)
            allFeatured.forEach(p => console.log(` - ${p.name} (Stock: ${p.stock})`))
        }

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

checkData()

import { type SchemaTypeDefinition } from 'sanity'

import { categoryType } from './categoryType'
import { customerType } from './customerType'
import { orderType } from './orderType'
import { productType } from './productType'
import { subscriberType } from './subscriberType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, customerType, productType, orderType, subscriberType],
}
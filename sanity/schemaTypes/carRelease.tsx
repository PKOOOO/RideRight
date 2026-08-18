import { defineField, defineType } from 'sanity'

export const carRelease = defineType({
  name: 'carRelease',
  title: 'Car Release / Gate Pass',
  type: 'document',
  fields: [
    defineField({
      name: 'passRef',
      title: 'Pass Reference',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: () => `GP-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    }),
    defineField({
      name: 'issuedAt',
      title: 'Issued At',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'vehicleName',
      title: 'Vehicle',
      type: 'string',
      description: 'e.g. 2022 Nissan Note Aura',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'registrationNumber',
      title: 'Registration Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuedBy',
      title: 'Issued By (staff)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorizedBy',
      title: 'Authorized By',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'collectedBy',
      title: 'Vehicle Collected By',
      type: 'object',
      fields: [
        defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'phone', title: 'Phone (e.g. 07XXXXXXXX)', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'idNumber', title: 'ID Number', type: 'string' }),
      ],
    }),
    defineField({
      name: 'inclusions',
      title: 'Items Included at Exit',
      type: 'object',
      fields: [
        'jackHandle', 'jack', 'jRaiser', 'radio', 'cd',
        'floorMats', 'headRest', 'cigaretteLighter', 'spareWheel', 'wheelSpanner',
      ].map((f) => defineField({ name: f, type: 'boolean', initialValue: false })),
    }),
    defineField({
      name: 'conditionNotes',
      title: 'Condition Notes at Exit',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'sent'] },
      initialValue: 'draft',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'passRef', subtitle: 'collectedBy.name', vehicle: 'vehicleName' },
    prepare({ title, subtitle, vehicle }) {
      return { title, subtitle: `${vehicle ?? ''} • ${subtitle ?? ''}` }
    },
  },
})
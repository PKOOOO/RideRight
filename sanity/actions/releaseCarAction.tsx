import { useState, createElement } from 'react'
import { useToast } from '@sanity/ui'

export function ReleaseCarAction(props: any) {
  const { draft, published, id, type } = props
  const [sending, setSending] = useState(false)
  const doc = draft || published
  const toast = useToast()

  if (type !== 'carRelease' || doc?.status === 'sent') return null

  return {
    label: sending ? 'Sending...' : 'Publish & Notify Owner',
    onHandle: async () => {
      setSending(true)
      try {
        const res = await fetch('/api/car-release/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: doc._id }),
        })
        if (!res.ok) throw new Error(await res.text())

        const receiptUrl = process.env.NEXT_PUBLIC_SITE_URL + '/release/' + doc.passRef

        toast.push({
          status: 'success',
          title: 'Owner notified',
          description: createElement(
            'a',
            {
              href: receiptUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
              style: { color: '#2276FC', textDecoration: 'underline' },
            },
            'Open receipt / download PDF'
          ),
          duration: 15000,
        })

        props.onComplete()
      } catch (e) {
        alert('Failed to send release: ' + (e as Error).message)
      } finally {
        setSending(false)
      }
    },
  }
}
import { useState } from 'react'

export function TlaSubscribeButton({
  orgId,
  priceId, // bv. 'price_12345' uit Stripe dashboard → Products → Price
}: { 
  orgId: string; 
  priceId: string 
}) {
  const [loading, setLoading] = useState(false)

  async function startCheckout() {
    try {
      setLoading(true)
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_id: orgId, price_id: priceId }),
      })
      if (!res.ok) throw new Error('Checkout request failed')
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      alert('Kon checkout niet starten.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={startCheckout} 
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
    >
      {loading ? 'Even geduld…' : 'Abonneer op Timeline Alchemy'}
    </button>
  )
}

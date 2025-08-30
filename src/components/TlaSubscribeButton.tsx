import { useState } from 'react'

export function TlaSubscribeButton({
  orgId,
  priceId, // bv. 'price_12345' uit Stripe dashboard → Products → Price
  children,
  className,
  variant = 'default'
}: { 
  orgId: string; 
  priceId: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'trust';
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

  // Default styling per variant
  const getDefaultClassName = () => {
    switch (variant) {
      case 'hero':
        return "px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50";
      case 'trust':
        return "px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50";
      default:
        return "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200";
    }
  }

  const buttonClassName = className || getDefaultClassName();

  return (
    <button 
      onClick={startCheckout} 
      disabled={loading}
      className={buttonClassName}
    >
      {loading ? 'Even geduld…' : children || 'Abonneer op Timeline Alchemy'}
    </button>
  )
}

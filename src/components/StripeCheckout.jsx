import { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '../lib/stripe'

function CheckoutForm({ onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmed`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PaymentElement />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="w-full bg-[#38e07b] text-black font-semibold py-3 rounded-xl hover:bg-[#2bc96a] transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  )
}

export default function StripeCheckout({ clientSecret, onSuccess }) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#38e07b',
        colorBackground: '#ffffff0d',
        colorText: '#ffffff',
        colorDanger: '#ff4444',
        borderRadius: '12px',
        fontFamily: 'Montserrat, sans-serif',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  )
}
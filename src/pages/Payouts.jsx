import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiExternalLink, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../supabase'
import { useTheme } from '../context/ThemeContext'

export default function Payouts() {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [restaurant, setRestaurant] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchRestaurant()
  }, [])

  useEffect(() => {
  if (
    searchParams.get('success') === 'true' &&
    restaurant?.stripe_account_id &&
    !restaurant?.stripe_onboarding_complete &&
    !fetching
  ) {
    checkStatus()
  }
}, [restaurant, fetching])

  const fetchRestaurant = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, email, stripe_account_id, stripe_onboarding_complete')
        .eq('owner_id', user.id)
        .single()

      if (error) throw error
      setRestaurant(data)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const checkStatus = async () => {
    try {
      const { data } = await supabase.functions.invoke('check-connect-status', {
        body: {
          restaurantId: restaurant.id,
          stripeAccountId: restaurant.stripe_account_id,
        },
      })
      if (data.isComplete) {
        setRestaurant((prev) => ({ ...prev, stripe_onboarding_complete: true }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleOnboard = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: {
          restaurantId: restaurant.id,
          email: restaurant.email,
        },
      })
      if (error) throw error
      window.location.href = data.url
    } catch (err) {
      alert('Failed to start onboarding. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-2">Payouts</h1>
      <p className={`mb-8 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
        Connect your bank account to receive payments from orders.
      </p>

      {restaurant?.stripe_onboarding_complete ? (
        // Connected state
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <FiCheckCircle className="text-[#38e07b] text-2xl" />
            <span className="font-semibold text-lg">Payouts Active</span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
            Your bank account is connected. Earnings are automatically transferred after each order minus the 10% platform fee.
          </p>
        </div>
      ) : (
        // Not connected state
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <FiAlertCircle className="text-yellow-400 text-2xl" />
            <span className="font-semibold text-lg">Payouts Not Set Up</span>
          </div>
          <p className={`text-sm mb-6 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
            You need to connect a bank account before you can receive payments from orders. This is handled securely by Stripe.
          </p>
          <button
            onClick={handleOnboard}
            disabled={loading}
            className="flex items-center gap-2 bg-[#38e07b] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#2bc96a] transition disabled:opacity-50"
          >
            <FiExternalLink />
            {loading ? 'Redirecting to Stripe...' : 'Connect Bank Account'}
          </button>
        </div>
      )}

      {/* Info box */}
      <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className="font-semibold mb-2 text-sm">How payouts work</h3>
        <ul className={`text-sm space-y-1 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
          <li>• Customer pays at checkout via Stripe</li>
          <li>• QuickPlate retains a 10% platform fee</li>
          <li>• Remaining 90% is transferred to your bank account</li>
          <li>• Transfers typically arrive within 2 business days</li>
        </ul>
      </div>
    </div>
  )
}
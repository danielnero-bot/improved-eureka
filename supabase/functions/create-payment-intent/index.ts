import Stripe from 'https://esm.sh/stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  try {
    const { amount, orderId, restaurantStripeAccountId } = await req.json()

    // Guard: make sure restaurant has completed onboarding
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('stripe_onboarding_complete')
      .eq('stripe_account_id', restaurantStripeAccountId)
      .single()

    if (!restaurant?.stripe_onboarding_complete) {
      return new Response(
        JSON.stringify({ error: 'Restaurant payouts not set up yet.' }),
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents e.g. $20.00 = 2000
      currency: 'usd',
      application_fee_amount: Math.round(amount * 0.10), // QuickPlate's 10% cut
      transfer_data: {
        destination: restaurantStripeAccountId,
      },
      metadata: { orderId },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    )
  }
})
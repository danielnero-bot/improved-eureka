import Stripe from 'https://esm.sh/stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Function loaded')
console.log('STRIPE_SECRET_KEY exists:', !!Deno.env.get('STRIPE_SECRET_KEY'))
console.log('SUPABASE_URL exists:', !!Deno.env.get('SUPABASE_URL'))

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    console.log('Request received')
    const body = await req.json()
    console.log('Body:', JSON.stringify(body))

    const { amount, orderId, restaurantStripeAccountId } = body

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('stripe_onboarding_complete')
      .eq('stripe_account_id', restaurantStripeAccountId)
      .single()

    console.log('Restaurant:', JSON.stringify(restaurant))

    if (!restaurant?.stripe_onboarding_complete) {
      return new Response(
        JSON.stringify({ error: 'Restaurant payouts not set up yet.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      application_fee_amount: Math.round(amount * 0.10),
      transfer_data: {
        destination: restaurantStripeAccountId,
      },
      metadata: { orderId },
    })

    console.log('PaymentIntent created:', paymentIntent.id)

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error:', err.message, err.stack)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
import Stripe from 'https://esm.sh/stripe@14'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { restaurantId, stripeAccountId } = await req.json()

    const account = await stripe.accounts.retrieve(stripeAccountId)
    const isComplete = account.details_submitted

    if (isComplete) {
      await supabase
        .from('restaurants')
        .update({ stripe_onboarding_complete: true })
        .eq('id', restaurantId)
    }

    return new Response(
      JSON.stringify({ isComplete }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders }, status: 500 }
    )
  }
})
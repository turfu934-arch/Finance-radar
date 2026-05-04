import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-06-20",
});

// ── Price IDs (set in .env.local) ─────────────────────────────────────────────
export const PRICES = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
};

// ── Create checkout session ───────────────────────────────────────────────────
export async function createCheckoutSession(userId: string, email: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: PRICES.pro_monthly, quantity: 1 }],
    customer_email: email,
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?step=paywall`,
  });
  return session;
}

// ── Create billing portal session ────────────────────────────────────────────
export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });
  return session;
}

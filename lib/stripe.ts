import Stripe from "stripe";

const getStripe = () => {
  const key = process.env.STRIPE_API_SECRET_KEY;
  if (!key || key.includes("sk_test_XXXX")) return null;
  return new Stripe(key, {
    apiVersion: "2026-06-24.dahlia",
    typescript: true,
  });
};

export const stripe = getStripe();

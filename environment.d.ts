declare module "ra-language-portuguese";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;

      STRIPE_API_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;

      NEXT_PUBLIC_APP_URL: string;

      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;

      SUPABASE_ADMIN_IDS: string;
    }
  }
}

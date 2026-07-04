import { getServerUserId } from "./supabase-server";

const ADMIN_IDS = process.env.SUPABASE_ADMIN_IDS?.split(", ") ?? [];

export const getIsAdmin = async () => {
  const userId = await getServerUserId();

  if (!userId) return false;

  return ADMIN_IDS.includes(userId);
};

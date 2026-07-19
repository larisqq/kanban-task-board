import type { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

let guestSessionPromise: Promise<Session> | null = null;

async function createOrRestoreGuestSession(): Promise<Session> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (session) {
    return session;
  }

  const { data, error } =
    await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error("Supabase did not return a guest session.");
  }

  return data.session;
}

export function ensureGuestSession(): Promise<Session> {
  if (!guestSessionPromise) {
    guestSessionPromise =
      createOrRestoreGuestSession().catch((error) => {
        guestSessionPromise = null;
        throw error;
      });
  }

  return guestSessionPromise;
}
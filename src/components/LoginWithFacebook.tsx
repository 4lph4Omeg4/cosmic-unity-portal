// bv. src/components/LoginWithFacebook.tsx
import { supabase } from '@/utils/supabase';

export default function LoginWithFacebook() {
  return (
    <button
      onClick={() =>
        supabase.auth.signInWithOAuth({ provider: 'facebook' }) // geen redirectTo -> gebruikt je Site URL
      }
    >
      Sign in with Facebook
    </button>
  );
}

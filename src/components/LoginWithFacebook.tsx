import { supabase } from '@/utils/supabase'; // laat dit zo als jouw supabase.ts in /utils staat

export default function FacebookConnectButton() {
  const handleClick = async () => {
   await supabase.auth.signInWithOAuth({
  provider: 'facebook',
  options: {
    redirectTo: `${window.location.origin}/timeline-alchemy/admin/social-connections`,
  },
});

  };

  return <button onClick={handleClick}>Connect Facebook</button>;
}

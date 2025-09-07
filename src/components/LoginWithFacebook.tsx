// src/components/FacebookConnectButton.tsx
import { supabase } from '@/utils/supabase';

export default function FacebookConnectButton() {
  const handleClick = async () => {
    await supabase.auth.linkIdentity({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/timeline-alchemy/admin/social-connections`,
      },
    });
  };
  return <button onClick={handleClick}>Connect Facebook</button>;
}

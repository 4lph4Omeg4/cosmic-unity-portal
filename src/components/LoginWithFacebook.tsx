// src/components/LoginWithFacebook.tsx
import { supabase } from '@/utils/supabase'; // pas dit aan als jouw pad anders is
import { useState } from 'react';

export default function LoginWithFacebook() {
  const [busy, setBusy] = useState(false);

  const handleConnect = async () => {
    try {
      setBusy(true);
      await supabase.auth.linkIdentity({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/timeline-alchemy/admin/social-connections`,
        },
      });
      // Na deze call ga je naar Facebook; bij terugkomst is het gelinkt.
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={handleConnect} disabled={busy}>
      {busy ? 'Connecting…' : 'Connect Facebook'}
    </button>
  );
}

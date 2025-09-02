export type OnboardingDraft = {
  profile?: { 
    displayName: string; 
    avatar?: string; 
    role?: "Creator"|"Client"|"Admin" 
  };
  organization?: { 
    orgName: string; 
    website?: string; 
    useCase?: "Solo"|"Team"|"Agency" 
  };
  socials?: { 
    X?: boolean; 
    Instagram?: boolean; 
    YouTube?: boolean; 
    LinkedIn?: boolean 
  };
  preferences?: { 
    weeklyDigest: boolean; 
    aiSuggestions: boolean; 
    goals?: string 
  };
};

export async function loadDraft(): Promise<OnboardingDraft> { 
  return JSON.parse(localStorage.getItem("onboardingDraft") || "{}"); 
}

export async function saveDraft(d: OnboardingDraft): Promise<void> { 
  localStorage.setItem("onboardingDraft", JSON.stringify(d)); 
}

export async function finishOnboarding(d: OnboardingDraft): Promise<void> { 
  console.log("FINISH", d); 
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Current user:', user.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, role')
      .eq('user_id', user.id)
      .single();

    console.log('Profile check result:', { profile, profileError });

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`User profile not found: ${profileError.message}`);
    }

    console.log('User profile found:', profile);

    // Update user profile with onboarding data
    const profileUpdates: any = {};
    if (d.profile?.displayName) {
      profileUpdates.display_name = d.profile.displayName;
    }
    if (d.profile?.role) {
      profileUpdates.role = d.profile.role.toLowerCase();
    }

    if (Object.keys(profileUpdates).length > 0) {
      console.log('Updating profile with:', profileUpdates);
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }
      console.log('✅ Profile updated successfully');
    }

    // Mark onboarding as completed (no need to update individual org since we use the main TLA org)
    console.log('✅ Onboarding completed - user has access to TLA functions');

    // Save onboarding data to a separate table or as metadata
    const onboardingData = {
      user_id: user.id,
      profile_data: d.profile,
      organization_data: d.organization,
      socials_data: d.socials,
      preferences_data: d.preferences,
      completed_at: new Date().toISOString()
    };

    console.log('✅ Onboarding completed successfully:', onboardingData);

  } catch (error) {
    console.error('Error finishing onboarding:', error);
    throw error;
  }

  // Clean up local storage
  localStorage.removeItem("onboardingDraft"); 
}

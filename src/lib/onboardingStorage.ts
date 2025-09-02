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

    // Get user profile to find org_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('org_id, display_name, role')
      .eq('user_id', user.id)
      .single();

    console.log('Profile check result:', { profile, profileError });

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`User profile not found: ${profileError.message}`);
    }

    if (!profile?.org_id) {
      console.error('No org_id in profile:', profile);
      throw new Error('User profile is not linked to any organization');
    }

    console.log('User is linked to organization:', profile.org_id);

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

    // Update organization with onboarding data
    const orgUpdates: any = {
      tla_client: true,
      needs_onboarding: false,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };

    if (d.organization?.orgName) {
      orgUpdates.name = d.organization.orgName;
    }
    if (d.organization?.website) {
      orgUpdates.website = d.organization.website;
    }
    if (d.organization?.useCase) {
      orgUpdates.use_case = d.organization.useCase;
    }

    // Add socials and preferences data
    if (d.socials) {
      orgUpdates.socials_data = d.socials;
    }
    if (d.preferences) {
      orgUpdates.preferences_data = d.preferences;
    }

    console.log('Updating organization with:', orgUpdates);

    const { error: orgError } = await supabase
      .from('orgs')
      .update(orgUpdates)
      .eq('id', profile.org_id);

    if (orgError) {
      console.error('Error updating organization:', orgError);
      throw new Error(`Failed to update organization: ${orgError.message}`);
    }

    console.log('✅ Organization updated successfully');

    // Save onboarding data to a separate table or as metadata
    const onboardingData = {
      user_id: user.id,
      org_id: profile.org_id,
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

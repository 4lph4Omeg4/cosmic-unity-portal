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
    let { data: profile, error: profileError } = await supabase
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
      
      // Try to find and link to a TLA organization
      console.log('Trying to find and link to TLA organization...');
      const { data: orgs, error: orgsError } = await supabase
        .from('orgs')
        .select('id, name, tla_client, needs_onboarding')
        .eq('tla_client', true)
        .eq('needs_onboarding', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (orgsError) {
        console.error('Error finding TLA organizations:', orgsError);
        throw new Error('Could not find TLA organization');
      }

      if (!orgs || orgs.length === 0) {
        throw new Error('No TLA organizations found that need onboarding');
      }

      const org = orgs[0];
      console.log('Found TLA organization to link to:', org);

      // Link user to this organization
      const { error: linkError } = await supabase
        .from('profiles')
        .update({ org_id: org.id })
        .eq('user_id', user.id);

      if (linkError) {
        console.error('Error linking user to organization:', linkError);
        throw new Error(`Failed to link user to organization: ${linkError.message}`);
      }

      console.log('✅ User linked to organization:', org.id);
      
      // Update profile variable for the rest of the function
      profile = { ...profile, org_id: org.id };
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

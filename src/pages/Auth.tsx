import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if this is an onboarding flow
  const isOnboarding = searchParams.get('onboarding') === 'true';
  const orgId = searchParams.get('org_id');
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  useEffect(() => {
    if (user) {
      // Check if there's pending onboarding
      const pendingOnboarding = sessionStorage.getItem('pendingOnboarding');
      if (pendingOnboarding) {
        try {
          const { orgId: pendingOrgId, session } = JSON.parse(pendingOnboarding);
          if (session === 'success' && pendingOrgId) {
            // Clear the pending onboarding
            sessionStorage.removeItem('pendingOnboarding');
            // Redirect to onboarding
            navigate(`/onboarding?session=success&org_id=${pendingOrgId}`);
            return;
          }
        } catch (error) {
          console.error('Error parsing pending onboarding:', error);
          sessionStorage.removeItem('pendingOnboarding');
        }
      }
      
      // Default redirect
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      toast({
        title: "Login mislukt",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welkom terug!",
        description: isOnboarding 
          ? "Je bent ingelogd. Je wordt doorgestuurd naar de onboarding..."
          : "Je bent succesvol ingelogd.",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('=== SIGNUP ATTEMPT ===');
    console.log('Email:', signUpData.email);
    console.log('Password length:', signUpData.password.length);
    console.log('Display name:', signUpData.displayName);

    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.displayName);

    console.log('=== SIGNUP RESULT ===');
    console.log('Error:', error);

    if (error) {
      console.error('Signup error details:', error);
      console.error('Error properties:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        code: error.code,
        details: error.details,
        hint: error.hint,
        __isAuthError: error.__isAuthError,
        fullError: JSON.stringify(error, null, 2)
      });

      // Get a more descriptive error message
      let errorMessage = error.message || 'Unknown error occurred';
      let errorCode = error.code || 'unknown';

      // Handle specific error cases
      if (error.message?.includes('Database error saving new user') || error.code === 'unexpected_failure') {
        errorMessage = 'Database configuratie probleem. De profiles tabel of triggers ontbreken.';
        errorCode = 'database_setup_required';
      } else if (error.message?.includes('rate_limit')) {
        errorMessage = 'Te veel pogingen. Probeer het over een paar minuten opnieuw.';
        errorCode = 'rate_limit';
      } else if (error.message?.includes('email_address_not_authorized')) {
        errorMessage = 'Dit email adres is niet geautoriseerd. Controleer je Supabase instellingen.';
        errorCode = 'not_authorized';
      } else if (error.message?.includes('weak_password')) {
        errorMessage = 'Wachtwoord is te zwak. Gebruik minimaal 6 karakters.';
        errorCode = 'weak_password';
      } else if (error.message?.includes('email_address_invalid')) {
        errorMessage = 'Ongeldig email adres.';
        errorCode = 'invalid_email';
      }

      toast({
        title: "Registratie mislukt",
        description: `${errorMessage} (Code: ${errorCode})`,
        variant: "destructive",
      });
    } else {
      console.log('Signup successful!');
      
      // Show email verification message
      toast({
        title: "Account succesvol aangemaakt! 🎉",
        description: "Bevestig je aanmelding in je email. Vervolgens kun je inloggen in deze interface.",
        duration: 8000, // Show for 8 seconds
      });
      
      // Clear the form
      setSignUpData({
        email: '',
        password: '',
        displayName: ''
      });
      
      // Switch to signin tab
      const signinTab = document.querySelector('[data-value="signin"]') as HTMLElement;
      if (signinTab) {
        signinTab.click();
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Onboarding Banner */}
        {isOnboarding && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2" />
            <h2 className="text-lg font-semibold mb-1">Welkom bij Timeline Alchemy! 🎉</h2>
            <p className="text-sm text-blue-100">
              Maak een account aan of log in om je onboarding te voltooien
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="font-cosmic text-3xl font-bold mb-2">
            <span className="text-cosmic-gradient">Join the</span>{' '}
            <span className="text-mystical-gradient">Chosen Ones</span>
          </h1>
          
          <p className="font-mystical text-muted-foreground">
            {isOnboarding 
              ? 'Maak een account aan om te beginnen met je Timeline Alchemy reis'
              : 'Enter the cosmic community of awakened souls'
            }
          </p>
        </div>

        <Card className="cosmic-hover bg-card/90 backdrop-blur-sm border-border/50 shadow-cosmic">
          <CardHeader>
            <CardTitle className="font-cosmic text-center">
              {isOnboarding ? 'Timeline Alchemy Account' : 'Cosmic Portal'}
            </CardTitle>
            <CardDescription className="font-mystical text-center">
              {isOnboarding 
                ? 'Maak een account aan om te beginnen'
                : 'Access your spiritual journey'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">
                  {isOnboarding ? 'Bestaand Account' : 'Inloggen'}
                </TabsTrigger>
                <TabsTrigger value="signup">
                  {isOnboarding ? 'Nieuw Account' : 'Registreren'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-mail</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="mystical" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Inloggen..." : (isOnboarding ? "Inloggen & Doorgaan" : "Inloggen")}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                {/* Email verification info banner */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email verificatie vereist</p>
                      <p className="text-blue-700">Na registratie ontvang je een bevestigingsemail. Klik op de link in de email om je account te activeren.</p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Naam</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpData.displayName}
                      onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                      placeholder="Je kosmische naam"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="cosmic" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Registreren..." : (isOnboarding ? "Account Aanmaken & Beginnen" : "Word een Chosen One")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Auth;

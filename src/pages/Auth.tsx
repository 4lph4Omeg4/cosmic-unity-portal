import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthDebug from '@/components/AuthDebug';
import AuthTroubleshooting from '@/components/AuthTroubleshooting';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
        description: "Je bent succesvol ingelogd.",
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
      console.error('Signup error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        code: error.code,
        details: error.details,
        hint: error.hint,
        __isAuthError: error.__isAuthError
      });

      toast({
        title: "Registratie mislukt",
        description: `${error.message} (Code: ${error.code || 'onbekend'})`,
        variant: "destructive",
      });
    } else {
      console.log('Signup successful!');
      toast({
        title: "Welkom bij The Chosen Ones!",
        description: "Controleer je email voor verificatie.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
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
            Enter the cosmic community of awakened souls
          </p>
        </div>

        <Card className="cosmic-hover bg-card/90 backdrop-blur-sm border-border/50 shadow-cosmic">
          <CardHeader>
            <CardTitle className="font-cosmic text-center">Cosmic Portal</CardTitle>
            <CardDescription className="font-mystical text-center">
              Access your spiritual journey
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Inloggen</TabsTrigger>
                <TabsTrigger value="signup">Registreren</TabsTrigger>
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
                    {loading ? "Inloggen..." : "Inloggen"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
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
                    {loading ? "Registreren..." : "Word een Chosen One"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Debug Component - Remove this in production */}
        <AuthDebug />
        <AuthTroubleshooting />
      </div>
    </div>
  );
};

export default Auth;

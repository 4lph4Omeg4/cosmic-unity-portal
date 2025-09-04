# Social Media Integration Setup Guide

Deze guide helpt je bij het opzetten van de social media integratie voor Timeline Alchemy.

## 🚀 **Wat is er geïmplementeerd?**

### **1. Database Schema**
- `social_connections` tabel voor OAuth tokens
- `social_posts` tabel voor tracking van gepubliceerde posts
- Uitbreiding van `previews` tabel met scheduling en platform velden

### **2. OAuth Integratie**
- Instagram Basic Display API
- Facebook Graph API
- Twitter API v2
- LinkedIn Marketing API

### **3. UI Components**
- `SocialConnectionsStep` in onboarding wizard
- `SocialConnectionsManager` voor account beheer
- Uitgebreide PreviewWizard met social media selectie

### **4. Automatische Publicatie**
- `scheduled-publisher` Edge Function
- `cron-publisher` voor regelmatige uitvoering
- Platform-specifieke posting logic

## 🔧 **Setup Instructies**

### **Stap 1: Environment Variabelen**

Voeg deze variabelen toe aan je `.env.local`:

```bash
# Site Configuration
SITE_URL=http://localhost:3000

# Instagram OAuth (Basic Display API)
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# Facebook OAuth (Graph API)
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# Twitter OAuth 2.0
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### **Stap 2: Supabase Edge Functions Deployen**

```bash
# Deploy alle Edge Functions
supabase functions deploy social-oauth
supabase functions deploy social-callback
supabase functions deploy scheduled-publisher
supabase functions deploy cron-publisher
```

### **Stap 3: Database Migraties Uitvoeren**

```bash
# Run de migraties
supabase db push
```

### **Stap 4: OAuth Apps Aanmaken**

#### **Instagram Basic Display API**
1. Ga naar [Facebook Developers](https://developers.facebook.com/)
2. Maak een nieuwe app aan
3. Voeg "Instagram Basic Display" product toe
4. Configureer OAuth redirect URI: `https://yourdomain.com/auth/callback/instagram`
5. Kopieer Client ID en Secret

#### **Facebook Graph API**
1. In dezelfde Facebook app
2. Voeg "Facebook Login" product toe
3. Configureer OAuth redirect URI: `https://yourdomain.com/auth/callback/facebook`
4. Voeg scopes toe: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`

#### **Twitter API v2**
1. Ga naar [Twitter Developer Portal](https://developer.twitter.com/)
2. Maak een nieuwe app aan
3. Configureer OAuth 2.0 redirect URI: `https://yourdomain.com/auth/callback/twitter`
4. Kopieer Client ID en Secret

#### **LinkedIn Marketing API**
1. Ga naar [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Maak een nieuwe app aan
3. Configureer OAuth redirect URI: `https://yourdomain.com/auth/callback/linkedin`
4. Voeg scopes toe: `r_liteprofile`, `r_emailaddress`, `w_member_social`

### **Stap 5: Cron Job Configureren**

Voeg een cron job toe aan je server om de scheduled publisher uit te voeren:

```bash
# Elke 5 minuten
*/5 * * * * curl -X POST https://yourdomain.com/api/cron-publisher
```

Of gebruik een service zoals Vercel Cron of GitHub Actions.

## 📱 **Gebruik**

### **Voor Gebruikers**
1. Ga door de onboarding wizard
2. In stap "Connect Accounts" kun je social media accounts verbinden
3. Selecteer platforms voor automatische publicatie

### **Voor Admins**
1. In de Preview Wizard kun je social platforms selecteren
2. Stel een publicatie datum/tijd in
3. Wanneer content wordt goedgekeurd, wordt het automatisch gepubliceerd

### **Account Beheer**
- Gebruikers kunnen verbonden accounts beheren via hun profiel
- Admins kunnen alle verbindingen bekijken in het dashboard

## 🔍 **Testing**

### **Lokaal Testen**
1. Start je development server
2. Ga naar de onboarding wizard
3. Probeer een social media account te verbinden
4. Test de preview wizard met social media selectie

### **Production Testing**
1. Deploy alle Edge Functions
2. Configureer OAuth apps met production URLs
3. Test de volledige flow met echte accounts

## 🚨 **Belangrijke Opmerkingen**

### **API Limieten**
- Instagram: 200 requests per uur
- Facebook: 200 requests per uur
- Twitter: 300 requests per 15 minuten
- LinkedIn: 100 requests per dag

### **Token Management**
- Tokens worden automatisch ververst wanneer nodig
- Verlopen tokens worden gemarkeerd in de UI
- Gebruikers kunnen accounts opnieuw verbinden

### **Content Aanpassingen**
- Elke platform heeft zijn eigen content formatting
- Images worden automatisch aangepast per platform
- Hashtags worden geoptimaliseerd per platform

## 🛠 **Troubleshooting**

### **OAuth Errors**
- Controleer of redirect URIs correct zijn geconfigureerd
- Verificeer dat Client ID en Secret correct zijn
- Check of de Edge Functions correct zijn gedeployed

### **Publishing Errors**
- Controleer of accounts correct zijn verbonden
- Verificeer of tokens nog geldig zijn
- Check de logs in Supabase Edge Functions

### **Database Errors**
- Controleer of migraties correct zijn uitgevoerd
- Verificeer RLS policies
- Check of de gebruiker de juiste rechten heeft

## 📈 **Volgende Stappen**

1. **Analytics**: Voeg tracking toe voor gepubliceerde posts
2. **A/B Testing**: Test verschillende content formats
3. **Scheduling**: Uitgebreidere scheduling opties
4. **Content Optimization**: AI-powered content aanpassingen per platform
5. **Multi-Account**: Ondersteuning voor meerdere accounts per platform

## 🆘 **Support**

Voor vragen of problemen:
1. Check de logs in Supabase Edge Functions
2. Controleer de browser console voor errors
3. Verificeer database connecties en permissions
4. Test OAuth flows individueel per platform

---

**Veel succes met de social media integratie! 🚀**

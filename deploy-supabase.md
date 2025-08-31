# 🚀 Supabase Deployment Guide

## 📋 **Stap 1: Database Migraties Uitvoeren**

Ga naar je Supabase Dashboard → SQL Editor en voer deze migraties uit in volgorde:

1. **20250120000010_create_orgs_table.sql** - Maakt de orgs tabel aan
2. **20250120000011_add_orgs_rls.sql** - Voegt RLS policies toe
3. **20250120000012_add_profile_trigger.sql** - Voegt automatische profile creatie toe

## 🔧 **Stap 2: Edge Functions Deployen**

### Via Supabase CLI (aanbevolen):
```bash
# Installeer Supabase CLI als je het nog niet hebt
npm install -g supabase

# Login en link je project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy alle functions
supabase functions deploy checkout
supabase functions deploy create-org
supabase functions deploy stripe-webhook
```

### Via Supabase Dashboard:
1. Ga naar **Edge Functions** in je dashboard
2. Upload de volgende bestanden:
   - `supabase/functions/checkout/index.ts`
   - `supabase/functions/create-org/index.ts`
   - `supabase/functions/stripe-webhook/index.ts`

## 🔑 **Stap 3: Environment Variables Instellen**

In je Supabase Dashboard → Settings → Environment Variables:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_SITE_URL=https://your-domain.com
```

## 🧪 **Stap 4: Testen**

1. **Test registratie**: Probeer een nieuwe gebruiker aan te maken
2. **Test TLA signup**: Test de Timeline Alchemy betalingsflow
3. **Controleer logs**: Kijk in de Supabase logs voor errors

## 🔍 **Debugging Tips**

### Veelvoorkomende Problemen:

1. **"orgs table does not exist"**
   - ✅ Voer de migraties uit
   - ✅ Controleer of de tabel is aangemaakt

2. **"profile creation failed"**
   - ✅ Controleer of de trigger is aangemaakt
   - ✅ Controleer RLS policies

3. **"Edge Function not found"**
   - ✅ Deploy de functions opnieuw
   - ✅ Controleer function URLs

4. **"Authentication failed"**
   - ✅ Controleer API keys
   - ✅ Controleer CORS settings

## 📞 **Support**

Als je nog steeds problemen hebt:
1. Check de Supabase logs
2. Controleer de browser console
3. Test de Edge Functions individueel

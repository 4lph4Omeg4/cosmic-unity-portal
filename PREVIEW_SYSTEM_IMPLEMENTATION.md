# Timeline Alchemy Preview System Implementation

## Overzicht

Het Timeline Alchemy Preview System is nu volledig geïmplementeerd met de mogelijkheid voor admins om echte previews te maken en plannen, en voor clients om deze te bekijken en goed te keuren.

## Database Setup

### 1. Voer de migratie uit

Voer eerst de database migratie uit in je Supabase SQL editor:

```sql
-- Kopieer en voer uit: supabase/migrations/20250120000000_create_timeline_alchemy_tables.sql
```

Deze migratie creëert alle benodigde tabellen:
- `organizations` - Organisatie management
- `clients` - Client management  
- `user_clients` - User-client relaties
- `ideas` - Content ideeën
- `previews` - Content previews voor client goedkeuring
- `publishes` - Publishing tracking
- `social_tokens` - Social media connecties
- `blog_posts` - Blog content

### 2. Sample data toevoegen (optioneel)

```sql
-- Voeg een test organisatie toe
INSERT INTO public.organizations (name, metadata) VALUES 
('Test Organization', '{"description": "Test organization for development"}');

-- Voeg een test client toe
INSERT INTO public.clients (org_id, name, contact_email) VALUES 
((SELECT id FROM public.organizations LIMIT 1), 'Test Client', 'test@example.com');

-- Voeg een admin user toe (vervang USER_ID met je eigen user ID)
INSERT INTO public.user_profiles (id, role) VALUES 
('YOUR_USER_ID', 'admin');

-- Koppel de user aan de client
INSERT INTO public.user_clients (user_id, client_id) VALUES 
('YOUR_USER_ID', (SELECT id FROM public.clients LIMIT 1));
```

## Functionaliteiten

### Admin Side

#### 1. Preview Wizard (`/timeline-alchemy/admin/preview-wizard`)

De Preview Wizard is een 5-stappen proces voor het maken van content previews:

**Stap 1: Client Selectie**
- Kies voor welke client de preview is
- Laadt echte clients uit de database

**Stap 2: Template Selectie**
- Kies uit 6 content templates:
  - Facebook, Instagram, X (Twitter), LinkedIn (social media)
  - Blog Post (lange content)
  - Custom Post (eigen content)

**Stap 3: Content Drafting**
- Schrijf de content message
- Bekijk geselecteerde blog posts
- Zie featured images
- Character limits per template

**Stap 4: Planning & Review**
- Stel publicatie datum en tijd in
- Voeg admin notes toe voor de client
- Bekijk samenvatting

**Stap 5: Opslaan**
- Preview wordt opgeslagen in database
- Status: 'pending' (wacht op client goedkeuring)

#### 2. Admin Dashboard (`/timeline-alchemy/admin/dashboard`)

- Overzicht van alle previews
- Filter op status, channel, client
- Zoeken in content
- Preview bewerken/verwijderen
- Statistieken bekijken

### Client Side

#### 1. My Previews (`/timeline-alchemy/client/my-previews`)

Clients kunnen hier:
- Alle previews bekijken die voor hen zijn gemaakt
- Preview status zien (pending/approved/rejected)
- Previews goedkeuren
- Wijzigingen aanvragen met feedback
- Admin notes bekijken

## Workflow

### 1. Preview Creatie (Admin)
1. Ga naar Preview Wizard
2. Selecteer client
3. Kies template
4. Schrijf content
5. Plan publicatie
6. Sla op → Preview wordt 'pending'

### 2. Client Review
1. Client logt in
2. Ziet pending previews in My Previews
3. Kan preview goedkeuren of wijzigingen aanvragen
4. Status wordt 'approved' of 'rejected'

### 3. Admin Follow-up
1. Admin ziet status updates in Dashboard
2. Kan previews bewerken of verwijderen
3. Kan nieuwe previews maken op basis van feedback

## Technische Details

### Database Schema

```sql
-- Previews tabel structuur
CREATE TABLE public.previews (
    id UUID PRIMARY KEY,
    idea_id UUID REFERENCES ideas(id),
    client_id UUID REFERENCES clients(id),
    channel TEXT NOT NULL, -- 'Facebook', 'Instagram', etc.
    template TEXT NOT NULL,
    draft_content JSONB NOT NULL, -- Content + metadata
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    admin_notes TEXT,
    client_feedback TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE
);
```

### API Endpoints

Het systeem gebruikt Supabase client voor alle database operaties:

- **Create Preview**: `supabase.from('previews').insert()`
- **Get Client Previews**: `supabase.from('previews').select().in('client_id', clientIds)`
- **Update Status**: `supabase.from('previews').update().eq('id', previewId)`
- **Delete Preview**: `supabase.from('previews').delete().eq('id', previewId)`

### Security

- Row Level Security (RLS) is geïmplementeerd
- Clients kunnen alleen hun eigen previews zien
- Admins kunnen alle previews beheren
- User authentication vereist voor alle operaties

## Testing

### 1. Admin Test
1. Log in als admin user
2. Ga naar Preview Wizard
3. Maak een test preview
4. Controleer of deze wordt opgeslagen

### 2. Client Test
1. Log in als client user
2. Ga naar My Previews
3. Bekijk de preview die je hebt gemaakt
4. Test goedkeuring/afwijzing functionaliteit

### 3. Database Test
1. Controleer of previews worden opgeslagen
2. Verifieer status updates
3. Test relaties tussen tabellen

## Troubleshooting

### Veelvoorkomende Problemen

1. **"No client access found"**
   - Controleer of user_profiles tabel een 'role' kolom heeft
   - Verifieer user_clients relaties

2. **"Failed to create preview"**
   - Controleer database connectie
   - Verifieer tabel structuur
   - Check RLS policies

3. **"User not authenticated"**
   - Zorg dat gebruiker is ingelogd
   - Controleer Supabase auth setup

### Debug Tips

- Gebruik browser console voor error logging
- Check Supabase logs in dashboard
- Verifieer database queries met directe SQL

## Volgende Stappen

1. **Publishing System**: Implementeer automatische publicatie van goedgekeurde content
2. **Social Media Integration**: Koppel met echte social media APIs
3. **Analytics**: Voeg preview performance tracking toe
4. **Notifications**: Email/SMS notificaties voor status updates
5. **Bulk Operations**: Mass preview creatie en beheer

## Support

Voor vragen of problemen:
1. Check de browser console voor errors
2. Verifieer database connectie
3. Controleer RLS policies
4. Test met sample data

Het systeem is nu klaar voor productie gebruik!

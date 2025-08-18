# Timeline Alchemy - Content Management Platform

Een moderne content management en social media publishing platform gebouwd met Next.js, Supabase en TailwindCSS.

## 🚀 Features

### Admin Functionaliteit
- **Ideas Management**: Bekijk, filter en beheer content ideeën
- **Preview Wizard**: Stap-voor-stap preview creatie (Client → Channel → Template → Draft → Schedule → Save)
- **Publish Queue**: Monitor publishing status en resultaten
- **Dashboard**: Real-time statistieken en overzicht

### Client Functionaliteit
- **My Previews**: Bekijk en goedkeur/afwijs previews met feedback
- **Social Connections**: Verbind en beheer sociale media accounts

### Automatisering
- **Cron Jobs**: Automatische publishing van goedgekeurde content
- **Fake Poster Service**: Simuleert social media posting voor development

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + RLS)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## 📋 Vereisten

- Node.js 18+
- Supabase account
- npm of yarn

## 🔧 Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd timeline-alchemy
```

### 2. Install Dependencies
```bash
npm install
# of
yarn install
```

### 3. Environment Variables
Kopieer `env.example` naar `.env.local` en vul je Supabase gegevens in:

```bash
cp env.example .env.local
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (voor publishing endpoint)
CRON_SECRET=your_secret_key_here
```

### 4. Database Setup
De applicatie gebruikt bestaande tabellen. Zorg ervoor dat je de volgende RLS policies hebt:

```sql
-- Admin kan alles zien
CREATE POLICY "Admin can see all" ON ideas FOR ALL USING (public.is_admin());

-- Clients zien alleen hun eigen data
CREATE POLICY "Clients see own data" ON previews 
FOR ALL USING (client_id = ANY(public.client_ids_for_user()));
```

### 5. Development Server
```bash
npm run dev
# of
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🗂️ Project Structuur

```
timeline-alchemy/
├── app/
│   ├── admin/           # Admin pagina's
│   │   ├── dashboard/   # Dashboard met statistieken
│   │   ├── ideas/       # Ideas management
│   │   └── preview-wizard/ # Preview creatie wizard
│   ├── client/          # Client pagina's
│   │   ├── my-previews/ # Preview goedkeuring
│   │   └── social-connections/ # Social media verbindingen
│   └── api/cron/        # Cron endpoints
├── lib/
│   ├── supabase/        # Supabase clients en types
│   └── poster/          # Fake poster service
├── app/actions/         # Server actions
│   ├── admin.ts         # Admin server actions
│   └── client.ts        # Client server actions
└── components/ui/       # shadcn/ui componenten
```

## 🔐 RLS Policies

De applicatie gebruikt Row Level Security voor data isolatie:

- **Admins**: Kunnen alle data zien via `public.is_admin()`
- **Clients**: Kunnen alleen hun eigen data zien via `public.client_ids_for_user()`
- **Service Role**: Wordt gebruikt voor cron jobs en admin acties

## 📅 Cron Jobs

De publishing cron job draait elke minuut en:

1. Haalt goedgekeurde previews op die klaar zijn voor publishing
2. Simuleert posting naar sociale media
3. Update de database met resultaten
4. Markeert previews als gepubliceerd of gefaald

### Cron Endpoint
```
GET /api/cron/publish
Authorization: Bearer {CRON_SECRET}
```

## 🚀 Deployment

### Vercel
1. Push naar GitHub
2. Verbind repository met Vercel
3. Configureer environment variables
4. Deploy

### Cron Job Setup
Voor productie, stel een externe cron service in (bijv. Vercel Cron Jobs):

```bash
# Elke minuut
* * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/cron/publish
```

## 🧪 Development

### Database Migraties
```bash
# Voeg nieuwe tabellen toe via Supabase dashboard
# Of gebruik Supabase CLI voor migrations
```

### Testing
```bash
npm run test
# of
yarn test
```

### Type Checking
```bash
npm run type-check
# of
yarn type-check
```

## 📝 API Endpoints

### Admin
- `GET /admin/dashboard` - Dashboard statistieken
- `GET /admin/ideas` - Ideas management
- `GET /admin/preview-wizard` - Preview creatie wizard
- `GET /admin/publish-queue` - Publishing status

### Client
- `GET /client/my-previews` - Preview goedkeuring
- `GET /client/social-connections` - Social media beheer

### Cron
- `GET /api/cron/publish` - Publishing cron job

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🆘 Support

Voor vragen of problemen:

1. Check de [Issues](../../issues) pagina
2. Maak een nieuwe issue aan
3. Neem contact op via [email](mailto:support@timelinealchemy.com)

---

**Timeline Alchemy** - Where Technology Meets Spirit ✨

# WelcomeSuccess Component

Een moderne React component voor een "Succesvol aangemeld"-pagina, gebouwd met Tailwind CSS en shadcn/ui componenten.

## Features

- 🎉 Vrolijke welkomstpagina met gepersonaliseerde gebruikersnaam
- ✅ Duidelijke succes indicator met checkmark icon
- 📊 Progress indicator (stap 1 van 3 voltooid)
- 🎨 Moderne gradient achtergrond en glassmorphism effecten
- 📱 Volledig responsief design
- 🔄 Animaties en hover effecten
- 🚀 Twee hoofdknoppen: Dashboard en Profiel instellen
- 👥 Optionele team uitnodigen sectie

## Installatie

De component gebruikt de volgende dependencies die al in je project aanwezig moeten zijn:

```bash
npm install lucide-react react-router-dom
```

## Gebruik

### Basis gebruik

```tsx
import WelcomeSuccess from '@/components/WelcomeSuccess'

function App() {
  return (
    <WelcomeSuccess username="Jan Jansen" />
  )
}
```

### Met custom handlers

```tsx
import WelcomeSuccess from '@/components/WelcomeSuccess'

function App() {
  const handleGoToDashboard = () => {
    // Custom dashboard navigatie logica
    navigate('/custom-dashboard')
  }

  const handleSetupProfile = () => {
    // Custom profiel setup logica
    navigate('/profile')
  }

  const handleInviteTeam = () => {
    // Custom team invite logica
    openInviteModal()
  }

  return (
    <WelcomeSuccess
      username="Jan Jansen"
      onGoToDashboard={handleGoToDashboard}
      onSetupProfile={handleSetupProfile}
      onInviteTeam={handleInviteTeam}
    />
  )
}
```

## Props

| Prop | Type | Default | Beschrijving |
|------|------|---------|--------------|
| `username` | `string` | `'Gebruiker'` | De naam van de aangemelde gebruiker |
| `onGoToDashboard` | `() => void` | `undefined` | Custom handler voor dashboard navigatie |
| `onSetupProfile` | `() => void` | `undefined` | Custom handler voor profiel setup |
| `onInviteTeam` | `() => void` | `undefined` | Custom handler voor team uitnodigen |

## Default Navigatie

Als je geen custom handlers meegeeft, gebruikt de component standaard React Router navigatie:

- Dashboard: `/dashboard`
- Profiel setup: `/profile/setup`

## Styling

De component gebruikt Tailwind CSS classes en is volledig aanpasbaar. Belangrijke styling features:

- Gradient achtergrond: `from-blue-50 via-indigo-50 to-purple-50`
- Glassmorphism effect: `bg-white/80 backdrop-blur-sm`
- Responsive design: `text-4xl md:text-5xl`
- Hover effecten: `hover:shadow-xl transition-all duration-200`

## Demo

Bekijk de `WelcomeSuccessDemo.tsx` component om te zien hoe je de component kunt testen en aanpassen.

## Aanpassingen

### Kleuren wijzigen

```tsx
// Wijzig de gradient kleuren in de className
className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
```

### Progress stappen aanpassen

```tsx
// Wijzig de Progress component value
<Progress value={50} className="h-2" />

// En pas de tekst aan
<span>2 van 4 voltooid</span>
```

### Icons wijzigen

```tsx
import { CheckCircle, Users, ArrowRight, Settings } from 'lucide-react'

// Vervang door andere Lucide icons
import { Check, UserPlus, Home, User } from 'lucide-react'
```

## Browser Ondersteuning

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Licentie

Deze component is onderdeel van je Timeline Alchemy project.

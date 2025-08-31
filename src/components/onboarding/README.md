# Onboarding Wizard

Een moderne, toegankelijke onboarding wizard voor Timeline Alchemy, gebouwd met React, TypeScript, Tailwind CSS en shadcn/ui componenten.

## 🚀 Features

- **4 Stappen Wizard**: Profiel, Organisatie, Social Media, Voorkeuren
- **Autosave**: Automatisch opslaan elke 600ms (debounced)
- **Persistentie**: Draft data wordt opgeslagen in localStorage
- **Validatie**: Zod schema validatie per stap
- **Animaties**: Framer Motion transities tussen stappen
- **Responsief**: Volledig mobiel-vriendelijk design
- **Toegankelijk**: ARIA labels, focus management, keyboard navigation
- **Progress Tracking**: Visuele voortgangsindicator

## 📁 Bestandsstructuur

```
src/components/onboarding/
├── OnboardingWizard.tsx      # Hoofdcomponent
├── index.ts                  # Export bestand
├── OnboardingDemo.tsx        # Demo pagina
├── README.md                 # Deze documentatie
└── steps/
    ├── ProfileStep.tsx       # Stap 1: Profiel
    ├── OrganizationStep.tsx  # Stap 2: Organisatie
    ├── SocialsStep.tsx       # Stap 3: Social Media
    └── PreferencesStep.tsx   # Stap 4: Voorkeuren
```

## 🛠️ Installatie

Zorg ervoor dat je de volgende dependencies hebt geïnstalleerd:

```bash
npm install react-hook-form @hookform/resolvers zod
```

## 📖 Gebruik

### Basis implementatie

```tsx
import { OnboardingWizard } from '@/components/onboarding'

function App() {
  return (
    <div>
      <OnboardingWizard />
    </div>
  )
}
```

### Met custom routing

```tsx
import { OnboardingWizard } from '@/components/onboarding'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  
  return (
    <OnboardingWizard />
  )
}
```

## 🔧 Configuratie

### Stappen aanpassen

Bewerk de `STEPS` array in `OnboardingWizard.tsx`:

```tsx
const STEPS = [
  { id: 'profile', title: 'Profiel', component: ProfileStep },
  { id: 'organization', title: 'Organisatie', component: OrganizationStep },
  // Voeg nieuwe stappen toe...
]
```

### Validatie schema wijzigen

Bewerk het Zod schema in `OnboardingWizard.tsx`:

```tsx
const onboardingSchema = z.object({
  profile: z.object({
    displayName: z.string().min(2, 'Custom error message'),
    // Voeg nieuwe velden toe...
  }),
  // Voeg nieuwe secties toe...
})
```

### Autosave interval wijzigen

Bewerk de debounce delay in `OnboardingWizard.tsx`:

```tsx
const debouncedSave = useCallback(
  debounce(async (data: OnboardingFormData) => {
    // Save logic...
  }, 1000), // Wijzig van 600 naar gewenste delay
  [toast]
)
```

## 🎨 Styling

De wizard gebruikt Tailwind CSS classes en is volledig aanpasbaar:

- **Achtergrond**: `bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`
- **Cards**: `max-w-xl mx-auto` voor centrering
- **Progress bar**: `h-2` voor dikte
- **Buttons**: Verschillende varianten (primary, outline, ghost)

## 🔄 State Management

### Form Data

```tsx
type OnboardingFormData = {
  profile: {
    displayName: string
    avatar?: string
    role?: "Creator" | "Client" | "Admin"
  }
  organization: {
    orgName: string
    website?: string
    useCase?: "Solo" | "Team" | "Agency"
  }
  socials: {
    X?: boolean
    Instagram?: boolean
    YouTube?: boolean
    LinkedIn?: boolean
  }
  preferences: {
    weeklyDigest: boolean
    aiSuggestions: boolean
    goals?: string
  }
}
```

### Local Storage

De wizard slaat automatisch op in localStorage onder de key `"onboardingDraft"`.

## 🎭 Animaties

CSS transitions worden gebruikt voor:

- **Stap transities**: Fade + slide effecten met CSS transforms
- **Progress updates**: Smooth progress bar updates
- **Loading states**: Spinner animaties
- **Focus management**: Automatische focus op eerste input bij stapwissel

## ♿ Toegankelijkheid

- Alle inputs hebben gekoppelde labels
- ARIA attributes voor screen readers
- Keyboard navigation support
- Focus management bij stapwissel
- Kleurcontrast voldoet aan WCAG richtlijnen

## 🧪 Testen

Gebruik de `OnboardingDemo.tsx` component om de wizard te testen:

```tsx
import { OnboardingDemo } from '@/components/onboarding'

function TestPage() {
  return <OnboardingDemo />
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Form validatie werkt niet**: Controleer of Zod schema correct is geïmporteerd
2. **Autosave werkt niet**: Controleer console voor errors in localStorage
3. **Animaties werken niet**: Controleer of CSS transitions worden ondersteund door de browser
4. **Routing werkt niet**: Controleer of react-router-dom is geconfigureerd
5. **Focus management werkt niet**: Controleer of de browser ondersteuning heeft voor focus() API

### Debug Mode

Voeg console.log toe aan de watch functie:

```tsx
useEffect(() => {
  const subscription = watch((data) => {
    console.log('Form data changed:', data) // Debug log
    debouncedSave(data as OnboardingFormData)
  })
  return () => subscription.unsubscribe()
}, [watch, debouncedSave])
```

## 🔮 Toekomstige Uitbreidingen

- [ ] API integratie voor echte data opslag
- [ ] Multi-language support
- [ ] Custom thema's
- [ ] A/B testing voor verschillende flows
- [ ] Analytics tracking
- [ ] Offline support met Service Worker

## 📝 Licentie

Deze component is onderdeel van Timeline Alchemy en is bedoeld voor intern gebruik.

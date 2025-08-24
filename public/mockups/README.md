# Mockup Images Directory

**UPDATE**: Dit systeem gebruikt nu Shopify afbeeldingen in plaats van lokale mockup bestanden.

## Hoe het werkt

Het systeem haalt nu automatisch alle beschikbare productafbeeldingen op uit Shopify (maximaal 20 per product) en toont deze correct in de shop sectie.

### Afbeeldingen weergave

1. **Hoofdafbeelding**: De eerste afbeelding wordt als hoofdafbeelding getoond
2. **Kleur varianten overlay**: Kleine cirkels onderaan tonen alle beschikbare kleuren/varianten
3. **Thumbnail grid**: In de product pagina wordt een grid van alle afbeeldingen getoond
4. **Variant matching**: Het systeem probeert automatisch de juiste afbeeldingen te vinden voor elke kleur/variant

### Voordelen van de nieuwe aanpak

- ✅ Alle 20 mockup afbeeldingen worden correct geladen uit Shopify
- ✅ Automatische kleur/variant matching
- ✅ Geen handmatige bestandsbeheer nodig
- ✅ Consistente afbeeldingen in alle shop secties
- ✅ Betere gebruikerservaring met alle beschikbare kleuren

### Technische details

- Shopify queries zijn bijgewerkt naar `images(first: 20)`
- Alle shop componenten tonen nu alle beschikbare afbeeldingen
- Fallback naar originele Shopify afbeeldingen als mockups niet bestaan
- Responsive grid layout voor thumbnails

## Oude informatie (niet meer relevant)

De oude naming convention was:
`[product-handle]-[variant-color]-[number].jpg`

Dit is vervangen door automatische Shopify integratie.
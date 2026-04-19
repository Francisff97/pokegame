# 🎮 PokéQuiz — Indovina il Pokémon!

Quiz a tema Pokédex: mostra indizi uno alla volta e fai indovinare agli altri quale Pokémon è!

## 🚀 Setup rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📦 Deploy su Vercel

```bash
npm install -g vercel
vercel
```

---

## 🖼️ Dove sostituire logo e icone

### Logo/Titolo homepage
Nel file `src/app/page.tsx`, cerca il commento:
```tsx
{/* 🔧 LOGO: sostituisci questo blocco con <Image src="/logo.png" ... /> */}
```
Sostituisci il blocco div con:
```tsx
import Image from 'next/image';
// ...
<Image src="/logo.png" alt="PokéQuiz" width={200} height={80} priority />
```

### Favicon e icone app
Metti questi file nella cartella `/public/`:

| File | Dove appare |
|------|------------|
| `favicon.ico` | Tab del browser |
| `apple-icon.png` | Icona iOS (add to homescreen) |
| `icon-192.png` | PWA / Android piccola |
| `icon-512.png` | PWA / Android grande |
| `og-image.png` | Anteprima social (1200×630px) |

Le referenze sono già nel file `src/app/layout.tsx`.

---

## 🎮 Come funziona

1. **Homepage**: scegli la difficoltà (Facile / Medio / Difficile)
2. **Pagina gioco**: appare un Pokémon oscurato
3. **Indizi**: tappa ogni card per rivelare un indizio alla volta (tu scegli quali dare)
4. **Rivela Pokémon**: quando vuoi, premi il bottone rosso per svelare tutto
5. **Prossimo**: pesca un nuovo Pokémon casuale

## 📊 Pool Pokémon per difficoltà

- **Facile**: ~60 Pokémon iconici Gen I–II (Pikachu, Charizard, Mewtwo, Eevee...)
- **Medio**: ~200 Pokémon Gen I–III meno ovvi + alcuni Gen IV
- **Difficile**: ~280 Pokémon Gen III oscuri + tutto Gen IV e Gen V

## 🛠️ Tecnologie

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PokéAPI** (gratuita, no chiave API)
- Font: Press Start 2P + DM Sans (Google Fonts)

## 📁 Struttura

```
src/
  app/
    page.tsx          ← Homepage
    layout.tsx        ← Root layout (metadata, icone)
    globals.css       ← Stili globali + Pokedex theme
    game/
      page.tsx        ← Pagina gioco
    api/
      pokemon/
        route.ts      ← API route (server → PokeAPI)
  lib/
    pokemon-data.ts   ← Pool Pokémon per difficoltà + colori tipi
```

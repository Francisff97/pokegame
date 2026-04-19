import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PokéQuiz — Indovina il Pokémon!',
  description: 'Un gioco di quiz Pokémon: dai indizi e fai indovinare!',
  // 🔧 ICONE: sostituisci i file nella cartella /public/
  //    favicon.ico        → icona browser
  //    icon-192.png       → icona PWA piccola
  //    icon-512.png       → icona PWA grande
  //    apple-icon.png     → icona iOS
  //    og-image.png       → immagine Open Graph (social share)
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

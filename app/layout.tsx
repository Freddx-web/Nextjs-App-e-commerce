import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ConditionalLayout } from '@/components/conditional-layout';
import { Toaster } from 'sonner';

// Configuración de la fuente Inter
const inter = Inter({ subsets: ['latin'] });
// Forzar contenido dinámico
export const dynamic = 'force-dynamic';
// Metadata para la página
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'ShopMusic - Tu Tienda Online',
  description: 'Tienda online moderna con los mejores productos',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ShopMusic - Tu Tienda Online',
    description: 'Tienda online moderna con los mejores productos',
    images: ['/og-image.png'],
  },
};
// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}

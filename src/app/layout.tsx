import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pong Kaboom',
  description: 'Pong game built with Kaboom.js',
  openGraph: {
    title: 'Pong Kaboom',
    description: 'Pong game built with Kaboom.js',
    type: 'website',
    locale: 'en_US',
    images: {
      url: 'https://res.cloudinary.com/dk7dt0kk3/image/upload/v1714301230/Pong_Kaboom_meta_cswa00.svg',
      width: 1200,
      height: 630,
      alt: 'Pong Kaboom',
    },
  },
  twitter: {
    title: 'Pong Kaboom',
    description: 'Pong game built with Kaboom.js',
    images: {
      url: 'https://res.cloudinary.com/dk7dt0kk3/image/upload/v1714301230/Pong_Kaboom_meta_cswa00.svg',
      width: 1200,
      height: 630,
      alt: 'Pong Kaboom',
    },
    card: 'summary_large_image',
    creator: '@lawlesx',
  },
  authors: { name: 'Aniruddha Sil', url: 'https://lawlesx.vercel.app/' },
  keywords: ['Kaboom.js', 'Pong'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script
        id='gtag-init'
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());

								gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', { page_path: window.location.pathname });`,
        }}
      />
      <body className={inter.className}>{children}</body>
    </html>
  )
}

import Kaboom from '@/components/kaboom'
import { Metadata } from 'next/types'

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

export default function Home() {
  return <Kaboom />
}

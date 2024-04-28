'use client'
import usePongKaboom from '@/components/kaboom'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Pong Kaboom',
  description: 'Pong game built with Kaboom.js',
}

export default function Home() {
  const { canvasRef } = usePongKaboom()

  return <canvas ref={canvasRef} />
}

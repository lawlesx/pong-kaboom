'use client'
import usePongKaboom from '@/components/kaboom'

export default function Home() {
  const { canvasRef } = usePongKaboom()

  return <canvas ref={canvasRef} />
}

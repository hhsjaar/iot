"use client"

import { Hero } from '@/components/ui/animated-hero'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="flex justify-center mt-12">
        <Link
          href="/irrigation"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Go to Irrigation Dashboard
        </Link>
      </div>
    </>
  )
}

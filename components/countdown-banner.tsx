"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import Image from "next/image"

export function CountdownBanner() {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31T23:59:59") - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),

        
      }
    }
    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearTimeout(timer)
  })

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => (
    <span key={interval} className="tabular-nums">
      {String(value).padStart(2, "0")}
      {interval !== "seconds" ? ":" : ""}
    </span>
  ))

  return (
<div className="bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb] dark:from-[#1e1e2f] dark:to-[#2a0944] text-white py-4 px-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
  <div className="flex items-center gap-2 font-semibold text-lg text-white">
    <Clock className="w-6 h-6" />
    <span>العرض ينتهي خلال:</span>
    <div className="bg-white/20 px-3 py-1 rounded-md animate-pulse">
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  </div>
  <Image
    src="/logo.png?height=40&width=120"
    alt="Tallin Logo"
    width={120}
    height={40}
    className="object-contain"
  />
</div>
  )
}
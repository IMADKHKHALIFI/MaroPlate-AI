"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

export function AnimatedBackground() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = []
      const colors = ["#ffffff", "#a855f7", "#3b82f6", "#10b981", "#f59e0b"]

      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      setStars(newStars)
    }

    generateStars()
    window.addEventListener("resize", generateStars)

    const animateStars = () => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          y: star.y + star.speed,
          x: star.x + Math.sin(star.y * 0.01) * 0.5,
          opacity: star.opacity + Math.sin(star.y * 0.01) * 0.1,
          ...(star.y > window.innerHeight && {
            y: -10,
            x: Math.random() * window.innerWidth,
          }),
        })),
      )
    }

    const interval = setInterval(animateStars, 50)

    return () => {
      window.removeEventListener("resize", generateStars)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            transition: "all 0.05s linear",
          }}
        />
      ))}
    </div>
  )
}

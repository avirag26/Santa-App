'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MusicPlayer from './MusicPlayer'

export default function GlobalEffects() {
    const [mounted, setMounted] = useState(false)

    // Generate random snowflakes
    const [snowflakes, setSnowflakes] = useState<{ id: number, left: string, duration: string, delay: string, opacity: number, size: string }[]>([])

    useEffect(() => {
        setMounted(true)
        const flakes = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            duration: `${Math.random() * 10 + 10}s`, // Much slower: 10-20s
            delay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.3 + 0.3, // Slightly more subtle
            size: Math.random() > 0.8 ? '20px' : '12px'
        }))
        setSnowflakes(flakes)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[99999]">
            <div className="stars"></div>

            {/* Snowfall - Overlaying all content */}
            <div className="snow-container">
                {snowflakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="snowflake"
                        style={{
                            left: flake.left,
                            animationDuration: flake.duration,
                            animationDelay: flake.delay,
                            opacity: flake.opacity,
                            width: flake.size || '20px',
                            height: flake.size || '20px',
                            position: 'absolute',
                            top: '-30px',
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                            <path d="M12 2V22M2 12H22M4.929 4.929L19.071 19.071M19.071 4.929L4.929 19.071" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                ))}
            </div>

            {/* UI Overlays like Music Player - Interactive */}
            <div className="fixed bottom-4 left-4 pointer-events-auto">
                <MusicPlayer />
            </div>
        </div>
    )
}

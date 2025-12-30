'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, GlobeAltIcon, GiftIcon, HomeIcon } from '@heroicons/react/24/outline'

const CHANNELS = [
    {
        id: 'stable',
        name: 'STABLE CAM',
        location: 'Reindeer Stables',
        status: 'LIVE',
        feed: '🦌💤🦌🍎🦌',
        activity: 'Rudolph is having a snack. The others are resting for the big flight.'
    },
    {
        id: 'kitchen',
        name: 'KITCHEN CAM',
        location: 'Cookie Kitchen',
        status: 'BUSY',
        feed: '🧝🍪🧝🥛🧝',
        activity: 'Mrs. Claus is supervising a batch of 500 gingerbread men. High aroma density.'
    },
    {
        id: 'toyline',
        name: 'TOY FACTORY',
        location: 'Section A-12',
        status: 'MAX',
        feed: '🚂🎨🧸📦🎮',
        activity: 'The wrapping machine is working at 120% speed. Ribbon levels are low.'
    },
    {
        id: 'mail',
        name: 'MAIL ROOM',
        location: 'Sorting Hub',
        status: 'ALERT',
        feed: '📜📬📜📭📜',
        activity: 'A sudden burst of letters from Australia! Elves are sorting by behavior score.'
    }
]

export default function WorkshopCCTV() {
    const [currentIdx, setCurrentIdx] = useState(0)
    const [isSignalLost, setIsSignalLost] = useState(false)
    const channel = CHANNELS[currentIdx]

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setIsSignalLost(true)
                setTimeout(() => setIsSignalLost(false), 800)
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    const nextChannel = () => {
        setIsSignalLost(true)
        setTimeout(() => {
            setCurrentIdx((prev) => (prev + 1) % CHANNELS.length)
            setIsSignalLost(false)
        }, 400)
    }

    return (
        <div className="christmas-card bg-slate-900 border-4 border-slate-800 text-white overflow-hidden shadow-2xl p-0 min-h-[400px]">
            <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                    <h3 className="text-sm font-black tracking-widest uppercase flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-yellow-400" /> NORTH POLE SECURITY FEED
                    </h3>
                </div>
                <div className="text-[10px] font-mono opacity-50">CAM_ID: NP-00{currentIdx + 1}</div>
            </div>

            <div className="relative aspect-video bg-black overflow-hidden group">
                <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />

                <AnimatePresence mode="wait">
                    {isSignalLost ? (
                        <motion.div
                            key="static"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#333] flex items-center justify-center"
                            style={{ backgroundImage: 'radial-gradient(#555 10%, transparent 10%)', backgroundSize: '4px 4px' }}
                        >
                            <div className="text-xl font-mono text-white/50 animate-pulse uppercase">Searching Signal...</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={channel.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center bg-gradient-to-t from-slate-900/50 to-transparent"
                        >
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <span className="bg-red-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm">REC</span>
                                <span className="text-[10px] font-mono opacity-70">CH 0{currentIdx + 1}</span>
                            </div>

                            <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono text-christmas-green font-bold">
                                <GiftIcon className="w-3 h-3" /> FEED: ACTIVE
                            </div>

                            <motion.div
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="text-6xl sm:text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            >
                                {channel.feed}
                            </motion.div>

                            <div className="max-w-md">
                                <h4 className="text-lg font-black text-yellow-400 mb-2 uppercase italic tracking-tighter">{channel.location}</h4>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed italic px-4">
                                    "{channel.activity}"
                                </p>
                            </div>

                            <div className="absolute bottom-4 left-4 text-[10px] font-mono opacity-50">
                                {new Date().toLocaleTimeString()} :: {channel.status}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute bottom-4 right-4 z-20">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextChannel}
                        className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded-full border border-white/10 backdrop-blur-md shadow-xl flex items-center gap-2"
                    >
                        <GlobeAltIcon className="w-5 h-5 text-christmas-gold" />
                        <span className="text-xs font-black uppercase tracking-widest hidden group-hover:block px-1">Switch Feed</span>
                    </motion.button>
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-around text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                {CHANNELS.map((ch, i) => (
                    <div key={ch.id} className={`transition-colors flex items-center gap-1 ${i === currentIdx ? 'text-christmas-gold' : ''}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${i === currentIdx ? 'bg-christmas-gold animate-pulse' : 'bg-slate-700'}`} />
                        CAM_{i + 1}
                    </div>
                ))}
            </div>
        </div>
    )
}

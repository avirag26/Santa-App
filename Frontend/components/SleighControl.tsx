'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, GiftIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const CHECKLIST_ITEMS = [
    { id: 1, label: "Check Rudolph's Nose Brightness", done: true },
    { id: 2, label: "Secure Gift Bag Straps", done: false },
    { id: 3, label: "Polish Sleigh Bells", done: true },
    { id: 4, label: "Calculate North Wind speed", done: false },
    { id: 5, label: "Load Magic Star Dust", done: true },
]

export default function SleighControl() {
    const [checklist, setChecklist] = useState(CHECKLIST_ITEMS)
    const [magicFuel, setMagicFuel] = useState(75)
    const [isLaunching, setIsLaunching] = useState(false)
    const [launchStatus, setLaunchStatus] = useState('')

    const toggleItem = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ))
    }

    const allDone = checklist.every(item => item.done)

    const handleLaunch = () => {
        if (!allDone) {
            setLaunchStatus('Complete your checklist first, Santa! 🎅')
            setTimeout(() => setLaunchStatus(''), 3000)
            return
        }

        setIsLaunching(true)
        const steps = [
            "Initializing Magic Engines...",
            "Waking up the Reindeer...",
            "Activating Sleigh Bells...",
            "Star Dust Ignition...",
            "HO HO HO! READY FOR TAKEOFF!",
        ]

        steps.forEach((step, i) => {
            setTimeout(() => {
                setLaunchStatus(step)
                if (i === steps.length - 1) {
                    setTimeout(() => {
                        setIsLaunching(false)
                        setLaunchStatus('')
                    }, 3000)
                }
            }, i * 1200)
        })
    }

    return (
        <div className="christmas-card bg-slate-900 border-2 border-christmas-gold/50 text-white shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic tracking-widest text-christmas-gold uppercase">SLEIGH-TECH HUD</h3>
                        <p className="text-[10px] text-slate-400 font-mono">MODEL: Kringle-X / OS: HO-HO-HO v2.4</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-slate-500 font-black uppercase mb-1">Status</div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isLaunching ? 'bg-green-500/20 border-green-500 text-green-400 animate-pulse' : 'bg-yellow-500/20 border-yellow-500 text-yellow-400'}`}>
                        {isLaunching ? 'Launching' : 'Pre-flight'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Visual Gauges */}
                <div className="space-y-6">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <SparklesIcon className="w-3 h-3 text-yellow-400" /> Star Dust Fuel
                            </span>
                            <span className="text-xs font-mono text-yellow-500">{magicFuel}%</span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <motion.div
                                animate={{ width: `${magicFuel}%` }}
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-200 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <GiftIcon className="w-3 h-3 text-red-500" /> Gift Payload
                            </span>
                            <span className="text-xs font-mono text-red-400">920.5 Tons</span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "85%" }}
                                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <StarIcon className="w-3 h-3 text-green-500" /> Reindeer Energy
                            </span>
                            <span className="text-xs font-mono text-green-400">MAXIMUN</span>
                        </div>
                        <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Pre-flight Checklist */}
                <div className="bg-slate-800/30 p-6 rounded-3xl border border-white/5">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-christmas-gold" /> Pre-flight Prep
                    </h4>
                    <div className="space-y-3">
                        {checklist.map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className="flex items-center justify-between group cursor-pointer"
                            >
                                <span className={`text-xs font-medium transition-colors ${item.done ? 'text-slate-500 line-through' : 'text-slate-300 group-hover:text-white'}`}>
                                    {item.label}
                                </span>
                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${item.done ? 'bg-green-500 border-green-500 text-white' : 'border-slate-700 bg-slate-900'}`}>
                                    {item.done && <CheckCircleIcon className="w-4 h-4" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative">
                <AnimatePresence>
                    {launchStatus && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/10 text-center"
                        >
                            <p className="text-lg font-black italic text-christmas-gold tracking-widest">{launchStatus}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.02, shadow: "0 0 20px rgba(220, 38, 38, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLaunch}
                    disabled={isLaunching}
                    className={`w-full py-4 rounded-2xl font-black italic tracking-[0.4em] uppercase transition-all shadow-xl ${allDone ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
                >
                    {isLaunching ? 'Ignition Sequence...' : 'Initialize Launch'}
                </motion.button>
            </div>

            <div className="mt-6 flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                <span>Latitude: 90.0000° N</span>
                <span className="animate-pulse text-red-900">Magical Beacon Active</span>
                <span>Longitude: 135.0000° W</span>
            </div>
        </div>
    )
}

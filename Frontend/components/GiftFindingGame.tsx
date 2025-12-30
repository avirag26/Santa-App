'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, GiftIcon, StarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Box {
    id: number
    isOpen: boolean
    hasGift: boolean
    gift: string | null
    color: string
}

export default function GiftFindingGame() {
    const [boxes, setBoxes] = useState<Box[]>([])
    const [foundCount, setFoundCount] = useState(0)
    const [totalGifts, setTotalGifts] = useState(0)
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing')
    const [showCongrats, setShowCongrats] = useState(false)
    const [showEmptyMsg, setShowEmptyMsg] = useState(false)
    const [foundGiftType, setFoundGiftType] = useState<string | null>(null)
    const boxCount = 6

    const giftEmojis = ['🧸', '🍭', '🎨', '🚂', '🚲', '🎮', '🧩', '🎸', '⚽']
    const boxColors = [
        'bg-red-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500'
    ]

    const initGame = () => {
        const giftCount = Math.floor(Math.random() * 2) + 2 // 2 or 3
        setTotalGifts(giftCount)

        const giftIndices = new Set<number>()
        while (giftIndices.size < giftCount) {
            const idx = Math.floor(Math.random() * boxCount)
            giftIndices.add(idx)
        }

        const shuffledGifts = [...giftEmojis].sort(() => 0.5 - Math.random())

        const newBoxes = Array.from({ length: boxCount }).map((_, i) => ({
            id: i,
            isOpen: false,
            hasGift: giftIndices.has(i),
            gift: giftIndices.has(i) ? shuffledGifts[i] : null,
            color: boxColors[i % boxColors.length]
        }))
        setBoxes(newBoxes)
        setFoundCount(0)
        setGameState('playing')
        setShowCongrats(false)
        setShowEmptyMsg(false)
    }

    useEffect(() => {
        initGame()
    }, [])

    const handleBoxClick = (id: number) => {
        setBoxes(prev => prev.map(box => {
            if (box.id === id && !box.isOpen) {
                if (box.hasGift) {
                    setFoundCount(f => f + 1)
                    setFoundGiftType(box.gift)
                    setShowCongrats(true)
                    setShowEmptyMsg(false)
                    setTimeout(() => setShowCongrats(false), 2500)
                } else {
                    setShowEmptyMsg(true)
                    setShowCongrats(false)
                    setTimeout(() => setShowEmptyMsg(false), 1500)
                }
                return { ...box, isOpen: true }
            }
            return box
        }))
    }

    useEffect(() => {
        if (foundCount === totalGifts && totalGifts > 0) {
            setTimeout(() => setGameState('won'), 3000)
        }
    }, [foundCount, totalGifts])

    return (
        <div className="christmas-card bg-white/95 border-2 border-christmas-gold/40 p-6 relative overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100/50 rounded-full -ml-16 -mb-16 blur-3xl" />

            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 z-10 gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-black text-christmas-red flex items-center justify-center sm:justify-start italic">
                        <GiftIcon className="w-8 h-8 mr-2 text-christmas-gold animate-bounce" />
                        SANTA'S MYSTERY BOXES
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Find all {totalGifts} hidden gifts to win! ✨</p>
                </div>
                <div className="bg-gradient-to-r from-christmas-green to-green-600 px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all">
                    <span className="text-white font-black text-lg">
                        Gifts Found: {foundCount} / {totalGifts}
                    </span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 p-4 z-10">
                {boxes.map((box) => (
                    <div key={box.id} className="perspective-1000">
                        <motion.div
                            whileHover={box.isOpen ? {} : { scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
                            whileTap={box.isOpen ? {} : { scale: 0.9 }}
                            onClick={() => handleBoxClick(box.id)}
                            className={`relative w-full aspect-square rounded-2xl cursor-pointer shadow-xl preserve-3d transition-all duration-700 ${box.isOpen ? 'rotate-y-180' : ''}`}
                        >
                            <div className={`absolute inset-0 rounded-2xl ${box.color} flex items-center justify-center backface-hidden border-4 border-white/30 overflow-hidden`}>
                                <div className="absolute w-full h-8 bg-white/20 rotate-45" />
                                <div className="absolute w-full h-8 bg-white/20 -rotate-45" />
                                <div className="text-5xl drop-shadow-lg">🎁</div>
                            </div>

                            <div className="absolute inset-0 rounded-2xl bg-white flex flex-col items-center justify-center rotate-y-180 backface-hidden border-4 border-christmas-gold/30 shadow-inner overflow-visible">
                                {box.isOpen && box.hasGift ? (
                                    <motion.div
                                        initial={{ y: 50, scale: 0.5, opacity: 0, rotate: -20 }}
                                        animate={{
                                            y: -80, // JUMP UP!
                                            scale: 1.8, // 3D effect
                                            opacity: 1,
                                            rotate: 360,
                                            transition: {
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: 0.2
                                            }
                                        }}
                                        className="text-7xl mb-2 z-50 pointer-events-none drop-shadow-2xl"
                                    >
                                        {box.gift}
                                        <motion.div
                                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="absolute -top-6 -right-6 text-3xl"
                                        >
                                            ✨
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={box.isOpen ? { opacity: 0.5 } : {}}
                                        className="text-4xl text-gray-300 font-bold"
                                    >
                                        💨
                                        <p className="text-xs uppercase mt-2">Empty!</p>
                                    </motion.div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent rounded-2xl -z-10" />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Discovery Celebration Overlay */}
            <AnimatePresence>
                {showCongrats && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute inset-0 z-[110] flex flex-col items-center justify-center pointer-events-none px-4"
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: '50%', y: '50%', opacity: 1, scale: 0 }}
                                    animate={{
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        opacity: 0,
                                        scale: Math.random() * 1.5 + 0.5,
                                        rotate: Math.random() * 360
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute text-4xl"
                                >
                                    {['🎉', '🎊', '✨', '🎁'][i % 4]}
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/95 backdrop-blur-md px-10 py-6 rounded-[2.5rem] border-4 border-christmas-gold shadow-2xl text-center max-w-sm"
                        >
                            <h4 className="text-3xl font-black text-christmas-red italic tracking-widest mb-2 animate-pulse">
                                CONGRATS! 🎁
                            </h4>
                            <p className="text-gray-700 font-extrabold text-xl leading-tight">
                                SANTA WILL GIVE YOU A <span className="text-christmas-green uppercase">{foundGiftType}</span>!
                            </p>
                            <div className="text-6xl mt-4 animate-bounce drop-shadow-lg">{foundGiftType}</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty Box Feedback Overlay */}
            <AnimatePresence>
                {showEmptyMsg && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="absolute inset-0 z-[110] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-red-50/90 backdrop-blur-sm px-8 py-4 rounded-3xl border-2 border-red-200 shadow-xl text-center">
                            <h4 className="text-2xl font-bold text-red-600 mb-1 flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                                OOPS! 💨
                            </h4>
                            <p className="text-gray-600 font-semibold">THIS BOX IS EMPTY. KEEP LOOKING! ✨</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Win Game Overlay */}
            <AnimatePresence>
                {gameState === 'won' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[120] bg-christmas-red/20 backdrop-blur-xl flex items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-12 rounded-[3.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-8 border-christmas-gold relative"
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-8xl animate-bounce">🎅</div>
                            <h3 className="text-5xl font-black text-christmas-red mb-4 italic tracking-tight">MAGICAL!</h3>
                            <p className="text-gray-600 text-2xl mb-10 font-bold leading-tight">
                                You found all {totalGifts} hidden gifts!<br />
                                <span className="text-christmas-green text-sm uppercase tracking-widest">A True North Pole Detective!</span>
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={initGame}
                                className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white text-3xl font-black px-16 py-5 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all border-b-8 border-red-900"
                            >
                                PLAY AGAIN! 🔄
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    )
}

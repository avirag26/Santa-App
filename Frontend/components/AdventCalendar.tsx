'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarIcon, GiftIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline'

const ADVENT_ITEMS = [
    { day: 1, type: 'joke', content: "What do you call an elf who sings? A wrapper!", emoji: "🎶" },
    { day: 2, type: 'fact', content: "Did you know? Santa's sleigh is faster than a rocket!", emoji: "🚀" },
    { day: 3, type: 'emoji', content: "You found a Magic Cookie!", emoji: "🍪" },
    { day: 4, type: 'joke', content: "What do snowmen eat for breakfast? Snowflakes!", emoji: "🥣" },
    { day: 5, type: 'fact', content: "Reindeer love to eat magical carrots for energy!", emoji: "🥕" },
    { day: 6, type: 'emoji', content: "A new ornament for your tree!", emoji: "🎄" },
    { day: 7, type: 'joke', content: "How do you know when Santa's in the room? You can sense his presents!", emoji: "🎁" },
    { day: 8, type: 'fact', content: "The North Pole is located in the middle of the Arctic Ocean!", emoji: "🌊" },
    { day: 9, type: 'emoji', content: "A warm cup of hot cocoa!", emoji: "☕" },
    { day: 10, type: 'joke', content: "What is Santa's favorite candy? Jolly Ranchers!", emoji: "🍬" },
    { day: 11, type: 'fact', content: "Elves can wrap over 100 gifts in just one hour!", emoji: "📦" },
    { day: 12, type: 'emoji', content: "A shiny gold star!", emoji: "⭐" },
    { day: 13, type: 'joke', content: "What falls but never gets hurt? Snow!", emoji: "❄️" },
    { day: 14, type: 'fact', content: "Mrs. Claus makes the best gingerbread in the world!", emoji: "🍪" },
    { day: 15, type: 'emoji', content: "A magical snowflake!", emoji: "❄️" },
    { day: 16, type: 'joke', content: "What type of motorbike does Santa ride? A Holly Davidson!", emoji: "🏍️" },
    { day: 17, type: 'fact', content: "There are over 1000 busy elves working at the workshop!", emoji: "🧝" },
    { day: 18, type: 'emoji', content: "A tiny toy train!", emoji: "🚂" },
    { day: 19, type: 'joke', content: "What kind of bird can write? A pen-guin!", emoji: "🐧" },
    { day: 20, type: 'fact', content: "Santa's list is checked three times, just to be sure!", emoji: "📜" },
    { day: 21, type: 'emoji', content: "A festive candy cane!", emoji: "🍭" },
    { day: 22, type: 'joke', content: "What says 'Oh Oh Oh'? Santa walking backwards!", emoji: "🎅" },
    { day: 23, type: 'fact', content: "The Northern Lights are actually magic dust from the sleigh!", emoji: "🌌" },
    { day: 24, type: 'gift', content: "CHRISTMAS EVE! Get ready for the big flight!", emoji: "🛷" },
]

export default function AdventCalendar() {
    const [openedDays, setOpenedDays] = useState<number[]>([])
    const [selectedDay, setSelectedDay] = useState<number | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('advent_opened')
        if (saved) setOpenedDays(JSON.parse(saved))
    }, [])

    const handleOpen = (day: number) => {
        if (!openedDays.includes(day)) {
            const newOpened = [...openedDays, day]
            setOpenedDays(newOpened)
            localStorage.setItem('advent_opened', JSON.stringify(newOpened))
        }
        setSelectedDay(day)
    }

    return (
        <div className="christmas-card bg-white/95 border-2 border-christmas-red/20 p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-christmas-red italic flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-christmas-gold" /> MAGICAL ADVENT CALENDAR
                    </h2>
                    <p className="text-gray-500 font-medium">Unlock a new surprise every day until Christmas! ❄️</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    <span className="text-christmas-green font-bold flex items-center gap-2">
                        <StarIcon className="w-5 h-5" /> {openedDays.length} / 24 Unlocked
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {ADVENT_ITEMS.map((item) => (
                    <motion.div
                        key={item.day}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpen(item.day)}
                        className={`
                            relative aspect-square rounded-2xl cursor-pointer flex items-center justify-center text-xl font-black
                            transition-all duration-300 border-2
                            ${openedDays.includes(item.day)
                                ? 'bg-white border-christmas-green/40 shadow-inner text-christmas-green'
                                : 'bg-gradient-to-br from-christmas-red to-red-700 border-white/20 text-white shadow-lg'}
                        `}
                    >
                        {openedDays.includes(item.day) ? (
                            <span className="text-3xl">{item.emoji}</span>
                        ) : (
                            <span>{item.day}</span>
                        )}

                        {!openedDays.includes(item.day) && (
                            <div className="absolute top-1 right-1 opacity-20">
                                <SparklesIcon className="w-4 h-4" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 p-6 bg-gradient-to-r from-christmas-red/5 to-christmas-green/5 rounded-3xl border-2 border-dashed border-christmas-gold/30 text-center relative"
                    >
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
                        >
                            ✕
                        </button>

                        <div className="text-5xl mb-4 animate-bounce">
                            {ADVENT_ITEMS[selectedDay - 1].emoji}
                        </div>
                        <h4 className="text-xl font-black text-christmas-red uppercase tracking-widest mb-2">
                            Day {selectedDay} Surprise!
                        </h4>
                        <p className="text-slate-700 font-medium text-lg italic max-w-xl mx-auto">
                            "{ADVENT_ITEMS[selectedDay - 1].content}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!selectedDay && (
                <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-center text-gray-400 text-sm font-medium italic">
                    Click a number to reveal your Christmas treat! 🍪✨
                </div>
            )}
        </div>
    )
}

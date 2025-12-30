'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function KidsLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child-auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('childToken', data.token)
                localStorage.setItem('child', JSON.stringify(data.child))
                toast.success(`Welcome back, ${data.child.name}! \ud83c\udf84`)
                router.push('/kids-portal')
            } else {
                toast.error(data.message || 'Login failed. Check your email and password!')
            }
        } catch (error) {
            toast.error('Connection error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen christmas-bg flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="christmas-card max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-6xl mb-4"
                    >
                        \ud83e\udud2
                    </motion.div>
                    <h1 className="text-3xl font-bold text-christmas-red text-christmas">
                        Kids Portal Login
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Enter your magical credentials to see your status!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Registered Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                            placeholder="e.g. emma@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Magical Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent pr-12"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-christmas flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Enter Portal</span>
                                <HeartIcon className="h-5 w-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-700 text-center">
                        New here? <Link href="/child-register" className="font-bold underline">Register to join the Nice List!</Link>
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-slate-500 hover:text-christmas-red font-medium text-sm transition-colors"
                    >
                        \u2190 Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

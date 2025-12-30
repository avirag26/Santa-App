'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HeartIcon,
  GiftIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import NaughtyNiceScanner from '../../components/NaughtyNiceScanner'
import ElfNameGenerator from '../../components/ElfNameGenerator'
import LetterToSanta from '../../components/LetterToSanta'
import GiftFindingGame from '../../components/GiftFindingGame'
import ReindeerStable from '../../components/ReindeerStable'
import AdventCalendar from '../../components/AdventCalendar'

export default function KidsPortal() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'messages' | 'wishlist' | 'gifts' | 'funzone'>('funzone')
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [wishlist, setWishlist] = useState(['', '', ''])

  const [gifts, setGifts] = useState<any[]>([])
  const [childData, setChildData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock child data
  const fallbackChild = {
    name: 'Emma Johnson',
    age: 7,
    behaviorScore: 95,
    avatar: '👧'
  }

  const loadMessages = async (childId: string) => {
    if (!childId || !process.env.NEXT_PUBLIC_API_URL) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/conversation/child/${childId}/santa/507f1f77bcf86cd799439011`
      )

      if (response.ok) {
        const data = await response.json()
        setMessages(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      setMessages([])
    }
  }

  const loadGifts = async (childId: string) => {
    if (!childId || !process.env.NEXT_PUBLIC_API_URL) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gifts?childId=${childId}`
      )

      if (response.ok) {
        const data = await response.json()
        setGifts(data.gifts || [])
      }
    } catch (error) {
      setGifts([])
    }
  }

  const loadWishlist = async (childId: string) => {
    if (!childId || !process.env.NEXT_PUBLIC_API_URL) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/children/${childId}`
      )

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data.wishlist)) {
          const items = data.wishlist.map((w: any) => typeof w === 'string' ? w : w.item || '').slice(0, 10)
          while (items.length < 3) items.push('')
          setWishlist(items)
        }
      }
    } catch (error) {
      setWishlist(['', '', ''])
    }
  }

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('child') : null
        if (!stored) {
          toast.error('Please login to see your magic status!')
          router.push('/kids-login')
          return
        }
        const parsed = JSON.parse(stored)
        setChildData(parsed)
        setIsLoading(false)

        const id = parsed.id || parsed._id
        if (id) {
          loadMessages(id)
          loadGifts(id)
          loadWishlist(id)
        }
      } catch (e) {
        toast.error('Please login to see your magic status!')
        router.push('/kids-login')
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('child')
    localStorage.removeItem('childToken')
    toast.success('Logged out successfully! See you soon! 👋')
    router.push('/')
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const baseMessage = {
      id: Date.now().toString(),
      from: 'child',
      content: newMessage,
      timestamp: new Date().toISOString()
    }

    if (!childData || !process.env.NEXT_PUBLIC_API_URL) {
      setMessages(prev => [...prev, baseMessage])
      setNewMessage('')
      toast.success('Message sent to Santa! 🎅')
      return
    }

    const childId = childData.id || childData._id;
    const payload = {
      sender: 'child',
      senderId: childId,
      recipient: 'santa',
      recipientId: '507f1f77bcf86cd799439011',
      content: newMessage,
      messageType: 'letter'
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('childToken') : null

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        const saved = data?.data || payload
        setMessages(prev => [
          ...prev,
          {
            id: saved._id || baseMessage.id,
            from: 'child',
            content: saved.content,
            timestamp: saved.createdAt || baseMessage.timestamp
          }
        ])
        toast.success('Message sent to Santa! 🎅')
        setNewMessage('')

        // Trigger auto-reply for demo
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/santa-reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ childId: childId, originalMessageId: saved._id })
        }).then(() => loadMessages(childId))
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Message failed:', errorData)
        setMessages(prev => [...prev, baseMessage])
        setNewMessage('')
        toast.success('Message sent locally! Santa will see it soon 🎅')
      }
    } catch (error) {
      setMessages(prev => [...prev, baseMessage])
      setNewMessage('')
      toast.success('Message sent to Santa! 🎅')
    }
  }

  const updateWishlist = (index, value) => {
    const newWishlist = [...wishlist]
    newWishlist[index] = value
    setWishlist(newWishlist)
  }

  const saveWishlist = async () => {
    const activeChild = childData
    if (!activeChild || !process.env.NEXT_PUBLIC_API_URL) {
      toast.success('Wishlist saved locally! 🎁')
      return
    }

    const items = wishlist
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => ({ item, priority: 'medium', category: 'toys' }))

    if (!items.length) {
      toast.error('Add at least one wish before saving!')
      return
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('childToken') : null

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child-auth/wishlist`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ wishlist: items }),
      })

      if (response.ok) {
        toast.success('Wishlist synced with Santa! 🎁')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Sync failed:', errorData)
        toast.error(`Sync failed: ${errorData.message || 'Server error'}. Saved locally!`)
      }
    } catch (error) {
      toast.error('Connection error. Saved locally!')
    }
  }

  const getBehaviorBadge = (score) => {
    if (score >= 80) return { text: 'Very Nice', class: 'bg-green-100 text-green-800', icon: '🎁' }
    if (score >= 60) return { text: 'Nice', class: 'bg-blue-100 text-blue-800', icon: '😊' }
    return { text: 'Okay', class: 'bg-yellow-100 text-yellow-800', icon: '😐' }
  }

  const behavior = getBehaviorBadge((childData || fallbackChild).behaviorScore)

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen christmas-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎅</div>
          <p className="text-xl text-gray-700 font-bold">Checking your Nice List status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen christmas-bg overflow-y-auto">
      {/* Simple Header */}
      <div className="bg-white/10 backdrop-blur-sm p-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-slate-700 hover:text-christmas-red font-bold text-sm transition-colors">
            ← Back to Home
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-bold text-sm">{(childData || fallbackChild).name}</span>
            <span className="text-lg">{(childData || fallbackChild).avatar}</span>
            <button
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-full text-xs font-bold transition-colors border border-red-200"
            >
              Logout 👋
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-3 h-full">
        {/* Welcome Card */}
        <div className="christmas-card mb-3 text-center py-3">
          <h1 className="text-xl font-bold text-christmas-red mb-2">
            🎄 Welcome, {(childData || fallbackChild).name}! 🎄
          </h1>
          <div className="flex justify-center items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${behavior.class}`}>
              {behavior.icon} {behavior.text}
            </span>
            <div className="text-center">
              <div className="text-lg font-bold text-christmas-red">{(childData || fallbackChild).behaviorScore}/100</div>
              <div className="text-xs text-gray-500">Behavior Score</div>
            </div>
          </div>
        </div>

        {/* Simple Tabs */}
        <div className="christmas-card mb-3 py-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${activeTab === 'messages'
                ? 'bg-christmas-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              📬 Messages with Santa
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${activeTab === 'wishlist'
                ? 'bg-christmas-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              🎁 My Wishlist
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${activeTab === 'gifts'
                ? 'bg-christmas-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              🎁 Gifts from Santa
            </button>
            <button
              onClick={() => setActiveTab('funzone')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${activeTab === 'funzone'
                ? 'bg-christmas-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              🎮 Fun Zone
            </button>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="christmas-card py-3">
            <h2 className="text-lg font-bold mb-3">💬 Chat with Santa</h2>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-blue-800">
                ℹ️ <strong>How it works:</strong> Send your message to Santa below.
                Santa reads all messages personally and will reply when he has time!
              </p>
            </div>

            {/* Messages */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">💬 No messages yet. Send your first letter to Santa!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex mb-2 ${message.from === 'child' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-3 py-2 text-xs shadow-sm ${message.from === 'child'
                        ? 'bg-christmas-red text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-semibold truncate">
                          {message.from === 'child'
                            ? `👧 ${(childData || fallbackChild).name}`
                            : '🎅 Santa'}
                          {message.magicSeal && <span className="ml-1">✨</span>}
                        </span>
                        {message.timestamp && (
                          <span
                            className={`text-[10px] ${message.from === 'child' ? 'text-white/70' : 'text-gray-400'
                              }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="leading-snug whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Send Message */}
            <div className="space-y-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your letter to Santa here..."
                className="w-full p-2 border rounded-lg resize-none text-sm"
                rows={2}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="btn-christmas disabled:opacity-50 text-sm py-2 px-4"
              >
                📤 Send to Santa
              </button>
            </div>
          </div>
        )}

        {/* Gifts Tab */}
        {activeTab === 'gifts' && (
          <div className="christmas-card py-3">
            <h2 className="text-lg font-bold mb-3">🎁 Gifts from Santa</h2>
            {gifts.length === 0 ? (
              <div className="text-center text-gray-600 py-6">
                <p className="text-sm">Santa and the elves are still working on your presents. Check back soon! ✨</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gifts.map((gift) => (
                  <div key={gift._id} className="bg-white/80 border border-gray-200 rounded-lg p-3 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-christmas-red text-white flex items-center justify-center text-xl">
                      🎁
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-gray-900">{gift.name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 capitalize">
                          {gift.status || 'magic in progress'}
                        </span>
                      </div>
                      {gift.description && (
                        <p className="text-xs text-gray-600 mb-1">{gift.description}</p>
                      )}
                      {gift.category && (
                        <p className="text-[11px] text-gray-500 capitalize">Category: {gift.category}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="christmas-card py-3">
            <h2 className="text-lg font-bold mb-3">🎁 My Christmas Wishlist</h2>

            <div className="space-y-2 mb-4">
              {wishlist.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-christmas-red text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateWishlist(index, e.target.value)}
                    placeholder={`Christmas wish #${index + 1}`}
                    className="flex-1 p-2 border rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setWishlist([...wishlist, ''])}
                disabled={wishlist.length >= 10}
                className="btn-christmas-green text-sm py-2 px-3 disabled:opacity-50"
              >
                ➕ Add Wish
              </button>
              <button
                onClick={saveWishlist}
                className="btn-christmas text-sm py-2 px-3"
              >
                💾 Save Wishlist
              </button>
            </div>

            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                💡 <strong>Tip:</strong> Be specific about what you want!
                The more details you give Santa, the better he can help his elves make it perfect.
              </p>
            </div>
          </div>
        )}

        {/* Fun Zone Tab */}
        {activeTab === 'funzone' && (
          <div className="space-y-6">
            <div className="christmas-card py-4">
              <h2 className="text-2xl font-bold mb-4 text-center text-christmas text-christmas-red">
                🎮 North Pole Fun Zone 🎮
              </h2>
              <p className="text-center text-gray-600 mb-6 text-sm">
                Try out these magical activities while you wait for Christmas!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <NaughtyNiceScanner />
              <ElfNameGenerator />
              <LetterToSanta />
            </div>

            <GiftFindingGame />
            <AdventCalendar />
            <ReindeerStable />
          </div>
        )}
      </div>
    </div>
  )
}
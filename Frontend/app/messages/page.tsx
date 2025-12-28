'use client'

import { useState, useEffect, useRef } from 'react'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import {
  PaperAirplaneIcon,
  FaceSmileIcon,
  HeartIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Message {
  _id: string
  sender: string
  senderId: string
  recipient: string
  recipientId: string
  content: string
  messageType: string
  createdAt: string
  magicSeal?: boolean
  senderName?: string
}

interface Child {
  _id: string
  name: string
  age: number
  city: string
  country: string
  behaviorScore: number
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load children list on mount
  useEffect(() => {
    fetchChildren()
  }, [])

  // Load messages whenever the selected child changes
  useEffect(() => {
    fetchMessages()
  }, [selectedChild])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setChildren(data.children || mockChildren)
        if (data.children?.length > 0) {
          setSelectedChild(data.children[0])
        } else if (mockChildren.length > 0) {
          setSelectedChild(mockChildren[0])
        }
      } else {
        setChildren(mockChildren)
        setSelectedChild(mockChildren[0])
      }
    } catch (error) {
      console.error('Error fetching children:', error)
      setChildren(mockChildren)
      setSelectedChild(mockChildren[0])
    }
  }

  const fetchMessages = async () => {
    if (!selectedChild) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/conversation/santa/507f1f77bcf86cd799439011/child/${selectedChild._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setMessages(data || mockMessages)
      } else {
        setMessages(mockMessages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages(mockMessages)
    } finally {
      setLoading(false)
    }
  }

  const mockChildren: Child[] = [
    { _id: '1', name: 'Emma Johnson', age: 7, city: 'New York', country: 'USA', behaviorScore: 95 },
    { _id: '2', name: 'Lucas Silva', age: 10, city: 'São Paulo', country: 'Brazil', behaviorScore: 78 },
    { _id: '3', name: 'Aisha Patel', age: 6, city: 'Mumbai', country: 'India', behaviorScore: 88 },
    { _id: '4', name: 'Oliver Smith', age: 12, city: 'London', country: 'UK', behaviorScore: 45 }
  ]

  const mockMessages: Message[] = [
    {
      _id: '1',
      sender: 'child',
      senderId: '1',
      recipient: 'santa',
      recipientId: '507f1f77bcf86cd799439011',
      content: 'Dear Santa, I have been very good this year! I helped my mom with dishes and shared my toys with my little brother. For Christmas, I would really love a teddy bear and some art supplies. Thank you! Love, Emma ❤️',
      messageType: 'letter',
      createdAt: '2024-12-20T10:30:00Z',
      senderName: 'Emma Johnson'
    },
    {
      _id: '2',
      sender: 'santa',
      senderId: '507f1f77bcf86cd799439011',
      recipient: 'child',
      recipientId: '1',
      content: 'Ho ho ho! Dear Emma, I received your wonderful letter! 🎅 I\'ve been watching, and I\'m so proud of how helpful and kind you\'ve been this year. The elves are already working on something very special for you! Keep being the amazing little girl you are. Christmas magic works best with good hearts like yours! 🌟',
      messageType: 'reply',
      createdAt: '2024-12-20T14:15:00Z',
      magicSeal: true,
      senderName: 'Santa Claus'
    }
  ]

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChild) return

    const messageData = {
      sender: 'santa',
      senderId: '507f1f77bcf86cd799439011',
      recipient: 'child',
      recipientId: selectedChild._id,
      content: newMessage,
      messageType: 'reply',
      magicSeal: true
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        const newMsg = {
          ...messageData,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          senderName: 'Santa Claus'
        }
        setMessages(prev => [...prev, newMsg])
        setNewMessage('')
        toast.success('Message sent with Christmas magic! ✨')
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      toast.error('Error sending message')
    }
  }

  const quickReplies = [
    "Ho ho ho! I received your letter! 🎅",
    "You've been very good this year! 🌟",
    "The elves are working on something special for you! 🧝‍♀️",
    "Keep being kind and helpful! ❤️",
    "Christmas magic is coming your way! ✨"
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 min-h-[70vh] max-w-6xl mx-auto">
        {/* Children List */}
        <div className="w-full md:w-1/4 christmas-card flex flex-col max-h-[75vh]">

          <div className="p-4 border-b flex-shrink-0">
            <h2 className="text-lg font-bold text-christmas-red text-christmas">
              📬 Children's Letters
            </h2>
            <p className="text-sm text-gray-600">Select a child to view conversation</p>
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                💡 <strong>Note:</strong> No auto-replies! Santa manually responds to each child.
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto scrollbar-hide">
              {children.map((child) => (
                <motion.div
                  key={child._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedChild(child)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedChild?._id === child._id
                      ? 'bg-christmas-red text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      selectedChild?._id === child._id
                        ? 'bg-white text-christmas-red'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      {child.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{child.name}</p>
                      <p className={`text-sm truncate ${
                        selectedChild?._id === child._id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        Age {child.age} • {child.city}, {child.country}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          child.behaviorScore >= 80
                            ? 'bg-green-100 text-green-700'
                            : child.behaviorScore >= 60
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {child.behaviorScore >= 80 ? '🌟 Very Nice' : child.behaviorScore >= 60 ? '😊 Nice' : child.behaviorScore >= 40 ? '😐 Okay' : '😔 Needs Help'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 md:w-3/4 christmas-card flex flex-col max-h-[75vh]">

          {selectedChild ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gradient-to-r from-christmas-red to-red-600 text-white rounded-t-xl flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white text-christmas-red rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedChild.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedChild.name}</h3>
                    <p className="text-white/80">
                      Age {selectedChild.age} • {selectedChild.city}, {selectedChild.country}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 p-4">
                <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide max-h-[52vh]">

                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="loading-spinner"></div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'santa' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === 'santa'
                            ? 'bg-christmas-red text-white message-sent'
                            : 'bg-white border-2 border-gray-200 text-gray-800 message-received'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">
                              {message.sender === 'santa' ? '🎅 Santa' : `👧 ${selectedChild.name}`}
                            </span>
                            {message.magicSeal && (
                              <SparklesIcon className="h-4 w-4 text-yellow-300" />
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'santa' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t flex-shrink-0 space-y-3 bg-gray-50">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a magical reply..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent resize-none"
                      rows={3}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="btn-christmas flex items-center space-x-2 self-end disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    <span>Send</span>
                  </motion.button>
                </div>

                {/* Compact Quick Replies */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Quick replies:</span>
                  <div className="flex-1 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2 pr-2">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => setNewMessage(reply)}
                          className="text-[11px] bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-christmas-red hover:text-white whitespace-nowrap transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a child</h3>
                <p className="text-gray-600">Choose a child from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  StarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Child {
  _id: string
  name: string
  age: number
  email: string
  country: string
  city: string
  behaviorScore: number
  wishlist: Array<{
    item: string
    priority: string
    category: string
  }>
  giftStatus: string
}

export default function Children() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedBehavior, setSelectedBehavior] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedChildDetail, setSelectedChildDetail] = useState<Child | null>(null)

  useEffect(() => {
    fetchChildren()
  }, [searchTerm, selectedCountry, selectedBehavior])

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCountry) params.append('country', selectedCountry)
      if (selectedBehavior) params.append('behaviorScore', selectedBehavior)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setChildren(data.children || mockChildren)
      } else {
        setChildren(mockChildren)
      }
    } catch (error) {
      console.error('Error fetching children:', error)
      setChildren(mockChildren)
    } finally {
      setLoading(false)
    }
  }

  const mockChildren: Child[] = [
    {
      _id: '1',
      name: 'Emma Johnson',
      age: 7,
      email: 'emma@example.com',
      country: 'USA',
      city: 'New York',
      behaviorScore: 95,
      wishlist: [
        { item: 'Teddy Bear', priority: 'high', category: 'toys' },
        { item: 'Art Set', priority: 'medium', category: 'art' }
      ],
      giftStatus: 'approved'
    },
    {
      _id: '2',
      name: 'Lucas Silva',
      age: 10,
      email: 'lucas@example.com',
      country: 'Brazil',
      city: 'São Paulo',
      behaviorScore: 78,
      wishlist: [
        { item: 'Soccer Ball', priority: 'high', category: 'sports' },
        { item: 'Video Game', priority: 'low', category: 'electronics' }
      ],
      giftStatus: 'in_production'
    },
    {
      _id: '3',
      name: 'Aisha Patel',
      age: 6,
      email: 'aisha@example.com',
      country: 'India',
      city: 'Mumbai',
      behaviorScore: 88,
      wishlist: [
        { item: 'Doll House', priority: 'high', category: 'toys' },
        { item: 'Books', priority: 'medium', category: 'books' }
      ],
      giftStatus: 'pending'
    },
    {
      _id: '4',
      name: 'Oliver Smith',
      age: 12,
      email: 'oliver@example.com',
      country: 'UK',
      city: 'London',
      behaviorScore: 45,
      wishlist: [
        { item: 'Bicycle', priority: 'high', category: 'sports' },
        { item: 'Tablet', priority: 'medium', category: 'electronics' }
      ],
      giftStatus: 'pending'
    }
  ]

  const getBehaviorBadge = (score: number) => {
    if (score >= 80) return { text: 'Very Nice', class: 'nice-badge', icon: '🌟' }
    if (score >= 60) return { text: 'Nice', class: 'nice-badge', icon: '😊' }
    if (score >= 40) return { text: 'Okay', class: 'okay-badge', icon: '😐' }
    return { text: 'Needs Improvement', class: 'naughty-badge', icon: '😔' }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      pending: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      approved: { text: 'Approved', class: 'bg-green-100 text-green-800' },
      in_production: { text: 'In Production', class: 'bg-blue-100 text-blue-800' },
      ready: { text: 'Ready', class: 'bg-purple-100 text-purple-800' },
      delivered: { text: 'Delivered', class: 'bg-gray-100 text-gray-800' }
    }
    return statusMap[status] || statusMap.pending
  }

  const updateBehaviorScore = async (childId: string, newScore: number, reason: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children/${childId}/behavior`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ score: newScore, reason })
      })

      if (response.ok) {
        toast.success('Behavior score updated! ⭐')
        fetchChildren()
      } else {
        toast.error('Failed to update behavior score')
      }
    } catch (error) {
      toast.error('Error updating behavior score')
    }
  }

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = !selectedCountry || child.country === selectedCountry
    const matchesBehavior = !selectedBehavior || child.behaviorScore >= parseInt(selectedBehavior)
    
    return matchesSearch && matchesCountry && matchesBehavior
  })

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="christmas-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-christmas-red text-christmas">
                🧒 Children Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all children worldwide and their Christmas wishes
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-christmas mt-4 sm:mt-0 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Child</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="christmas-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search children..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
            >
              <option value="">All Countries</option>
              <option value="USA">USA</option>
              <option value="Brazil">Brazil</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
            </select>

            <select
              value={selectedBehavior}
              onChange={(e) => setSelectedBehavior(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
            >
              <option value="">All Behavior Scores</option>
              <option value="80">Very Nice (80+)</option>
              <option value="60">Nice (60+)</option>
              <option value="40">Okay (40+)</option>
              <option value="0">Needs Improvement</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Total: {filteredChildren.length} children
            </div>
          </div>
        </motion.div>

        {/* Children Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child, index) => {
              const behavior = getBehaviorBadge(child.behaviorScore)
              const status = getStatusBadge(child.giftStatus)
              
              return (
                <motion.div
                  key={child._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="christmas-card group cursor-pointer"
                  onClick={() => setSelectedChildDetail(child)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{child.name}</h3>
                        <p className="text-sm text-gray-600">Age {child.age} • {child.city}, {child.country}</p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-christmas-red">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={behavior.class}>
                        {behavior.icon} {behavior.text}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Behavior Score</span>
                        <span className="text-lg font-bold text-christmas-red">{child.behaviorScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            child.behaviorScore >= 80 ? 'bg-green-500' :
                            child.behaviorScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${child.behaviorScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Wishlist ({child.wishlist.length} items)</h4>
                      <div className="space-y-1">
                        {child.wishlist.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{item.item}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.priority === 'high' ? 'bg-red-100 text-red-700' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                        ))}
                        {child.wishlist.length > 2 && (
                          <p className="text-xs text-gray-500">+{child.wishlist.length - 2} more items</p>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedChildDetail(child)
                          }}
                          className="mt-1 text-xs text-christmas-red hover:underline"
                        >
                          View full wishlist
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateBehaviorScore(child._id, Math.min(100, child.behaviorScore + 10), 'Good behavior reward')
                        }}
                        className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        +10 Nice
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateBehaviorScore(child._id, Math.max(0, child.behaviorScore - 5), 'Behavior correction')
                        }}
                        className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        -5 Naughty
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedChildDetail(child)
                        }}
                        className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {filteredChildren.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="christmas-card text-center py-12"
          >
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No children found</h3>
            <p className="text-gray-600">Try adjusting your search filters or add a new child.</p>
          </motion.div>
        )}

        {selectedChildDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-5 relative">
              <button
                onClick={() => setSelectedChildDetail(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedChildDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedChildDetail.name}</h3>
                  <p className="text-sm text-gray-600">
                    Age {selectedChildDetail.age} • {selectedChildDetail.city}, {selectedChildDetail.country}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedChildDetail.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Behavior Score</span>
                  <span className="text-lg font-bold text-christmas-red">{selectedChildDetail.behaviorScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${selectedChildDetail.behaviorScore}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Full Wishlist</h4>
                {selectedChildDetail.wishlist && selectedChildDetail.wishlist.length > 0 ? (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {selectedChildDetail.wishlist.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.item}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No wishlist items yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import {
  GiftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Gift {
  _id: string
  name: string
  category: string
  description: string
  status: string
  recipientChild?: {
    _id?: string
    name: string
    age: number
    city?: string
  }
  assignedElf?: {
    name: string
    department: string
  }
  productionTime: number
  difficulty: string
  magicLevel: number
  createdAt: string
}

interface ChildOption {
  _id: string
  name: string
  age: number
  city?: string
}

export default function Gifts() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [children, setChildren] = useState<ChildOption[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newGift, setNewGift] = useState({
    name: '',
    category: 'toys',
    description: '',
    recipientChildId: '',
  })

  useEffect(() => {
    fetchGifts()
  }, [selectedStatus, selectedCategory])

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchGifts = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setGifts(data.gifts || mockGifts)
      } else {
        setGifts(mockGifts)
      }
    } catch (error) {
      console.error('Error fetching gifts:', error)
      setGifts(mockGifts)
    } finally {
      setLoading(false)
    }
  }

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setChildren(data.children || [])
      }
    } catch (error) {
      // Fallback: keep children list empty on error
    }
  }

  const createGift = async () => {
    if (!newGift.name.trim() || !newGift.recipientChildId) {
      toast.error('Please enter a gift name and select a child')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const body = {
        name: newGift.name.trim(),
        category: newGift.category,
        description: newGift.description.trim(),
        status: 'design',
        recipientChild: newGift.recipientChildId,
        productionTime: 24,
        difficulty: 'medium',
        magicLevel: 7,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success('Gift created for the child! 🎁')
        setNewGift({ name: '', category: 'toys', description: '', recipientChildId: '' })
        setShowCreate(false)
        fetchGifts()
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error(data.message || 'Failed to create gift')
      }
    } catch (error) {
      toast.error('Error creating gift')
    }
  }

  const mockGifts: Gift[] = [
    {
      _id: '1',
      name: 'Magic Teddy Bear',
      category: 'toys',
      description: 'A cuddly teddy bear with magical hugging powers',
      status: 'in_production',
      recipientChild: { name: 'Emma Johnson', age: 7, city: 'New York' },
      assignedElf: { name: 'Jingle Bell', department: 'toy_making' },
      productionTime: 24,
      difficulty: 'medium',
      magicLevel: 8,
      createdAt: '2024-12-20T10:00:00Z'
    },
    {
      _id: '2',
      name: 'Professional Soccer Ball',
      category: 'sports',
      description: 'FIFA approved soccer ball with enhanced durability',
      status: 'quality_check',
      recipientChild: { name: 'Lucas Silva', age: 10, city: 'São Paulo' },
      assignedElf: { name: 'Sparkle Dust', department: 'quality_control' },
      productionTime: 12,
      difficulty: 'easy',
      magicLevel: 5,
      createdAt: '2024-12-19T15:30:00Z'
    },
    {
      _id: '3',
      name: 'Enchanted Doll House',
      category: 'toys',
      description: 'Three-story dollhouse with working lights and furniture',
      status: 'design',
      recipientChild: { name: 'Aisha Patel', age: 6, city: 'Mumbai' },
      assignedElf: { name: 'Tinker Belle', department: 'toy_making' },
      productionTime: 72,
      difficulty: 'expert',
      magicLevel: 9,
      createdAt: '2024-12-18T09:15:00Z'
    },
    {
      _id: '4',
      name: 'Mountain Bike',
      category: 'sports',
      description: 'Lightweight mountain bike with safety features',
      status: 'completed',
      recipientChild: { name: 'Oliver Smith', age: 12, city: 'London' },
      assignedElf: { name: 'Gear Turner', department: 'logistics' },
      productionTime: 48,
      difficulty: 'hard',
      magicLevel: 6,
      createdAt: '2024-12-17T14:20:00Z'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'design': return { icon: WrenchScrewdriverIcon, color: 'text-gray-500' }
      case 'in_production': return { icon: ClockIcon, color: 'text-blue-500' }
      case 'quality_check': return { icon: MagnifyingGlassIcon, color: 'text-yellow-500' }
      case 'completed': return { icon: CheckCircleIcon, color: 'text-green-500' }
      case 'shipped': return { icon: TruckIcon, color: 'text-purple-500' }
      default: return { icon: GiftIcon, color: 'text-gray-500' }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      design: { text: 'Design Phase', class: 'bg-gray-100 text-gray-800' },
      in_production: { text: 'In Production', class: 'bg-blue-100 text-blue-800' },
      quality_check: { text: 'Quality Check', class: 'bg-yellow-100 text-yellow-800' },
      completed: { text: 'Completed', class: 'bg-green-100 text-green-800' },
      shipped: { text: 'Shipped', class: 'bg-purple-100 text-purple-800' }
    }
    return statusMap[status] || statusMap.design
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-orange-600'
      case 'expert': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const updateGiftStatus = async (giftId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts/${giftId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success('Gift status updated! 🎁')
        fetchGifts()
      } else {
        toast.error('Failed to update gift status')
      }
    } catch (error) {
      toast.error('Error updating gift status')
    }
  }

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.recipientChild?.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'design', label: 'Design Phase' },
    { value: 'in_production', label: 'In Production' },
    { value: 'quality_check', label: 'Quality Check' },
    { value: 'completed', label: 'Completed' },
    { value: 'shipped', label: 'Shipped' }
  ]

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'toys', label: 'Toys' },
    { value: 'books', label: 'Books' },
    { value: 'games', label: 'Games' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'sports', label: 'Sports' },
    { value: 'art', label: 'Art & Crafts' },
    { value: 'music', label: 'Music' }
  ]

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
                🎁 Gift Workshop
              </h1>
              <p className="text-gray-600 mt-1">
                Manage gift production and track delivery status
              </p>
            </div>
            <button
              onClick={() => setShowCreate(prev => !prev)}
              className="btn-christmas mt-4 sm:mt-0 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{showCreate ? 'Close' : 'Create Gift'}</span>
            </button>
          </div>
        </motion.div>

        {/* Create Gift Form */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="christmas-card"
          >
            <h2 className="text-lg font-bold text-christmas-red mb-3">Create Gift for a Child</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gift Name *</label>
                <input
                  type="text"
                  value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                  placeholder="e.g. Magic Teddy Bear"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newGift.category}
                  onChange={(e) => setNewGift({ ...newGift, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                >
                  {categoryOptions.filter(c => c.value !== '').map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGift.description}
                  onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-christmas-red focus:border-transparent resize-none"
                  rows={2}
                  placeholder="Short note about this gift"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Child *</label>
                <select
                  value={newGift.recipientChildId}
                  onChange={(e) => setNewGift({ ...newGift, recipientChildId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                >
                  <option value="">Choose a child</option>
                  {children.map(child => (
                    <option key={child._id} value={child._id}>
                      {child.name} (Age {child.age}{child.city ? ` • ${child.city}` : ''})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createGift}
                className="btn-christmas text-sm px-4 py-2"
              >
                🎁 Create Gift
              </button>
            </div>
          </motion.div>
        )}

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
                placeholder="Search gifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Total: {filteredGifts.length} gifts
            </div>
          </div>
        </motion.div>

        {/* Production Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {statusOptions.slice(1).map((status, index) => {
            const count = gifts.filter(g => g.status === status.value).length
            const StatusIcon = getStatusIcon(status.value).icon
            const iconColor = getStatusIcon(status.value).color
            
            return (
              <div key={status.value} className="christmas-card text-center">
                <StatusIcon className={`h-8 w-8 mx-auto mb-2 ${iconColor}`} />
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{status.label}</div>
              </div>
            )
          })}
        </motion.div>

        {/* Gifts Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGifts.map((gift, index) => {
              const status = getStatusBadge(gift.status)
              const StatusIcon = getStatusIcon(gift.status).icon
              const iconColor = getStatusIcon(gift.status).color
              
              return (
                <motion.div
                  key={gift._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="christmas-card group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-christmas-red to-red-600 rounded-lg flex items-center justify-center">
                        <GiftIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{gift.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{gift.category}</p>
                      </div>
                    </div>
                    <StatusIcon className={`h-6 w-6 ${iconColor}`} />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{gift.description}</p>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.class}`}>
                        {status.text}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Magic Level:</span>
                        <div className="flex">
                          {[...Array(10)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < gift.magicLevel ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {gift.recipientChild && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-800">
                          For: {gift.recipientChild.name} (Age {gift.recipientChild.age})
                        </p>
                        <p className="text-xs text-blue-600">{gift.recipientChild.city}</p>
                      </div>
                    )}

                    {gift.assignedElf && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800">
                          Assigned to: {gift.assignedElf.name}
                        </p>
                        <p className="text-xs text-green-600 capitalize">
                          {gift.assignedElf.department.replace('_', ' ')}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Production Time:</span>
                        <span className="ml-1 font-medium">{gift.productionTime}h</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Difficulty:</span>
                        <span className={`ml-1 font-medium capitalize ${getDifficultyColor(gift.difficulty)}`}>
                          {gift.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex space-x-2 pt-2">
                      {gift.status === 'design' && (
                        <button
                          onClick={() => updateGiftStatus(gift._id, 'in_production')}
                          className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          Start Production
                        </button>
                      )}
                      {gift.status === 'in_production' && (
                        <button
                          onClick={() => updateGiftStatus(gift._id, 'quality_check')}
                          className="flex-1 bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                        >
                          Quality Check
                        </button>
                      )}
                      {gift.status === 'quality_check' && (
                        <button
                          onClick={() => updateGiftStatus(gift._id, 'completed')}
                          className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {gift.status === 'completed' && (
                        <button
                          onClick={() => updateGiftStatus(gift._id, 'shipped')}
                          className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                        >
                          Ship Gift
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {filteredGifts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="christmas-card text-center py-12"
          >
            <GiftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gifts found</h3>
            <p className="text-gray-600">Try adjusting your search filters or create a new gift.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
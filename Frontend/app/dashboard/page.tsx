'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  GiftIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import WorkshopPulse from '../../components/WorkshopPulse'
import WorkshopCCTV from '../../components/WorkshopCCTV'
import SleighControl from '../../components/SleighControl'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [activities, setActivities] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [statsRes, activitiesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/activities`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const statsData = await statsRes.json()
      const activitiesData = await activitiesRes.json()

      setStats(statsData)
      setActivities(activitiesData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockStats = {
    overview: {
      totalChildren: 2147483,
      totalGifts: 856742,
      totalElves: 1247,
      totalMessages: 45892
    },
    childrenByBehavior: [
      { _id: 'Very Nice', count: 1200000 },
      { _id: 'Nice', count: 800000 },
      { _id: 'Okay', count: 120000 },
      { _id: 'Needs Improvement', count: 27483 }
    ],
    giftsByStatus: [
      { _id: 'pending', count: 156742 },
      { _id: 'in_production', count: 450000 },
      { _id: 'ready', count: 200000 },
      { _id: 'delivered', count: 50000 }
    ]
  }

  const displayStats = stats || mockStats

  const statCards = [
    {
      title: 'Total Children',
      value: displayStats.overview?.totalChildren?.toLocaleString() || '2,147,483',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      change: '+12.5%'
    },
    {
      title: 'Gifts in Production',
      value: displayStats.overview?.totalGifts?.toLocaleString() || '856,742',
      icon: GiftIcon,
      color: 'from-green-500 to-green-600',
      change: '+8.2%'
    },
    {
      title: 'Active Elves',
      value: displayStats.overview?.totalElves?.toLocaleString() || '1,247',
      icon: SparklesIcon,
      color: 'from-purple-500 to-purple-600',
      change: '+3.1%'
    },
    {
      title: 'Messages Today',
      value: displayStats.overview?.totalMessages?.toLocaleString() || '45,892',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-red-500 to-red-600',
      change: '+15.7%'
    }
  ]

  const COLORS = ['#059669', '#DC2626', '#F59E0B', '#7C3AED']

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="christmas-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-christmas-red text-christmas">
                🎅 Welcome back, Santa!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening at the North Pole today
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-christmas-green">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {Math.floor((new Date(new Date().getFullYear(), 11, 25).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until Christmas
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Workshop Magic Pulse & CCTV */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <WorkshopPulse />
          <WorkshopCCTV />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="christmas-card"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Children Behavior Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="christmas-card"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Children Behavior Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={displayStats.childrenByBehavior}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {displayStats.childrenByBehavior?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Gift Production Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="christmas-card"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Gift Production Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayStats.giftsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Sleigh Pre-flight HUD */}
        <SleighControl />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="christmas-card"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-christmas-green flex items-center justify-center space-x-2">
              <TruckIcon className="h-5 w-5" />
              <span>Start Delivery Route</span>
            </button>
            <button className="btn-christmas flex items-center justify-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>Reply to Letters</span>
            </button>
            <button className="btn-christmas-gold flex items-center justify-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span>Schedule Workshop</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="christmas-card"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities?.recentMessages?.map((msg: any, index: number) => (
              <div key={`msg-${index}`} className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Letter from {msg.senderId?.name || 'a child'}: "{msg.content.substring(0, 50)}{msg.content.length > 50 ? '...' : ''}"
                  </p>
                  <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activities?.recentGifts?.map((gift: any, index: number) => (
              <div key={`gift-${index}`} className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg border border-green-100/50">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Gift for {gift.recipientChild?.name || 'Someone'}: {gift.status.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(gift.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!activities?.recentMessages?.length && !activities?.recentGifts?.length) && (
              <p className="text-center text-gray-500 py-4 italic">No recent magic activity recorded yet!</p>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
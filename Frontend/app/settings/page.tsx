'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { motion } from 'framer-motion'
import {
  Cog6ToothIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  GiftIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState({
    // Workshop Settings
    workshopName: "Santa's North Pole Workshop",
    timezone: 'Arctic/Longyearbyen',
    workingHours: {
      start: '06:00',
      end: '22:00'
    },
    
    // Notification Settings
    notifications: {
      newLetters: true,
      behaviorUpdates: true,
      giftCompletion: true,
      emergencyAlerts: true,
      dailyReports: true
    },
    
    // Behavior Scoring
    behaviorSettings: {
      defaultScore: 75,
      maxScore: 100,
      minScore: 0,
      autoAdjustment: true,
      strictMode: false
    },
    
    // Gift Production
    giftSettings: {
      autoAssignElves: true,
      qualityCheckRequired: true,
      rushOrdersEnabled: true,
      maxProductionTime: 72
    },
    
    // Message Settings
    messageSettings: {
      autoReply: true,
      replyDelay: 30,
      magicSealEnabled: true,
      parentNotifications: true
    },
    
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 24,
      ipWhitelist: '',
      auditLogging: true
    }
  })

  const [activeTab, setActiveTab] = useState('workshop')

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully! 🎄')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      toast.success('Settings reset to default values')
    }
  }

  const tabs = [
    { id: 'workshop', name: 'Workshop', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'behavior', name: 'Behavior', icon: UserGroupIcon },
    { id: 'gifts', name: 'Gifts', icon: GiftIcon },
    { id: 'messages', name: 'Messages', icon: ChatBubbleLeftRightIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
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
                ⚙️ Workshop Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Configure your North Pole workshop operations
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={handleSave}
                className="btn-christmas"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="christmas-card"
          >
            <h3 className="font-semibold text-gray-800 mb-4">Settings Categories</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-christmas-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 christmas-card"
          >
            {/* Workshop Settings */}
            {activeTab === 'workshop' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Cog6ToothIcon className="h-6 w-6 mr-2" />
                  Workshop Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workshop Name
                    </label>
                    <input
                      type="text"
                      value={settings.workshopName}
                      onChange={(e) => setSettings({
                        ...settings,
                        workshopName: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        timezone: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    >
                      <option value="Arctic/Longyearbyen">Arctic/Longyearbyen</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="Europe/London">London Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => setSettings({
                        ...settings,
                        workingHours: { ...settings.workingHours, start: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => setSettings({
                        ...settings,
                        workingHours: { ...settings.workingHours, end: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <BellIcon className="h-6 w-6 mr-2" />
                  Notification Preferences
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'newLetters' && 'Get notified when children send new letters'}
                          {key === 'behaviorUpdates' && 'Receive alerts for behavior score changes'}
                          {key === 'giftCompletion' && 'Notifications when gifts are completed'}
                          {key === 'emergencyAlerts' && 'Critical workshop alerts and issues'}
                          {key === 'dailyReports' && 'Daily summary reports'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              [key]: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-christmas-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-christmas-red"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Behavior Settings */}
            {activeTab === 'behavior' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <UserGroupIcon className="h-6 w-6 mr-2" />
                  Behavior Scoring System
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Behavior Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.behaviorSettings.defaultScore}
                      onChange={(e) => setSettings({
                        ...settings,
                        behaviorSettings: {
                          ...settings.behaviorSettings,
                          defaultScore: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Score
                    </label>
                    <input
                      type="number"
                      value={settings.behaviorSettings.maxScore}
                      onChange={(e) => setSettings({
                        ...settings,
                        behaviorSettings: {
                          ...settings.behaviorSettings,
                          maxScore: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Auto Adjustment</h4>
                        <p className="text-sm text-gray-600">Automatically adjust scores based on patterns</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.behaviorSettings.autoAdjustment}
                          onChange={(e) => setSettings({
                            ...settings,
                            behaviorSettings: {
                              ...settings.behaviorSettings,
                              autoAdjustment: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-christmas-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-christmas-red"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Strict Mode</h4>
                        <p className="text-sm text-gray-600">Apply stricter behavior evaluation criteria</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.behaviorSettings.strictMode}
                          onChange={(e) => setSettings({
                            ...settings,
                            behaviorSettings: {
                              ...settings.behaviorSettings,
                              strictMode: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-christmas-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-christmas-red"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add other tab contents similarly... */}
            {activeTab === 'gifts' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <GiftIcon className="h-6 w-6 mr-2" />
                  Gift Production Settings
                </h3>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-blue-800">
                    🎁 Gift production settings help optimize the workshop efficiency and ensure quality control.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                  Message Configuration
                </h3>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-green-800">
                    📬 Configure how Santa communicates with children around the world.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-2" />
                  Security & Privacy
                </h3>
                <div className="bg-red-50 rounded-lg p-6">
                  <p className="text-red-800">
                    🔒 Protect the North Pole workshop with advanced security settings.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
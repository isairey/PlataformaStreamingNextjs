'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Volume2, 
  Download, 
  Trash2,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Wifi,
  HardDrive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState({
    // Display Settings
    theme: 'dark',
    language: 'en',
    autoplay: true,
    trailerAutoplay: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    newMovieAlerts: true,
    watchlistReminders: true,
    
    // Playback
    videoQuality: 'auto',
    subtitles: true,
    audioLanguage: 'en',
    volume: 75,
    
    // Privacy
    profileVisibility: 'private',
    watchHistory: true,
    dataCollection: false,
    
    // Storage
    downloadQuality: 'high',
    storageLimit: '5GB',
    autoDelete: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const SettingSection = ({ 
    title, 
    icon: Icon, 
    children 
  }: { 
    title: string
    icon: any
    children: React.ReactNode 
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-netflix-gray rounded-lg p-6 mb-6"
    >
      <div className="flex items-center mb-4">
        <Icon className="h-5 w-5 text-netflix-red mr-3" />
        <h3 className="title-section text-white">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )

  const ToggleSetting = ({ 
    label, 
    description, 
    value, 
    onChange 
  }: {
    label: string
    description?: string
    value: boolean
    onChange: (value: boolean) => void
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && <div className="text-gray-400 text-sm">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-netflix-red' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const SelectSetting = ({ 
    label, 
    value, 
    options, 
    onChange 
  }: {
    label: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
  }) => (
    <div className="flex items-center justify-between">
      <div className="text-white font-medium">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-netflix-black border border-gray-600 rounded px-3 py-1 text-white text-sm focus:border-netflix-red focus:outline-none"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const SliderSetting = ({ 
    label, 
    value, 
    min = 0, 
    max = 100, 
    onChange 
  }: {
    label: string
    value: number
    min?: number
    max?: number
    onChange: (value: number) => void
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-white font-medium">{label}</div>
        <div className="text-gray-400 text-sm">{value}%</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container-page py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="title-display text-2xl text-white flex items-center">
                <Settings className="h-6 w-6 text-netflix-red mr-3" />
                Settings
              </h1>
              <p className="text-gray-400 mt-1">Customize your viewing experience</p>
            </div>
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        <div className="max-w-4xl mx-auto">
          {/* Display Settings */}
          <SettingSection title="Display & Interface" icon={Palette}>
            <SelectSetting
              label="Theme"
              value={settings.theme}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto' }
              ]}
              onChange={(value) => handleSettingChange('theme', value)}
            />
            
            <SelectSetting
              label="Language"
              value={settings.language}
              options={[
                { value: 'en', label: 'English' },
                { value: 'id', label: 'Bahasa Indonesia' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' }
              ]}
              onChange={(value) => handleSettingChange('language', value)}
            />
            
            <ToggleSetting
              label="Autoplay Previews"
              description="Automatically play movie trailers when browsing"
              value={settings.trailerAutoplay}
              onChange={(value) => handleSettingChange('trailerAutoplay', value)}
            />
          </SettingSection>

          {/* Notifications */}
          <SettingSection title="Notifications" icon={Bell}>
            <ToggleSetting
              label="Email Notifications"
              description="Receive updates via email"
              value={settings.emailNotifications}
              onChange={(value) => handleSettingChange('emailNotifications', value)}
            />
            
            <ToggleSetting
              label="Push Notifications"
              description="Get notifications on your device"
              value={settings.pushNotifications}
              onChange={(value) => handleSettingChange('pushNotifications', value)}
            />
            
            <ToggleSetting
              label="New Movie Alerts"
              description="Notify when new movies are added"
              value={settings.newMovieAlerts}
              onChange={(value) => handleSettingChange('newMovieAlerts', value)}
            />
            
            <ToggleSetting
              label="Watchlist Reminders"
              description="Remind you about movies in your watchlist"
              value={settings.watchlistReminders}
              onChange={(value) => handleSettingChange('watchlistReminders', value)}
            />
          </SettingSection>

          {/* Playback Settings */}
          <SettingSection title="Playback & Quality" icon={Volume2}>
            <SelectSetting
              label="Video Quality"
              value={settings.videoQuality}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: '4k', label: '4K Ultra HD' },
                { value: '1080p', label: '1080p HD' },
                { value: '720p', label: '720p HD' },
                { value: '480p', label: '480p SD' }
              ]}
              onChange={(value) => handleSettingChange('videoQuality', value)}
            />
            
            <SelectSetting
              label="Audio Language"
              value={settings.audioLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'id', label: 'Indonesian' },
                { value: 'original', label: 'Original Language' }
              ]}
              onChange={(value) => handleSettingChange('audioLanguage', value)}
            />
            
            <ToggleSetting
              label="Subtitles"
              description="Show subtitles by default"
              value={settings.subtitles}
              onChange={(value) => handleSettingChange('subtitles', value)}
            />
            
            <SliderSetting
              label="Default Volume"
              value={settings.volume}
              onChange={(value) => handleSettingChange('volume', value)}
            />
          </SettingSection>

          {/* Privacy Settings */}
          <SettingSection title="Privacy & Security" icon={Shield}>
            <SelectSetting
              label="Profile Visibility"
              value={settings.profileVisibility}
              options={[
                { value: 'private', label: 'Private' },
                { value: 'friends', label: 'Friends Only' },
                { value: 'public', label: 'Public' }
              ]}
              onChange={(value) => handleSettingChange('profileVisibility', value)}
            />
            
            <ToggleSetting
              label="Watch History"
              description="Keep track of movies you've watched"
              value={settings.watchHistory}
              onChange={(value) => handleSettingChange('watchHistory', value)}
            />
            
            <ToggleSetting
              label="Data Collection"
              description="Allow anonymous usage data collection"
              value={settings.dataCollection}
              onChange={(value) => handleSettingChange('dataCollection', value)}
            />
          </SettingSection>

          {/* Storage Settings */}
          <SettingSection title="Downloads & Storage" icon={HardDrive}>
            <SelectSetting
              label="Download Quality"
              value={settings.downloadQuality}
              options={[
                { value: 'high', label: 'High (1080p)' },
                { value: 'medium', label: 'Medium (720p)' },
                { value: 'low', label: 'Low (480p)' }
              ]}
              onChange={(value) => handleSettingChange('downloadQuality', value)}
            />
            
            <SelectSetting
              label="Storage Limit"
              value={settings.storageLimit}
              options={[
                { value: '1GB', label: '1 GB' },
                { value: '5GB', label: '5 GB' },
                { value: '10GB', label: '10 GB' },
                { value: 'unlimited', label: 'Unlimited' }
              ]}
              onChange={(value) => handleSettingChange('storageLimit', value)}
            />
            
            <ToggleSetting
              label="Auto-delete Watched"
              description="Automatically delete downloaded movies after watching"
              value={settings.autoDelete}
              onChange={(value) => handleSettingChange('autoDelete', value)}
            />
          </SettingSection>

          {/* Account Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-netflix-gray rounded-lg p-6"
          >
            <h3 className="title-section text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 text-netflix-red mr-3" />
              Account Actions
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Clear Watch History</div>
                  <div className="text-gray-400 text-sm">Remove all viewing history data</div>
                </div>
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Clear Cache</div>
                  <div className="text-gray-400 text-sm">Free up storage space</div>
                </div>
                <Button variant="ghost" className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
              
              <div className="border-t border-gray-600 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Sign Out</div>
                    <div className="text-gray-400 text-sm">Sign out from your account</div>
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <Button className="bg-netflix-red hover:bg-red-700 px-8">
              Save All Settings
            </Button>
            <p className="text-gray-400 text-sm mt-2">
              Settings are automatically saved
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

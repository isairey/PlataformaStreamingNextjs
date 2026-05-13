'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Mail, Calendar, Settings, Heart, Play, Edit3, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || 'John Doe',
    email: session?.user?.email || 'john.doe@example.com',
    bio: 'Movie enthusiast and binge-watcher. Love action movies and sci-fi series.',
    joinDate: '2024-01-15',
    favoriteGenre: 'Action, Sci-Fi, Thriller',
    watchedMovies: 127,
    watchlistCount: 23,
    favoriteMovie: 'Avengers: Endgame'
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
    console.log('Profile updated:', profileData)
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container-page py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="title-display text-2xl text-white">Profile</h1>
              <p className="text-gray-400 mt-1">Manage your account and preferences</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-netflix-gray rounded-lg p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-netflix-red to-orange-500 flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-2 right-2 bg-netflix-red text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <h2 className="title-display text-xl text-white mb-2">{profileData.name}</h2>
              <p className="text-gray-400 mb-4">{profileData.email}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {new Date(profileData.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-center text-gray-300">
                  <Play className="h-4 w-4 mr-2" />
                  {profileData.watchedMovies} Movies Watched
                </div>
                <div className="flex items-center justify-center text-gray-300">
                  <Heart className="h-4 w-4 mr-2" />
                  {profileData.watchlistCount} in Watchlist
                </div>
              </div>

              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className="mt-6 w-full bg-netflix-red hover:bg-red-700"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-netflix-gray rounded-lg p-6">
              <h3 className="title-section text-white mb-6">Profile Information</h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-netflix-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-netflix-red focus:outline-none"
                    />
                  ) : (
                    <p className="text-white bg-netflix-black px-4 py-2 rounded-lg">{profileData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <p className="text-white bg-netflix-black px-4 py-2 rounded-lg">{profileData.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                      className="w-full bg-netflix-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-netflix-red focus:outline-none resize-none"
                    />
                  ) : (
                    <p className="text-white bg-netflix-black px-4 py-2 rounded-lg">{profileData.bio}</p>
                  )}
                </div>

                {/* Favorite Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Favorite Genres
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.favoriteGenre}
                      onChange={(e) => setProfileData({...profileData, favoriteGenre: e.target.value})}
                      className="w-full bg-netflix-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-netflix-red focus:outline-none"
                      placeholder="e.g., Action, Sci-Fi, Thriller"
                    />
                  ) : (
                    <p className="text-white bg-netflix-black px-4 py-2 rounded-lg">{profileData.favoriteGenre}</p>
                  )}
                </div>

                {/* Favorite Movie */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Favorite Movie
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.favoriteMovie}
                      onChange={(e) => setProfileData({...profileData, favoriteMovie: e.target.value})}
                      className="w-full bg-netflix-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-netflix-red focus:outline-none"
                    />
                  ) : (
                    <p className="text-white bg-netflix-black px-4 py-2 rounded-lg">{profileData.favoriteMovie}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave} className="bg-netflix-red hover:bg-red-700">
                      Save Changes
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)} 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="title-section text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/watchlist">
              <div className="bg-netflix-gray p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <Heart className="h-8 w-8 text-netflix-red mb-3" />
                <h4 className="text-white font-semibold mb-2">My Watchlist</h4>
                <p className="text-gray-400 text-sm">View and manage your saved movies</p>
              </div>
            </Link>
            
            <Link href="/settings">
              <div className="bg-netflix-gray p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <Settings className="h-8 w-8 text-blue-500 mb-3" />
                <h4 className="text-white font-semibold mb-2">Settings</h4>
                <p className="text-gray-400 text-sm">Customize your app preferences</p>
              </div>
            </Link>
            
            <div className="bg-netflix-gray p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <Play className="h-8 w-8 text-green-500 mb-3" />
              <h4 className="text-white font-semibold mb-2">Continue Watching</h4>
              <p className="text-gray-400 text-sm">Resume your recent movies</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

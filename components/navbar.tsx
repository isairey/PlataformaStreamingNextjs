"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 mt-2">
            {/* Main navbar container */}
            <div className="flex items-center justify-between w-full bg-black/20 backdrop-blur-2xl rounded-full border border-white/10 px-6 py-3 shadow-2xl">
              {/* Left side - Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <Image src="/favicon.svg" alt="Logo" width={24} height={24} />
                  </div>
                  <span className="text-xl font-bold text-white hidden sm:block">
                    Screenly
                  </span>
                </Link>
              </div>

              {/* Center - Navigation Links (Desktop) */}
              <div className="hidden md:flex items-center space-x-1 bg-white/5 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/movies"
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  Movies
                </Link>
                <Link
                  href="/watchlist"
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  My List
                </Link>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-2">
                {/* Search */}
                <Link href="/search">
                  <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 group">
                    <Search className="w-4 h-4 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </button>
                </Link>

                {session ? (
                  <>
                    {/* Notifications */}
                    <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 group relative">
                      <Bell className="w-4 h-4 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                    </button>

                    {/* Profile */}
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-full px-3 py-2 transition-all duration-300 group"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={session.user?.image || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xs">
                            {getInitials(
                              session.user?.name || session.user?.email || "U"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-white/80 group-hover:text-white hidden sm:block">
                          {session.user?.name?.split(" ")[0] || "User"}
                        </span>
                      </button>

                      {/* Profile Dropdown */}
                      {isProfileOpen && (
                        <div className="absolute right-0 top-12 w-64 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                          {/* Header */}
                          <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12 border-2 border-white/20">
                                <AvatarImage src={session.user?.image || ""} />
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white">
                                  {getInitials(
                                    session.user?.name ||
                                      session.user?.email ||
                                      "U"
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-white text-sm">
                                  {session.user?.name}
                                </p>
                                <p className="text-white/60 text-xs">
                                  {session.user?.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              href="/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                            >
                              <User className="w-4 h-4 text-white/80 group-hover:text-white" />
                              <span className="text-sm text-white/80 group-hover:text-white">
                                Profile
                              </span>
                            </Link>
                            <Link
                              href="/watchlist"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                            >
                              <Heart className="w-4 h-4 text-white/80 group-hover:text-white" />
                              <span className="text-sm text-white/80 group-hover:text-white">
                                Watchlist
                              </span>
                            </Link>
                            <Link
                              href="/settings"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                            >
                              <Settings className="w-4 h-4 text-white/80 group-hover:text-white" />
                              <span className="text-sm text-white/80 group-hover:text-white">
                                Settings
                              </span>
                            </Link>

                            {/* Divider */}
                            <div className="my-2 h-px bg-white/10"></div>

                            <button
                              onClick={() => {
                                signOut();
                                setIsProfileOpen(false);
                              }}
                              className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 group w-full text-left"
                            >
                              <LogOut className="w-4 h-4 text-white/80 group-hover:text-red-400" />
                              <span className="text-sm text-white/80 group-hover:text-red-400">
                                Sign Out
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/signin">
                      <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/auth/signup">
                      <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4 text-white" />
                  ) : (
                    <Menu className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/20 p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  Home
                </Link>
                <Link
                  href="/movies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  Movies
                </Link>
                <Link
                  href="/watchlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  My List
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
        ></div>
      )}
    </>
  );
}

'use client'

import React from 'react'

import Sidebar from './sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="flex">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout

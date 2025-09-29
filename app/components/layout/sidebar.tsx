'use client'

import React from 'react'
import { LayoutDashboard, BarChart3 } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  
  /* Items for the sidebar */
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', active: false },
  ]

  return (
    <aside className={cn(
      'w-64 min-h-screen bg-gray-950/50 border-r border-gray-800',
      className
    )}>
      <div className="p-6 py-12">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            S T A T S T O C K
        </h1>
        <nav className="space-y-2 mt-8">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                'flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-colors',
                item.active
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar

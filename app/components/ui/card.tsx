import React from 'react'
import { cn } from '@/app/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800',
        hover && 'hover:border-purple-500/50 transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card

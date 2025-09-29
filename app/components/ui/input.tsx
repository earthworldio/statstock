import React from 'react'
import { cn } from '@/app/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input: React.FC<InputProps> = ({ 
  className, 
  label, 
  error, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Input

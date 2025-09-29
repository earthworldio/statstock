import React from 'react'
import { cn } from '@/app/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600': variant === 'primary',
          'bg-gray-800 text-white hover:bg-gray-700': variant === 'secondary',
          'border border-gray-700 bg-transparent text-white hover:bg-gray-800': variant === 'outline',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

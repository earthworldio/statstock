'use client'

import React from 'react'

const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to StatStock
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          Real-time stock analysis platform
        </p>
      </div>
    </div>
  )
}

export default WelcomeMessage

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  Target, 
  PiggyBank, 
  User,
  Plus
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Transações', href: '/transactions', icon: CreditCard },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Metas', href: '/goals', icon: Target },
    { name: 'Orçamento', href: '/budget', icon: PiggyBank },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header Mobile */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">FinanceApp</span>
        </div>
        <Link
          to="/profile"
          className={`p-2 rounded-lg transition-colors ${
            location.pathname === '/profile' 
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <User className="w-6 h-6" />
        </Link>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 safe-area-bottom transition-colors">
        <div className="flex items-center justify-around">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        to="/transactions"
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  )
}

export default Layout
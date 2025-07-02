import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FinanceProvider } from './contexts/FinanceContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Goals from './pages/Goals'
import Budget from './pages/Budget'
import Profile from './pages/Profile'

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              <Route path="/transactions" element={
                <Layout>
                  <Transactions />
                </Layout>
              } />
              <Route path="/reports" element={
                <Layout>
                  <Reports />
                </Layout>
              } />
              <Route path="/goals" element={
                <Layout>
                  <Goals />
                </Layout>
              } />
              <Route path="/budget" element={
                <Layout>
                  <Budget />
                </Layout>
              } />
              <Route path="/profile" element={
                <Layout>
                  <Profile />
                </Layout>
              } />
            </Routes>
            <Toaster 
              position="top-center" 
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  fontSize: '14px',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }
              }}
            />
          </div>
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  )
}

export default App
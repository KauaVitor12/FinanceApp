import React, { createContext, useContext, useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Date
  recurring?: boolean
}

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: string
  description?: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  month: string
}

interface FinanceContextType {
  transactions: Transaction[]
  goals: Goal[]
  budgets: Budget[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  addGoal: (goal: Omit<Goal, 'id'>) => void
  addBudget: (budget: Omit<Budget, 'id'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteTransaction: (id: string) => void
  deleteGoal: (id: string) => void
  deleteBudget: (id: string) => void
  getMonthlyTransactions: (date: Date) => Transaction[]
  getTotalIncome: (date?: Date) => number
  getTotalExpenses: (date?: Date) => number
  getBalance: () => number
  getCategoryExpenses: (date?: Date) => { [key: string]: number }
  clearAllData: () => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedTransactions = localStorage.getItem('financeapp_transactions')
    const savedGoals = localStorage.getItem('financeapp_goals')
    const savedBudgets = localStorage.getItem('financeapp_budgets')

    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }))
      setTransactions(parsedTransactions)
    }

    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((g: any) => ({
        ...g,
        deadline: new Date(g.deadline)
      }))
      setGoals(parsedGoals)
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
  }, [])

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('financeapp_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('financeapp_goals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem('financeapp_budgets', JSON.stringify(budgets))
  }, [budgets])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}`,
    }
    setGoals(prev => [...prev, newGoal])
  }

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: `budget-${Date.now()}`,
    }
    setBudgets(prev => [...prev, newBudget])
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  const getMonthlyTransactions = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return transactions.filter(t => isWithinInterval(t.date, { start, end }))
  }

  const getTotalIncome = (date?: Date) => {
    const relevantTransactions = date ? getMonthlyTransactions(date) : transactions
    return relevantTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = (date?: Date) => {
    const relevantTransactions = date ? getMonthlyTransactions(date) : transactions
    return relevantTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  const getCategoryExpenses = (date?: Date) => {
    const relevantTransactions = date ? getMonthlyTransactions(date) : transactions
    const expenses = relevantTransactions.filter(t => t.type === 'expense')
    
    return expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {} as { [key: string]: number })
  }

  const clearAllData = () => {
    setTransactions([])
    setGoals([])
    setBudgets([])
    localStorage.removeItem('financeapp_transactions')
    localStorage.removeItem('financeapp_goals')
    localStorage.removeItem('financeapp_budgets')
  }

  return (
    <FinanceContext.Provider value={{
      transactions,
      goals,
      budgets,
      addTransaction,
      addGoal,
      addBudget,
      updateGoal,
      deleteTransaction,
      deleteGoal,
      deleteBudget,
      getMonthlyTransactions,
      getTotalIncome,
      getTotalExpenses,
      getBalance,
      getCategoryExpenses,
      clearAllData,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}
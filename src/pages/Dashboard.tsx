import React from 'react'
import { useFinance } from '../contexts/FinanceContext'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  EyeOff,
  CreditCard,
  PiggyBank,
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Dashboard: React.FC = () => {
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getBalance, 
    transactions, 
    goals,
    getCategoryExpenses,
    getMonthlyTransactions
  } = useFinance()

  const [showBalance, setShowBalance] = useState(true)

  const currentDate = new Date()
  const monthlyIncome = getTotalIncome(currentDate)
  const monthlyExpenses = getTotalExpenses(currentDate)
  const balance = getBalance()
  const monthlyTransactions = getMonthlyTransactions(currentDate)
  const categoryExpenses = getCategoryExpenses(currentDate)

  const formatCurrency = (amount: number) => {
    if (!showBalance) return 'R$ ••••'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const recentTransactions = transactions.slice(0, 3)
  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount).slice(0, 2)

  const hasData = transactions.length > 0 || goals.length > 0

  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo ao FinanceApp! 👋</h1>
          <p className="text-primary-100 mb-4">
            Comece sua jornada financeira adicionando sua primeira transação ou criando uma meta.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/transactions"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Primeira Transação</h3>
            <p className="text-sm text-gray-500">Adicione uma receita ou despesa</p>
          </Link>

          <Link
            to="/goals"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Criar Meta</h3>
            <p className="text-sm text-gray-500">Defina seus objetivos</p>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">O que você pode fazer:</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Controlar receitas e despesas</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Criar e acompanhar metas</span>
            </div>
            <div className="flex items-center">
              <PiggyBank className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Definir orçamentos mensais</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">Visualizar relatórios detalhados</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-100 text-sm">Saldo Total</p>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 bg-white/20 rounded-lg"
          >
            {showBalance ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-xs text-primary-100">Receitas</span>
            </div>
            <p className="font-semibold">{formatCurrency(monthlyIncome)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span className="text-xs text-primary-100">Despesas</span>
            </div>
            <p className="font-semibold">{formatCurrency(monthlyExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Metas Ativas</p>
              <p className="text-lg font-bold text-gray-900">{activeGoals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-500">Transações</p>
              <p className="text-lg font-bold text-gray-900">{monthlyTransactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Transações Recentes</h3>
            <Link to="/transactions" className="text-primary-600 text-sm font-medium">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Metas em Andamento</h3>
            <Link to="/goals" className="text-primary-600 text-sm font-medium">
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                    <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
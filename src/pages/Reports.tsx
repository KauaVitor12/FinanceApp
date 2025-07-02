import React, { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Calendar, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const Reports: React.FC = () => {
  const { 
    getMonthlyTransactions, 
    getTotalIncome, 
    getTotalExpenses, 
    getCategoryExpenses,
    transactions
  } = useFinance()
  
  const [selectedPeriod, setSelectedPeriod] = useState(6)
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  // Dados dos últimos meses
  const getMonthlyData = () => {
    const data = []
    const currentDate = new Date()
    
    for (let i = selectedPeriod - 1; i >= 0; i--) {
      const date = subMonths(currentDate, i)
      
      const income = getTotalIncome(date)
      const expenses = getTotalExpenses(date)
      
      data.push({
        month: format(date, 'MMM/yy', { locale: ptBR }),
        receitas: income,
        despesas: expenses,
        saldo: income - expenses
      })
    }
    
    return data
  }

  // Dados por categoria (mês atual)
  const getCategoryData = () => {
    const currentDate = new Date()
    const categoryExpenses = getCategoryExpenses(currentDate)
    
    const colors = [
      '#22c55e', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6',
      '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#6366f1'
    ]
    
    return Object.entries(categoryExpenses)
      .map(([category, amount], index) => ({
        name: category,
        value: amount,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
  }

  const monthlyData = getMonthlyData()
  const categoryData = getCategoryData()
  const currentDate = new Date()
  const currentMonthIncome = getTotalIncome(currentDate)
  const currentMonthExpenses = getTotalExpenses(currentDate)
  const currentMonthBalance = currentMonthIncome - currentMonthExpenses

  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-sm text-gray-500">Análise das suas finanças</p>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado para exibir</h3>
          <p className="text-gray-500">
            Adicione algumas transações para visualizar relatórios detalhados
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-sm text-gray-500">Análise das suas finanças</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value={3}>3 meses</option>
          <option value={6}>6 meses</option>
          <option value={12}>12 meses</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-xs text-gray-500">Receitas</span>
          </div>
          <p className="text-lg font-bold text-green-600">{formatCurrency(currentMonthIncome)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-xs text-gray-500">Despesas</span>
          </div>
          <p className="text-lg font-bold text-red-600">{formatCurrency(currentMonthExpenses)}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-xs text-gray-500">Saldo</span>
          </div>
          <p className={`text-lg font-bold ${currentMonthBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(currentMonthBalance)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Evolução Financeira</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              </BarChart>
            ) : (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line type="monotone" dataKey="receitas" stroke="#22c55e" strokeWidth={2} name="Receitas" />
                <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} name="Despesas" />
                <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} name="Saldo" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Gastos por Categoria</h3>
            <PieChartIcon className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {categoryData.slice(0, 5).map((category, index) => {
              const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
              const percentage = (category.value / total) * 100
              
              return (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="h-1 rounded-full"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(category.value)}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
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

export default Reports
import React, { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import { Plus, PieChart, AlertTriangle, CheckCircle, TrendingUp, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

const Budget: React.FC = () => {
  const { budgets, addBudget, deleteBudget, getCategoryExpenses } = useFinance()
  const [showAddForm, setShowAddForm] = useState(false)

  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  })

  const categories = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
    'Entretenimento', 'Roupas', 'Tecnologia', 'Viagem', 'Outros'
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const currentDate = new Date()
  const currentMonth = format(currentDate, 'yyyy-MM')
  const categoryExpenses = getCategoryExpenses(currentDate)

  // Atualizar gastos dos orçamentos com dados reais
  const updatedBudgets = budgets.map(budget => ({
    ...budget,
    spent: categoryExpenses[budget.category] || 0
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.limit) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    // Verificar se já existe orçamento para esta categoria no mês atual
    const existingBudget = budgets.find(b => b.category === formData.category && b.month === currentMonth)
    if (existingBudget) {
      toast.error('Já existe um orçamento para esta categoria neste mês')
      return
    }

    addBudget({
      category: formData.category,
      limit: parseFloat(formData.limit),
      spent: categoryExpenses[formData.category] || 0,
      month: currentMonth
    })

    toast.success('Orçamento criado com sucesso!')
    setShowAddForm(false)
    setFormData({
      category: '',
      limit: ''
    })
  }

  const handleDelete = (budgetId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteBudget(budgetId)
      toast.success('Orçamento excluído com sucesso!')
    }
  }

  const getBudgetStatus = (budget: any) => {
    const percentage = (budget.spent / budget.limit) * 100
    
    if (percentage >= 100) return { status: 'exceeded', color: 'red', icon: AlertTriangle }
    if (percentage >= 80) return { status: 'warning', color: 'yellow', icon: AlertTriangle }
    if (percentage >= 50) return { status: 'good', color: 'blue', icon: TrendingUp }
    return { status: 'excellent', color: 'green', icon: CheckCircle }
  }

  const totalBudget = updatedBudgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = updatedBudgets.reduce((sum, budget) => sum + budget.spent, 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orçamento</h1>
          <p className="text-sm text-gray-500">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Budget Summary */}
      {updatedBudgets.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <PieChart className="w-5 h-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Orçamento Total</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Total Gasto</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {updatedBudgets.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Progresso Geral</h3>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Utilizado: {formatCurrency(totalSpent)}</span>
              <span>Limite: {formatCurrency(totalBudget)}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                totalBudget > 0 && (totalSpent / totalBudget) >= 1 ? 'bg-red-500' :
                totalBudget > 0 && (totalSpent / totalBudget) >= 0.8 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% utilizado
            </span>
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="space-y-3">
        {updatedBudgets.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum orçamento criado</h3>
            <p className="text-gray-500 mb-4">
              Comece criando orçamentos para suas categorias de gastos
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Criar Orçamento
            </button>
          </div>
        ) : (
          updatedBudgets.map((budget) => {
            const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0
            const status = getBudgetStatus(budget)
            const remaining = budget.limit - budget.spent
            
            return (
              <div key={budget.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500">Orçamento mensal</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-${status.color}-100`}>
                      <status.icon className={`w-4 h-4 text-${status.color}-600`} />
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Gasto: {percentage.toFixed(1)}%</span>
                    <span>{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 100 ? 'bg-red-500' :
                        percentage >= 80 ? 'bg-yellow-500' :
                        percentage >= 50 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remaining >= 0 ? 'Restante' : 'Excedido'}
                    </p>
                    <p className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(remaining))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`text-sm font-medium text-${status.color}-600`}>
                      {status.status === 'exceeded' ? 'Excedido' :
                       status.status === 'warning' ? 'Atenção' :
                       status.status === 'good' ? 'Bom' : 'Excelente'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Budget Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Novo Orçamento</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.filter(cat => !budgets.some(b => b.category === cat && b.month === currentMonth)).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Limite Mensal *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Defina limites realistas baseados no seu histórico de gastos.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Criar Orçamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Budget
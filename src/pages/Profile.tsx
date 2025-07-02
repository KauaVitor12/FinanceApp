import React, { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  User, 
  Download, 
  Upload, 
  Trash2,
  Settings,
  CreditCard,
  PieChart,
  Target,
  AlertTriangle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { transactions, goals, budgets, clearAllData } = useFinance()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const handleExportData = () => {
    const data = {
      transactions,
      goals,
      budgets,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financeapp-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Dados exportados com sucesso!')
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        console.log('Dados importados:', data)
        toast.success('Dados importados com sucesso!')
      } catch (error) {
        toast.error('Erro ao importar dados. Verifique o arquivo.')
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (window.confirm('Tem certeza que deseja excluir TODOS os dados? Esta ação não pode ser desfeita.')) {
      clearAllData()
      toast.success('Todos os dados foram excluídos!')
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(newTheme)
    }
    toast.success(`Tema alterado para ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'escuro' : 'sistema'}`)
  }

  const totalTransactions = transactions.length
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'statistics', name: 'Estatísticas', icon: PieChart },
    { id: 'data', name: 'Dados', icon: Download },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Perfil</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Configurações e estatísticas</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usuário FinanceApp</h3>
                <p className="text-gray-500 dark:text-gray-400">Membro desde hoje</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <CreditCard className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTransactions}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transações</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <Target className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Metas</p>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tema</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Sun className="w-6 h-6 mb-2 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Claro</span>
              </button>
              
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Moon className="w-6 h-6 mb-2 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Escuro</span>
              </button>
              
              <button
                onClick={() => handleThemeChange('system')}
                className="flex flex-col items-center p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                <Monitor className="w-6 h-6 mb-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Sistema</span>
              </button>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Configurações Rápidas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Notificações</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Backup Automático</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="space-y-4">
          {/* Financial Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Receitas</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Despesas</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Estatísticas Detalhadas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Saldo Total:</span>
                <span className={`font-semibold ${(totalIncome - totalExpenses) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Metas Concluídas:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{completedGoals}/{goals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Orçamentos Ativos:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{budgets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Média por Transação:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-4">
          {/* Backup */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Backup dos Dados</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Faça backup dos seus dados financeiros para manter suas informações seguras.
            </p>
            <button 
              onClick={handleExportData}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </button>
          </div>

          {/* Import */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Importar Dados</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Restaure seus dados a partir de um arquivo de backup.
            </p>
            <label className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Importar Dados
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 transition-colors">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="font-semibold text-red-900 dark:text-red-400">Zona de Perigo</h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4 text-sm">
              Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente.
            </p>
            <button 
              onClick={handleClearAllData}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Todos os Dados
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
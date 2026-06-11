import { useStore } from '@/store/useStore'
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  ChevronRight,
  AlertOctagon,
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react'
import { TICKET_STATUS_MAP, TICKET_TYPE_MAP } from '@/utils/constants'
import { cn } from '@/lib/utils'

const priorityMap: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  high: { label: '高优先级', icon: AlertOctagon, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  medium: { label: '中优先级', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  low: { label: '低优先级', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' }
}

export default function Exceptions() {
  const { exceptions, createException } = useStore()

  const openCount = exceptions.filter(e => e.status === 'open').length
  const processingCount = exceptions.filter(e => e.status === 'processing').length
  const resolvedCount = exceptions.filter(e => e.status === 'resolved').length
  const highPriorityCount = exceptions.filter(e => e.priority === 'high' && e.status !== 'resolved' && e.status !== 'closed').length

  const handleCreateTest = () => {
    const result = createException({
      exceptionType: 'complaint',
      title: '测试异常单',
      description: '这是一个测试创建的异常工单',
      priority: 'medium',
      reporterName: '测试用户',
      reporterPhone: '13800138000'
    })
    alert(`创建成功！工单号：${result.ticketNo}`)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">异常处理</h1>
          <p className="mt-1 text-sm text-slate-500">管理车辆损坏、丢失、投诉等异常工单</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateTest}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            测试创建
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:translate-y-[-1px] transition-all duration-200">
            <Plus className="h-4 w-4" />
            上报异常
          </button>
        </div>
      </div>

      {highPriorityCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg shadow-rose-500/30">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-rose-900">紧急待处理工单</h3>
              <p className="text-sm text-rose-700">您有 <span className="font-bold">{highPriorityCount}</span> 个高优先级工单需要立即处理</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-md hover:shadow-lg transition-all">
            立即处理 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '待处理', value: openCount, icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
          { label: '处理中', value: processingCount, icon: Clock, color: 'from-amber-500 to-orange-600' },
          { label: '已解决', value: resolvedCount, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
          { label: '高优先级', value: highPriorityCount, icon: AlertOctagon, color: 'from-violet-500 to-purple-600' }
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', item.color)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-3">
          {[
            { key: 'all', label: '全部工单', count: exceptions.length, active: true },
            { key: 'open', label: '待处理', count: openCount },
            { key: 'processing', label: '处理中', count: processingCount },
            { key: 'resolved', label: '已解决', count: resolvedCount }
          ].map(tab => (
            <button
              key={tab.key}
              className={cn(
                'w-full flex items-center justify-between rounded-xl p-3.5 text-left transition-all duration-200',
                tab.active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30'
              )}
            >
              <span className={cn('font-medium', tab.active ? 'text-white' : 'text-slate-700')}>{tab.label}</span>
              <span className={cn(
                'rounded-lg px-2.5 py-0.5 text-sm font-bold',
                tab.active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              )}>
                {tab.count}
              </span>
            </button>
          ))}

          <div className="pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">异常类型</p>
            <div className="space-y-1">
              {Object.entries(TICKET_TYPE_MAP).map(([key, type]) => {
                const count = exceptions.filter(e => e.type === key).length
                return (
                  <button key={key} className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{type.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">工单列表</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索工单号、标题..."
                  className="w-64 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                <Filter className="h-4 w-4" />
                筛选
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {exceptions.map(exc => {
              const status = TICKET_STATUS_MAP[exc.status] || { label: '未知', color: '#6b7280' }
              const type = TICKET_TYPE_MAP[exc.type] || { label: '其他', color: '#6b7280' }
              const priority = priorityMap[exc.priority] || priorityMap.low
              const PriorityIcon = priority.icon
              return (
                <div
                  key={exc.id}
                  className={cn(
                    'group rounded-xl border p-4 transition-all duration-300 cursor-pointer',
                    priority.bg,
                    'hover:shadow-md hover:translate-y-[-1px]'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm')}
                      >
                        <PriorityIcon className={cn('h-5 w-5', priority.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-slate-900">{exc.ticketNo}</span>
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `${type.color}15`, color: type.color }}
                          >
                            {type.label}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `${status.color}15`, color: status.color }}
                          >
                            {exc.status === 'open' ? <AlertCircle className="h-3 w-3" /> :
                             exc.status === 'processing' ? <Clock className="h-3 w-3" /> :
                             exc.status === 'resolved' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {status.label}
                          </span>
                          <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold bg-white', priority.color)}>
                            {priority.label}
                          </span>
                        </div>
                        <h4 className="mt-2 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{exc.title}</h4>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-1">{exc.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {exc.reporterName}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {exc.reporterPhone}
                          </span>
                          {exc.lossAmount && (
                            <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                              损失 ¥{exc.lossAmount}
                            </span>
                          )}
                          <span>{exc.createTime?.slice(0, 16)}</span>
                        </div>
                      </div>
                    </div>
                    <button className={cn(
                      'shrink-0 inline-flex items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                      exc.status === 'open'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md'
                        : 'bg-white text-slate-600 hover:text-blue-600'
                    )}>
                      {exc.status === 'open' ? '立即处理' : '查看详情'}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

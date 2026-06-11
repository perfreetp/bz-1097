import { useStore } from '@/store/useStore'
import {
  Wrench,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  DollarSign,
  ChevronRight,
  ListChecks
} from 'lucide-react'
import { MAINTENANCE_STATUS_MAP, MAINTENANCE_TYPE_MAP, VEHICLE_TYPES } from '@/utils/constants'
import { cn } from '@/lib/utils'

export default function Maintenance() {
  const { maintenance, vehicles } = useStore()

  const scheduledCount = maintenance.filter(m => m.status === 'scheduled').length
  const inProgressCount = maintenance.filter(m => m.status === 'in_progress').length
  const completedCount = maintenance.filter(m => m.status === 'completed').length
  const totalCost = maintenance.reduce((acc, m) => acc + m.cost, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">车辆维护</h1>
          <p className="mt-1 text-sm text-slate-500">跟踪车辆保养、维修与清洁记录</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:translate-y-[-1px] transition-all duration-200">
          <Plus className="h-4 w-4" />
          创建工单
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '待处理', value: scheduledCount, icon: Calendar, color: 'from-amber-500 to-orange-600', desc: '已排期' },
          { label: '进行中', value: inProgressCount, icon: Wrench, color: 'from-blue-500 to-indigo-600', desc: '维修中' },
          { label: '已完成', value: completedCount, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', desc: '本月' },
          { label: '维护成本', value: `¥${totalCost.toLocaleString()}`, icon: DollarSign, color: 'from-violet-500 to-purple-600', desc: '累计' }
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', item.color)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">维护工单</h2>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索工单号、车牌号..."
                className="w-64 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            {maintenance.map(m => {
              const vehicle = vehicles.find(v => v.id === m.vehicleId)
              const vehicleType = vehicle ? VEHICLE_TYPES[vehicle.type] : null
              const status = MAINTENANCE_STATUS_MAP[m.status]
              const type = MAINTENANCE_TYPE_MAP[m.type]
              return (
                <div
                  key={m.id}
                  className="group rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${type.color}15` }}
                      >
                        <Wrench className="h-5 w-5" style={{ color: type.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-slate-900">{m.recordNo}</span>
                          <span
                            className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `${type.color}15`, color: type.color }}
                          >
                            {type.label}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `${status.color}15`, color: status.color }}
                          >
                            {m.status === 'in_progress' ? <Clock className="h-3 w-3" /> : m.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <ListChecks className="h-3.5 w-3.5" />
                            {vehicle?.plateNumber || '未知车辆'}
                            {vehicleType && <span className="text-slate-400">· {vehicleType.name}</span>}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {m.scheduleDate}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {m.technician}
                          </span>
                        </div>
                        {m.items && m.items.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {m.items.slice(0, 3).map((item, idx) => (
                              <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {m.cost > 0 && (
                        <p className="text-lg font-bold text-slate-900">¥{m.cost}</p>
                      )}
                      <button className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        处理 <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">维护类型分布</h3>
            <div className="space-y-3">
              {Object.entries(MAINTENANCE_TYPE_MAP).map(([key, type]) => {
                const count = maintenance.filter(m => m.type === key).length
                const percent = maintenance.length > 0 ? Math.round((count / maintenance.length) * 100) : 0
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{type.label}</span>
                      <span className="text-xs font-semibold text-slate-900">{count}单 · {percent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: type.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900">即将到期保养</h4>
                <p className="mt-1 text-sm text-amber-700">
                  有 <span className="font-bold">3 辆</span> 车距离下次保养不足7天，请及时安排维护。
                </p>
                <button className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm hover:shadow-md transition-all">
                  查看详情 <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

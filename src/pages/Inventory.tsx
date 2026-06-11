import { useStore } from '@/store/useStore'
import {
  LayoutDashboard,
  Baby,
  MapPin,
  CheckCircle2,
  Clock,
  Wrench,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { VEHICLE_STATUS, VEHICLE_TYPES } from '@/utils/constants'
import { cn } from '@/lib/utils'

export default function Inventory() {
  const { vehicles, locations } = useStore()

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    inUse: vehicles.filter(v => v.status === 'in_use').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length
  }

  const occupancyRate = locations.reduce((acc, loc) => {
    const used = loc.totalSlots - loc.availableSlots
    return acc + (used / loc.totalSlots) * 100
  }, 0) / locations.length

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">库存看板</h1>
          <p className="mt-1 text-sm text-slate-500">实时掌握车辆状态与网点分布</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          实时更新中
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '车辆总数', value: stats.total, icon: Baby, color: 'from-blue-500 to-blue-600', trend: '+12%', trendUp: true },
          { label: '可用车辆', value: stats.available, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', trend: '+5%', trendUp: true },
          { label: '使用中', value: stats.inUse, icon: Clock, color: 'from-amber-500 to-amber-600', trend: '+8%', trendUp: true },
          { label: '维护中', value: stats.maintenance, icon: Wrench, color: 'from-rose-500 to-rose-600', trend: '-3%', trendUp: false }
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {item.trendUp ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    <span className={cn(
                      'text-xs font-medium',
                      item.trendUp ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                      {item.trend}
                    </span>
                    <span className="text-xs text-slate-400">较昨日</span>
                  </div>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-blue-500/20', item.color)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={cn('absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-all duration-300 group-hover:scale-125', item.color)} />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">车型分布</h2>
              <p className="text-sm text-slate-500">各类型车辆占比统计</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(VEHICLE_TYPES).map(([key, type]) => {
              const count = vehicles.filter(v => v.type === key).length
              const percent = Math.round((count / vehicles.length) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm font-medium text-slate-700">{type.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{count}辆</span>
                      <span className="text-xs text-slate-400">{percent}%</span>
                    </div>
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">车辆状态</h2>
              <p className="text-sm text-slate-500">当前各状态车辆数量</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(VEHICLE_STATUS).map(([key, status]) => {
              const count = vehicles.filter(v => v.status === key).length
              return (
                <div key={key} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:shadow-sm transition-all">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${status.color}15` }}
                  >
                    <LayoutDashboard className="h-5 w-5" style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{status.label}</p>
                    <p className="text-lg font-bold" style={{ color: status.color }}>{count}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">网点概览</h2>
            <p className="text-sm text-slate-500">各网点车辆占用情况</p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            查看全部 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.slice(0, 6).map(loc => {
            const usage = Math.round(((loc.totalSlots - loc.availableSlots) / loc.totalSlots) * 100)
            return (
              <div key={loc.id} className="group rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{loc.name}</h3>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{loc.address}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">车位占用</span>
                    <span className="font-semibold text-slate-700">{loc.totalSlots - loc.availableSlots}/{loc.totalSlots}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        usage > 80 ? 'bg-rose-500' : usage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      style={{ width: `${usage}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="rounded-lg bg-emerald-50 py-1.5">
                      <p className="text-sm font-bold text-emerald-600">{loc.availableVehicles}</p>
                      <p className="text-[10px] text-emerald-600/70">可用</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 py-1.5">
                      <p className="text-sm font-bold text-blue-600">{loc.inUseVehicles}</p>
                      <p className="text-[10px] text-blue-600/70">使用</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 py-1.5">
                      <p className="text-sm font-bold text-amber-600">{loc.maintenanceVehicles}</p>
                      <p className="text-[10px] text-amber-600/70">维护</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 p-3 text-sm text-slate-600">
          <span>全网平均占用率</span>
          <span className="font-bold text-blue-600">{occupancyRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

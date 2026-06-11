import { useStore } from '@/store/useStore'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Baby,
  Calendar,
  Download,
  ArrowRight
} from 'lucide-react'
import { VEHICLE_TYPES, LOCATION_TYPES, ORDER_STATUS_MAP } from '@/utils/constants'
import { cn } from '@/lib/utils'

export default function Reports() {
  const { reports, orders, vehicles, members, locations } = useStore()

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const activeMembers = members.filter(m => m.totalOrders > 0).length

  const last7Days = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const maxRevenue = Math.max(...last7Days.map(r => r.revenue), 1)
  const maxOrderCount = Math.max(...last7Days.map(r => r.orderCount), 1)

  const escapeCsvField = (field: string | number): string => {
    const str = String(field)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const handleExport = () => {
    const headers = [
      '订单号',
      '点位名称',
      '车型',
      '租金',
      '超时费',
      '押金退款',
      '下单时间',
      '订单状态'
    ]

    const rows = orders.map(order => {
      const location = locations.find(loc => loc.id === order.locationId)
      const vehicle = vehicles.find(v => v.id === order.vehicleId)
      const vehicleType = vehicle ? VEHICLE_TYPES[vehicle.type]?.name : '-'
      const baseRent = order.baseRent ?? order.baseAmount ?? 0
      const overtimeFee = order.overtimeFee ?? order.overtimeAmount ?? 0
      const refundAmount = order.status === 'settled' && order.refundAmount !== undefined
        ? order.refundAmount
        : '-'
      const orderTime = order.createdAt || order.pickUpTime || '-'
      const statusLabel = ORDER_STATUS_MAP[order.status]?.label || order.status

      return [
        order.orderNo,
        location?.name || '-',
        vehicleType,
        baseRent,
        overtimeFee,
        refundAmount,
        orderTime,
        statusLabel
      ].map(escapeCsvField).join(',')
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const fileName = `童车租赁收入明细_${year}${month}${day}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">报表中心</h1>
          <p className="mt-1 text-sm text-slate-500">运营数据可视化，助力业务决策</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Calendar className="h-4 w-4" />
            近7天
            <ArrowRight className="h-3.5 w-3.5 rotate-90" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:translate-y-[-1px] transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '总营收', value: `¥${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', trend: '+18.5%', trendUp: true },
          { label: '订单总数', value: totalOrders, icon: BarChart3, color: 'from-blue-500 to-indigo-600', trend: '+12.3%', trendUp: true },
          { label: '客单价', value: `¥${avgOrderValue.toFixed(0)}`, icon: TrendingUp, color: 'from-violet-500 to-purple-600', trend: '+5.2%', trendUp: true },
          { label: '活跃会员', value: activeMembers, icon: Users, color: 'from-amber-500 to-orange-600', trend: '+9.1%', trendUp: true }
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-600">{item.trend}</span>
                  </div>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', item.color)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={cn('absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 blur-3xl transition-all duration-300 group-hover:scale-125', item.color)} />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">营收趋势</h2>
              <p className="text-sm text-slate-500">近7天每日营收与订单数</p>
            </div>
          </div>

          <div className="flex h-64 items-end gap-3">
            {last7Days.map((day, idx) => {
              const heightPercent = (day.revenue / maxRevenue) * 100
              const date = new Date(day.date)
              const dayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
              return (
                <div key={idx} className="group flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-52 gap-1">
                    <span className="text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ¥{day.revenue.toLocaleString()}
                    </span>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:from-blue-500 group-hover:to-indigo-400 cursor-pointer relative"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700">{dayLabels[date.getDay()]}</p>
                    <p className="text-[10px] text-slate-400">{day.date.slice(5)}</p>
                    <p className="text-[10px] font-medium text-blue-600 mt-0.5">{day.orderCount}单</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">车型营收占比</h3>
            <div className="space-y-4">
              {Object.entries(VEHICLE_TYPES).map(([key, type]) => {
                const typeOrders = orders.filter(o => {
                  const v = vehicles.find(veh => veh.id === o.vehicleId)
                  return v?.type === key
                })
                const revenue = typeOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)
                const percent = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: type.color }} />
                        <span className="text-sm font-medium text-slate-700">{type.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">¥{revenue.toLocaleString()}</span>
                        <span className="ml-1 text-xs text-slate-400">{percent}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${percent}%`, backgroundColor: type.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">网点订单分布</h3>
            <div className="space-y-3">
              {locations.slice(0, 5).map(loc => {
                const locOrders = orders.filter(o => o.locationId === loc.id)
                const percent = totalOrders > 0 ? Math.round((locOrders.length / totalOrders) * 100) : 0
                const locType = LOCATION_TYPES[loc.type]
                return (
                  <div key={loc.id} className="group rounded-xl p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">{locType?.icon}</span>
                        <span className="text-sm font-medium text-slate-700 truncate">{loc.name}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600 shrink-0">{locOrders.length}单</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">每日运营数据</h2>
              <p className="text-sm text-slate-500">详细的每日指标明细</p>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1">
              查看全部 <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">日期</th>
                  <th className="px-4 py-3">订单</th>
                  <th className="px-4 py-3">营收</th>
                  <th className="px-4 py-3">新增会员</th>
                  <th className="px-4 py-3">使用率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {last7Days.map((day, idx) => {
                  const date = new Date(day.date)
                  const dayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                  const utilizationRate = Math.round((day.orderCount / maxOrderCount) * 100)
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{dayLabels[date.getDay()]}</p>
                          <p className="text-xs text-slate-500">{day.date.slice(5)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-900">{day.orderCount}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-emerald-600">¥{day.revenue.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-violet-600">+{day.newMembers}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                utilizationRate > 70 ? 'bg-emerald-500' :
                                utilizationRate > 50 ? 'bg-amber-500' : 'bg-blue-500'
                              )}
                              style={{ width: `${utilizationRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{utilizationRate}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">运营洞察</h2>
              <p className="text-sm text-slate-500">基于数据的智能建议</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
              <Baby className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-3">
            {[
              { title: '周末营收增长显著', desc: '周末订单量比工作日高出45%，建议增加周末排班人手。', type: 'success' },
              { title: '电动车型需求上升', desc: '电动童车近7天使用率达82%，建议扩充该车型库存。', type: 'info' },
              { title: '商场网点表现优异', desc: '商场类网点贡献了60%的营收，可考虑拓展合作。', type: 'success' },
              { title: '超时订单有所增加', desc: '超时费用环比增长15%，可优化提醒机制减少纠纷。', type: 'warning' }
            ].map((insight, idx) => (
              <div
                key={idx}
                className={cn(
                  'group rounded-xl p-4 transition-all duration-200 cursor-pointer hover:translate-x-1',
                  insight.type === 'success' && 'bg-white/80 border border-emerald-200/50 hover:shadow-md hover:shadow-emerald-500/10',
                  insight.type === 'info' && 'bg-white/80 border border-blue-200/50 hover:shadow-md hover:shadow-blue-500/10',
                  insight.type === 'warning' && 'bg-white/80 border border-amber-200/50 hover:shadow-md hover:shadow-amber-500/10'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    insight.type === 'success' && 'bg-emerald-100 text-emerald-600',
                    insight.type === 'info' && 'bg-blue-100 text-blue-600',
                    insight.type === 'warning' && 'bg-amber-100 text-amber-600'
                  )}>
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{insight.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{insight.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

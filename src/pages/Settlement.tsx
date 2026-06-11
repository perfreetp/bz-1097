import { useStore } from '@/store/useStore'
import {
  Wallet,
  Receipt,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowDownUp,
  Sparkles,
  ChevronRight,
  CreditCard,
  Banknote,
  RotateCcw
} from 'lucide-react'
import { SETTLEMENT_STATUS_MAP } from '@/utils/constants'
import { cn } from '@/lib/utils'

const refundMethodMap: Record<string, { label: string; icon: any; color: string }> = {
  original: { label: '原路退回', icon: RotateCcw, color: 'text-blue-600 bg-blue-50' },
  balance: { label: '充值余额', icon: Wallet, color: 'text-amber-600 bg-amber-50' },
  cash: { label: '现金退还', icon: Banknote, color: 'text-emerald-600 bg-emerald-50' },
  transfer: { label: '银行转账', icon: CreditCard, color: 'text-violet-600 bg-violet-50' }
}

export default function Settlement() {
  const { settlements, orders, settlePayment } = useStore()

  const pendingCount = settlements.filter(s => s.status === 'pending').length
  const completedCount = settlements.filter(s => s.status === 'completed' || s.status === 'settled').length
  const exceptionCount = settlements.filter(s => s.status === 'exception' || s.status === 'disputed').length
  const totalRefund = settlements.reduce((acc, s) => acc + (s.refundAmount || 0), 0)

  const handleSettle = (orderId: string) => {
    const result = settlePayment({
      orderId,
      refundMethod: 'original',
      operator: '张管理员'
    })
    if (result) {
      alert(`结算成功！结算单号：${result.settlementNo}`)
    } else {
      alert('结算失败，请检查订单状态')
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">押金结算</h1>
        <p className="mt-1 text-sm text-slate-500">管理押金退还与订单资金结算</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '待结算', value: pendingCount, icon: Clock, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '已结算', value: completedCount, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '异常单', value: exceptionCount, icon: AlertTriangle, color: 'from-rose-500 to-red-600', textColor: 'text-rose-600', bg: 'bg-rose-50' },
          { label: '累计退款', value: `¥${totalRefund.toLocaleString()}`, icon: Wallet, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600', bg: 'bg-blue-50' }
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">结算记录</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索结算单、订单号..."
                className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <Filter className="h-4 w-4" />
              筛选
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <ArrowDownUp className="h-4 w-4" />
              排序
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">结算单号</th>
                <th className="px-5 py-4">关联订单</th>
                <th className="px-5 py-4">押金金额</th>
                <th className="px-5 py-4">费用扣除</th>
                <th className="px-5 py-4">退款金额</th>
                <th className="px-5 py-4">退款方式</th>
                <th className="px-5 py-4">状态</th>
                <th className="px-5 py-4">结算时间</th>
                <th className="px-5 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map(s => {
                const status = SETTLEMENT_STATUS_MAP[s.status]
                const refundMethod = refundMethodMap[s.refundMethod] || refundMethodMap.original
                const RefundIcon = refundMethod.icon
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-blue-600">
                        <Receipt className="h-3.5 w-3.5" />
                        {s.settlementNo}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-slate-700">{s.orderNo}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">¥{s.deposit}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          租金 ¥{s.baseRent} · 超时 ¥{s.overtimeFee}
                          {s.damageFee > 0 && ` · 损坏 ¥${s.damageFee}`}
                        </div>
                        <div className="text-sm font-semibold text-rose-600">-¥{s.totalDeduction}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-lg font-bold text-emerald-600">¥{s.refundAmount}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold', refundMethod.color)}>
                        <RefundIcon className="h-3.5 w-3.5" />
                        {refundMethod.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        style={{ backgroundColor: `${status.color}15`, color: status.color }}
                      >
                        {s.status === 'pending' ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{s.settleTime?.slice(0, 16) || '-'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {(s.status === 'pending' || !s.status) ? (
                        <button
                          onClick={() => handleSettle(s.orderId)}
                          className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-all"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          立即结算
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                          详情
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

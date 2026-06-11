import { useState, useMemo } from 'react'
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
  RotateCcw,
  X,
  Clock4,
  CalendarClock,
  Car,
  MapPin,
  User,
  AlertCircle,
  Check,
  RefreshCw
} from 'lucide-react'
import { SETTLEMENT_STATUS_MAP, ORDER_STATUS_MAP, VEHICLE_TYPES } from '@/utils/constants'
import type { RefundMethod } from '@/utils/constants'
import { calculateOvertimeFee, calculateBaseRent, calculateActualRefund } from '@/utils/calculators'
import { formatDurationText, formatCurrency } from '@/utils/formatters'
import { cn } from '@/lib/utils'
import type { Order } from '@/data/mockData'

type TabKey = 'active' | 'pending' | 'settled'

const refundMethodMap: Record<RefundMethod, { label: string; icon: any; color: string }> = {
  original: { label: '原路退回', icon: RotateCcw, color: 'text-blue-600 bg-blue-50' },
  balance: { label: '充值余额', icon: Wallet, color: 'text-amber-600 bg-amber-50' },
  cash: { label: '现金退还', icon: Banknote, color: 'text-emerald-600 bg-emerald-50' },
  transfer: { label: '银行转账', icon: CreditCard, color: 'text-violet-600 bg-violet-50' }
}

export default function Settlement() {
  const { orders, settlements, vehicles, locations, members, extendOrder, returnVehicle, settlePayment } = useStore()

  const [activeTab, setActiveTab] = useState<TabKey>('active')

  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [returnModalOpen, setReturnModalOpen] = useState(false)
  const [settleModalOpen, setSettleModalOpen] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [extendEndTime, setExtendEndTime] = useState('')
  const [returnTime, setReturnTime] = useState('')
  const [hasDamage, setHasDamage] = useState(false)
  const [damageFee, setDamageFee] = useState('')
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('original')

  const [successToast, setSuccessToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' })

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status === 'active' || o.status === 'extended' || o.status === 'ongoing')
  }, [orders])

  const pendingOrders = useMemo(() => {
    const settledOrderIds = new Set(settlements.map(s => s.orderId))
    return orders.filter(o => o.status === 'returned' && !settledOrderIds.has(o.id))
  }, [orders, settlements])

  const showSuccess = (message: string) => {
    setSuccessToast({ show: true, message })
    setTimeout(() => setSuccessToast({ show: false, message: '' }), 2500)
  }

  const openExtendModal = (order: Order) => {
    setSelectedOrder(order)
    const defaultEnd = new Date(order.endTime)
    defaultEnd.setHours(defaultEnd.getHours() + 2)
    setExtendEndTime(defaultEnd.toISOString().slice(0, 16))
    setExtendModalOpen(true)
  }

  const handleExtend = () => {
    if (!selectedOrder || !extendEndTime) return
    const newEndTime = new Date(extendEndTime).toISOString()
    const result = extendOrder({
      orderId: selectedOrder.id,
      newEndTime
    })
    if (result) {
      showSuccess('订单延长成功！')
      setExtendModalOpen(false)
      setSelectedOrder(null)
    } else {
      alert('延长订单失败，请检查订单状态')
    }
  }

  const extendPriceDiff = useMemo(() => {
    if (!selectedOrder || !extendEndTime) return 0
    const vehicle = vehicles.find(v => v.id === selectedOrder.vehicleId)
    if (!vehicle) return 0
    const newBaseRent = calculateBaseRent({
      pickUpTime: selectedOrder.startTime,
      expectedReturnTime: new Date(extendEndTime).toISOString(),
      vehicleType: vehicle.type
    })
    return Math.max(0, newBaseRent - selectedOrder.baseRent)
  }, [selectedOrder, extendEndTime, vehicles])

  const openReturnModal = (order: Order) => {
    setSelectedOrder(order)
    const now = new Date()
    setReturnTime(now.toISOString().slice(0, 16))
    setHasDamage(false)
    setDamageFee('')
    setReturnModalOpen(true)
  }

  const handleReturn = () => {
    if (!selectedOrder || !returnTime) return
    const actualEndTime = new Date(returnTime).toISOString()
    const damageFeeNum = hasDamage ? parseFloat(damageFee) || 0 : 0
    const result = returnVehicle({
      orderId: selectedOrder.id,
      actualEndTime,
      damageFee: damageFeeNum
    })
    if (result) {
      showSuccess('车辆归还成功！')
      setReturnModalOpen(false)
      setSelectedOrder(null)
    } else {
      alert('归还车辆失败，请检查订单状态')
    }
  }

  const returnFeeCalculation = useMemo(() => {
    if (!selectedOrder || !returnTime) return { overtimeFee: 0, totalDeduction: 0, refundAmount: 0 }
    const vehicle = vehicles.find(v => v.id === selectedOrder.vehicleId)
    if (!vehicle) return { overtimeFee: 0, totalDeduction: 0, refundAmount: 0 }
    const actualEndTime = new Date(returnTime).toISOString()
    const overtimeFee = calculateOvertimeFee({
      expectedReturnTime: selectedOrder.endTime,
      actualReturnTime: actualEndTime,
      vehicleType: vehicle.type
    })
    const damageFeeNum = hasDamage ? parseFloat(damageFee) || 0 : 0
    const totalDeduction = overtimeFee + damageFeeNum
    const refundAmount = calculateActualRefund({
      depositAmount: selectedOrder.deposit,
      overtimeAmount: overtimeFee,
      damageLoss: damageFeeNum
    })
    return { overtimeFee, totalDeduction, refundAmount }
  }, [selectedOrder, returnTime, hasDamage, damageFee, vehicles])

  const openSettleModal = (order: Order) => {
    setSelectedOrder(order)
    setRefundMethod('original')
    setSettleModalOpen(true)
  }

  const handleSettle = () => {
    if (!selectedOrder) return
    const result = settlePayment({
      orderId: selectedOrder.id,
      refundMethod,
      operator: '张管理员'
    })
    if (result) {
      showSuccess(`结算成功！结算单号：${result.settlementNo}`)
      setSettleModalOpen(false)
      setSelectedOrder(null)
    } else {
      alert('结算失败，请检查订单状态')
    }
  }

  const getVehicleInfo = (order: Order) => {
    const vehicle = vehicles.find(v => v.id === order.vehicleId)
    return vehicle || null
  }

  const getLocationInfo = (order: Order) => {
    const location = locations.find(l => l.id === order.locationId)
    return location || null
  }

  const getMemberInfo = (order: Order) => {
    if (!order.memberId) return null
    const member = members.find(m => m.id === order.memberId)
    return member || null
  }

  const getUsedDuration = (order: Order) => {
    const start = new Date(order.startTime).getTime()
    const now = Date.now()
    const diffMs = Math.max(0, now - start)
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const pendingCount = pendingOrders.length
  const settledCount = settlements.filter(s => s.status === 'completed' || s.status === 'settled').length
  const activeCount = activeOrders.length
  const totalRefund = settlements.reduce((acc, s) => acc + (s.refundAmount || 0), 0)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">押金结算</h1>
        <p className="mt-1 text-sm text-slate-500">管理订单操作与押金退还结算</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '进行中订单', value: activeCount, icon: Clock4, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '待结算', value: pendingCount, icon: Clock, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '已结算', value: settledCount, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '累计退款', value: `¥${totalRefund.toLocaleString()}`, icon: Wallet, color: 'from-violet-500 to-purple-600', textColor: 'text-violet-600', bg: 'bg-violet-50' }
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

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-1 p-2 border-b border-slate-200">
          {[
            { key: 'active' as TabKey, label: '进行中订单', icon: Clock4 },
            { key: 'pending' as TabKey, label: '待结算', icon: Clock },
            { key: 'settled' as TabKey, label: '已结算', icon: CheckCircle2 }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.key === 'active' && activeCount > 0 && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                  )}>{activeCount}</span>
                )}
                {tab.key === 'pending' && pendingCount > 0 && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'
                  )}>{pendingCount}</span>
                )}
                {tab.key === 'settled' && settledCount > 0 && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'
                  )}>{settledCount}</span>
                )}
              </button>
            )
          })}
        </div>

        {activeTab === 'active' && (
          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">进行中订单</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索订单号、客户名..."
                    className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                  <Filter className="h-4 w-4" />
                  筛选
                </button>
              </div>
            </div>

            {activeOrders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                  <Clock4 className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500">暂无进行中的订单</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map(order => {
                  const vehicle = getVehicleInfo(order)
                  const location = getLocationInfo(order)
                  const member = getMemberInfo(order)
                  const vehicleType = vehicle ? VEHICLE_TYPES[vehicle.type] : null
                  const statusConfig = ORDER_STATUS_MAP[order.status]
                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md hover:shadow-slate-200/50 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-blue-600">
                              <Receipt className="h-3.5 w-3.5" />
                              {order.orderNo}
                            </span>
                            <span
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                              style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}
                            >
                              {statusConfig.label}
                            </span>
                            {vehicleType && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                                style={{ backgroundColor: `${vehicleType.color}15`, color: vehicleType.color }}
                              >
                                <Car className="h-3 w-3" />
                                {vehicleType.name}
                                {vehicle?.plateNumber && ` · ${vehicle.plateNumber}`}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="truncate">{location?.name || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <User className="h-4 w-4 text-slate-400" />
                              <span>{member?.name || order.parentName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <CalendarClock className="h-4 w-4 text-slate-400" />
                              <span>取车：{order.pickUpTime?.slice(5, 16) || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span>已用：{getUsedDuration(order)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">预计归还：</span>
                              <span className="font-medium text-slate-700">{order.expectedReturnTime?.slice(5, 16) || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">押金：</span>
                              <span className="font-semibold text-amber-600">¥{order.deposit}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                          <button
                            onClick={() => openExtendModal(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            延长订单
                          </button>
                          <button
                            onClick={() => openReturnModal(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            确认归还
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">待结算订单</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索订单号、客户名..."
                    className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                  <ArrowDownUp className="h-4 w-4" />
                  排序
                </button>
              </div>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-slate-500">暂无待结算订单</p>
                <p className="text-sm text-slate-400 mt-1">所有已归还订单都已完成结算</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map(order => {
                  const vehicle = getVehicleInfo(order)
                  const location = getLocationInfo(order)
                  const member = getMemberInfo(order)
                  const vehicleType = vehicle ? VEHICLE_TYPES[vehicle.type] : null
                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/30 p-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-blue-600">
                              <Receipt className="h-3.5 w-3.5" />
                              {order.orderNo}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 text-amber-700 px-2.5 py-1 text-xs font-semibold">
                              <AlertCircle className="h-3 w-3" />
                              待结算
                            </span>
                            {vehicleType && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                                style={{ backgroundColor: `${vehicleType.color}15`, color: vehicleType.color }}
                              >
                                <Car className="h-3 w-3" />
                                {vehicleType.name}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="truncate">{location?.name || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <User className="h-4 w-4 text-slate-400" />
                              <span>{member?.name || order.parentName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span>归还：{order.actualReturnTime?.slice(5, 16) || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <span className="text-slate-500">时长：</span>
                              <span className="font-medium">{formatDurationText(order.startTime, order.actualEndTime || order.endTime)}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">押金：</span>
                              <span className="font-semibold text-amber-600">¥{order.deposit}</span>
                            </div>
                            {order.overtimeFee > 0 && (
                              <div>
                                <span className="text-slate-500">超时费：</span>
                                <span className="font-medium text-rose-600">-¥{order.overtimeFee}</span>
                              </div>
                            )}
                            {order.damageFee > 0 && (
                              <div>
                                <span className="text-slate-500">损坏费：</span>
                                <span className="font-medium text-rose-600">-¥{order.damageFee}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-500">应退：</span>
                              <span className="font-bold text-emerald-600">¥{(order.refundAmount ?? order.deposit - order.overtimeFee - order.damageFee).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openSettleModal(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all"
                          >
                            <Sparkles className="h-4 w-4" />
                            立即结算
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settled' && (
          <div className="p-6">
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
                          <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            详情
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {extendModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">延长订单</h3>
              <button
                onClick={() => { setExtendModalOpen(false); setSelectedOrder(null) }}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Receipt className="h-4 w-4" />
                  <span className="font-mono text-sm font-semibold">{selectedOrder.orderNo}</span>
                </div>
                <div className="text-sm text-blue-600">
                  当前预计归还时间：{selectedOrder.expectedReturnTime?.slice(0, 16)}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  新的预计归还时间
                </label>
                <input
                  type="datetime-local"
                  value={extendEndTime}
                  onChange={e => setExtendEndTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">原租金</span>
                  <span className="text-sm font-medium text-slate-700">¥{selectedOrder.baseRent}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">延长后租金</span>
                  <span className="text-sm font-medium text-slate-700">¥{(selectedOrder.baseRent + extendPriceDiff).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 my-3"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">需补差价</span>
                  <span className="text-lg font-bold text-amber-600">+¥{extendPriceDiff.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() => { setExtendModalOpen(false); setSelectedOrder(null) }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleExtend}
                disabled={!extendEndTime}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认延长
              </button>
            </div>
          </div>
        </div>
      )}

      {returnModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-slate-900">确认归还</h3>
              <button
                onClick={() => { setReturnModalOpen(false); setSelectedOrder(null) }}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <Receipt className="h-4 w-4" />
                  <span className="font-mono text-sm font-semibold">{selectedOrder.orderNo}</span>
                </div>
                <div className="text-sm text-emerald-600">
                  预计归还时间：{selectedOrder.expectedReturnTime?.slice(0, 16)}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  实际归还时间
                </label>
                <input
                  type="datetime-local"
                  value={returnTime}
                  onChange={e => setReturnTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">是否有损坏</span>
                  <button
                    onClick={() => { setHasDamage(!hasDamage); if (hasDamage) setDamageFee('') }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      hasDamage ? 'bg-rose-500' : 'bg-slate-200'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        hasDamage ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
                {hasDamage && (
                  <div className="pt-3 border-t border-slate-100">
                    <label className="text-sm text-slate-600 mb-2 block">损坏费用</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                      <input
                        type="number"
                        value={damageFee}
                        onChange={e => setDamageFee(e.target.value)}
                        placeholder="请输入损坏费用"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-4 py-2.5 text-sm focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">费用明细</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">押金金额</span>
                    <span className="font-medium text-slate-700">¥{selectedOrder.deposit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">超时费</span>
                    <span className="font-medium text-rose-600">-¥{returnFeeCalculation.overtimeFee.toFixed(2)}</span>
                  </div>
                  {hasDamage && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">损坏费</span>
                      <span className="font-medium text-rose-600">-¥{(parseFloat(damageFee) || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 my-2"></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">总扣费</span>
                    <span className="font-semibold text-rose-600">-¥{returnFeeCalculation.totalDeduction.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">应退押金</span>
                    <span className="text-xl font-bold text-emerald-600">¥{returnFeeCalculation.refundAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                onClick={() => { setReturnModalOpen(false); setSelectedOrder(null) }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReturn}
                disabled={!returnTime}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认归还
              </button>
            </div>
          </div>
        </div>
      )}

      {settleModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">选择退款方式</h3>
              <button
                onClick={() => { setSettleModalOpen(false); setSelectedOrder(null) }}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <Receipt className="h-4 w-4" />
                  <span className="font-mono text-sm font-semibold">{selectedOrder.orderNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-600">应退金额</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ¥{(selectedOrder.refundAmount ?? selectedOrder.deposit - selectedOrder.overtimeFee - selectedOrder.damageFee).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">退款方式</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(refundMethodMap) as RefundMethod[]).map(method => {
                    const info = refundMethodMap[method]
                    const Icon = info.icon
                    const isSelected = refundMethod === method
                    return (
                      <button
                        key={method}
                        onClick={() => setRefundMethod(method)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                      >
                        <div className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-blue-700' : 'text-slate-700'
                        )}>{info.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() => { setSettleModalOpen(false); setSelectedOrder(null) }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSettle}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all"
              >
                确认结算
              </button>
            </div>
          </div>
        </div>
      )}

      {successToast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{successToast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

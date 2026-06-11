import { useState } from 'react'
import { useStore } from '@/store/useStore'
import {
  QrCode,
  Plus,
  Calendar,
  User,
  Phone,
  Baby as BabyIcon,
  MapPin,
  Clock,
  CreditCard,
  Sparkles
} from 'lucide-react'
import { VEHICLE_TYPES, VEHICLE_STATUS } from '@/utils/constants'
import { cn } from '@/lib/utils'

export default function Rental() {
  const { vehicles, locations, members, createOrder } = useStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    vehicleId: '',
    locationId: '',
    startTime: '',
    endTime: '',
    rentalType: 'hourly' as 'hourly' | 'daily',
    paymentMethod: 'wechat' as 'wechat' | 'alipay' | 'card' | 'balance',
    childAge: 3,
    parentName: '',
    parentPhone: '',
    memberId: ''
  })

  const availableVehicles = vehicles.filter(v => v.status === 'available')
  const selectedVehicle = vehicles.find(v => v.id === form.vehicleId)

  const handleCreateOrder = () => {
    if (!selectedVehicle || !form.locationId) return
    try {
      const order = createOrder({
        vehicleId: form.vehicleId,
        locationId: form.locationId,
        startTime: form.startTime,
        endTime: form.endTime,
        rentalType: form.rentalType,
        paymentMethod: form.paymentMethod,
        childAge: form.childAge,
        parentName: form.parentName,
        parentPhone: form.parentPhone,
        memberId: form.memberId || undefined
      })
      alert(`下单成功！订单号：${order.orderNo}`)
      setStep(1)
      setForm({
        vehicleId: '',
        locationId: '',
        startTime: '',
        endTime: '',
        rentalType: 'hourly',
        paymentMethod: 'wechat',
        childAge: 3,
        parentName: '',
        parentPhone: '',
        memberId: ''
      })
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">租赁下单</h1>
        <p className="mt-1 text-sm text-slate-500">快速创建租赁订单，支持扫码与手动下单</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">扫码下单</h2>
                <p className="text-xs text-slate-500">扫描车辆二维码快速创建订单</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-4">
                <QrCode className="h-10 w-10" />
              </div>
              <p className="text-sm font-medium text-slate-700">点击开始扫码</p>
              <p className="mt-1 text-xs text-slate-500">支持车辆RFID标签扫描</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">下单进度</h3>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">步骤 {step}/4</span>
            </div>
            <div className="space-y-3">
              {[
                { num: 1, label: '选择取车网点' },
                { num: 2, label: '选择可用车辆' },
                { num: 3, label: '填写订单信息' },
                { num: 4, label: '确认并支付' }
              ].map(s => (
                <div key={s.num} className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                    step >= s.num
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-400'
                  )}>
                    {step > s.num ? <Sparkles className="h-4 w-4" /> : s.num}
                  </div>
                  <span className={cn(
                    'text-sm transition-colors',
                    step >= s.num ? 'text-slate-900 font-medium' : 'text-slate-400'
                  )}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">手动下单</h2>

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                取车网点 <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.locationId}
                onChange={e => {
                  setForm({ ...form, locationId: e.target.value })
                  if (e.target.value && step === 1) setStep(2)
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">请选择取车网点...</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} - 可用{loc.availableVehicles}辆
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <BabyIcon className="h-4 w-4 text-slate-400" />
                选择车辆 <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableVehicles.slice(0, 6).map(v => {
                  const type = VEHICLE_TYPES[v.type]
                  const isSelected = form.vehicleId === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setForm({ ...form, vehicleId: v.id })
                        if (form.locationId && step === 2) setStep(3)
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10'
                          : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-white hover:shadow-sm'
                      )}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${type.color}15` }}
                      >
                        <BabyIcon className="h-5 w-5" style={{ color: type.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 truncate">{v.plateNumber}</p>
                          <span
                            className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                            style={{ backgroundColor: `${type.color}15`, color: type.color }}
                          >
                            {type.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ¥{type.hourlyRate}/小时 · ¥{type.dailyRate}/天
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500">
                          <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  开始时间
                </label>
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  预计归还
                </label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="h-4 w-4 text-slate-400" />
                  家长姓名
                </label>
                <input
                  type="text"
                  value={form.parentName}
                  onChange={e => {
                    setForm({ ...form, parentName: e.target.value })
                    if (e.target.value && form.parentPhone && step === 3) setStep(4)
                  }}
                  placeholder="请输入家长姓名"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  联系电话
                </label>
                <input
                  type="tel"
                  value={form.parentPhone}
                  onChange={e => {
                    setForm({ ...form, parentPhone: e.target.value })
                    if (e.target.value && form.parentName && step === 3) setStep(4)
                  }}
                  placeholder="请输入联系电话"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <CreditCard className="h-4 w-4 text-slate-400" />
                支付方式
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'wechat', label: '微信支付', color: 'text-emerald-600 bg-emerald-50' },
                  { key: 'alipay', label: '支付宝', color: 'text-blue-600 bg-blue-50' },
                  { key: 'card', label: '银行卡', color: 'text-violet-600 bg-violet-50' },
                  { key: 'balance', label: '余额', color: 'text-amber-600 bg-amber-50' }
                ].map(pm => (
                  <button
                    key={pm.key}
                    onClick={() => setForm({ ...form, paymentMethod: pm.key as any })}
                    className={cn(
                      'rounded-xl border-2 py-3 text-sm font-medium transition-all',
                      form.paymentMethod === pm.key
                        ? `${pm.color} border-current shadow-sm`
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-white'
                    )}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 p-5">
            <div>
              <p className="text-sm text-slate-500">预估费用</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                ¥{selectedVehicle ? (form.rentalType === 'hourly' ? selectedVehicle.hourlyRate : selectedVehicle.dailyRate) : 0}
                <span className="text-sm font-normal text-slate-500 ml-1">起</span>
              </p>
              {selectedVehicle && (
                <p className="mt-1 text-xs text-slate-500">
                  押金 ¥{VEHICLE_TYPES[selectedVehicle.type].deposit} · 需在取车时支付
                </p>
              )}
            </div>
            <button
              onClick={handleCreateOrder}
              disabled={!form.locationId || !form.vehicleId || !form.parentName || !form.parentPhone}
              className={cn(
                'flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white transition-all duration-200',
                form.locationId && form.vehicleId && form.parentName && form.parentPhone
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:translate-y-[-1px]'
                  : 'bg-slate-300 cursor-not-allowed'
              )}
            >
              <Plus className="h-5 w-5" />
              确认下单
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

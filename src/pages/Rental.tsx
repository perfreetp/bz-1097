import { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import {
  QrCode,
  MapPin,
  Baby as BabyIcon,
  Clock,
  Calendar,
  User,
  Phone,
  CreditCard,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Crown,
  Wallet
} from 'lucide-react'
import { VEHICLE_TYPES, MEMBER_TAGS } from '@/utils/constants'
import { cn } from '@/lib/utils'
import { calculateBaseRent, calculateDiscount, calculateVehicleDeposit } from '@/utils/calculators'
import type { Vehicle, Member } from '@/data/mockData'

interface FormErrors {
  locationId?: string
  vehicleId?: string
  startTime?: string
  endTime?: string
  childAge?: string
  parentName?: string
  parentPhone?: string
}

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
    memberPhone: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [matchedMember, setMatchedMember] = useState<Member | null>(null)

  const availableVehicles = useMemo(() => {
    if (!form.locationId) return []
    return vehicles.filter(v => v.locationId === form.locationId && v.status === 'available')
  }, [vehicles, form.locationId])

  const selectedVehicle = useMemo(
    () => vehicles.find(v => v.id === form.vehicleId) || null,
    [vehicles, form.vehicleId]
  )

  const selectedLocation = useMemo(
    () => locations.find(l => l.id === form.locationId) || null,
    [locations, form.locationId]
  )

  const baseRent = useMemo(() => {
    if (!selectedVehicle || !form.startTime || !form.endTime) return 0
    try {
      return calculateBaseRent({
        pickUpTime: form.startTime,
        expectedReturnTime: form.endTime,
        vehicleType: selectedVehicle.type
      })
    } catch {
      return 0
    }
  }, [selectedVehicle, form.startTime, form.endTime])

  const deposit = useMemo(() => {
    if (!selectedVehicle) return 0
    return calculateVehicleDeposit(selectedVehicle.type)
  }, [selectedVehicle])

  const memberTagConfig = useMemo(() => {
    if (!matchedMember || matchedMember.tags.length === 0) return undefined
    return MEMBER_TAGS[matchedMember.tags[0]]
  }, [matchedMember])

  const discountAmount = useMemo(() => {
    return calculateDiscount(baseRent, memberTagConfig)
  }, [baseRent, memberTagConfig])

  const actualRent = useMemo(() => {
    return Math.round((baseRent - discountAmount) * 100) / 100
  }, [baseRent, discountAmount])

  const totalPayment = useMemo(() => {
    return Math.round((actualRent + deposit) * 100) / 100
  }, [actualRent, deposit])

  const validateStep = (stepNum: number): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (stepNum >= 1) {
      if (!form.locationId) {
        newErrors.locationId = '请选择取车网点'
        isValid = false
      }
    }

    if (stepNum >= 2) {
      if (!form.vehicleId) {
        newErrors.vehicleId = '请选择车辆'
        isValid = false
      }
    }

    if (stepNum >= 3) {
      if (!form.startTime) {
        newErrors.startTime = '请选择开始时间'
        isValid = false
      } else {
        const startDate = new Date(form.startTime)
        const now = new Date()
        if (startDate < now) {
          newErrors.startTime = '开始时间不能早于当前时间'
          isValid = false
        }
      }

      if (!form.endTime) {
        newErrors.endTime = '请选择预计归还时间'
        isValid = false
      } else if (form.startTime) {
        const startDate = new Date(form.startTime)
        const endDate = new Date(form.endTime)
        const diffMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60)
        if (diffMinutes < 30) {
          newErrors.endTime = '归还时间必须晚于开始时间至少30分钟'
          isValid = false
        }
      }

      if (!form.childAge || form.childAge < 1 || form.childAge > 12) {
        newErrors.childAge = '儿童年龄必须在1-12岁之间'
        isValid = false
      }

      if (!form.parentName || form.parentName.trim().length < 2) {
        newErrors.parentName = '家长姓名至少2个字符'
        isValid = false
      }

      const phoneRegex = /^1[3-9]\d{9}$/
      if (!form.parentPhone || !phoneRegex.test(form.parentPhone)) {
        newErrors.parentPhone = '请输入有效的11位手机号'
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleMemberPhoneChange = (phone: string) => {
    setForm({ ...form, memberPhone: phone })
    if (phone.length === 11) {
      const member = members.find(m => m.phone === phone)
      setMatchedMember(member || null)
    } else {
      setMatchedMember(null)
    }
  }

  const handleCreateOrder = () => {
    if (!validateStep(3)) return
    if (!selectedVehicle) return

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
        memberId: matchedMember?.id || undefined
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
        memberPhone: ''
      })
      setMatchedMember(null)
      setErrors({})
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const canSubmit = useMemo(() => {
    return (
      form.locationId &&
      form.vehicleId &&
      form.startTime &&
      form.endTime &&
      form.childAge >= 1 &&
      form.childAge <= 12 &&
      form.parentName.trim().length >= 2 &&
      /^1[3-9]\d{9}$/.test(form.parentPhone) &&
      new Date(form.endTime) > new Date(form.startTime) &&
      (new Date(form.endTime).getTime() - new Date(form.startTime).getTime()) / (1000 * 60) >= 30 &&
      new Date(form.startTime) >= new Date()
    )
  }, [form])

  const steps = [
    { num: 1, label: '选择网点' },
    { num: 2, label: '选择车辆' },
    { num: 3, label: '填写信息' },
    { num: 4, label: '确认支付' }
  ]

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, index) => (
        <div key={s.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                step > s.num
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30'
                  : step === s.num
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400'
              )}
            >
              {step > s.num ? <Check className="h-5 w-5" /> : s.num}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium transition-colors',
                step >= s.num ? 'text-slate-900' : 'text-slate-400'
              )}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-2 mb-6 rounded-full transition-colors',
                step > s.num ? 'bg-emerald-500' : 'bg-slate-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          取车网点 <span className="text-rose-500">*</span>
        </label>
        <select
          value={form.locationId}
          onChange={e => {
            setForm({ ...form, locationId: e.target.value, vehicleId: '' })
            if (errors.locationId) {
              setErrors({ ...errors, locationId: undefined })
            }
          }}
          className={cn(
            'w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
            errors.locationId ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200'
          )}
        >
          <option value="">请选择取车网点...</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name} - 可用{loc.availableVehicles}辆
            </option>
          ))}
        </select>
        {errors.locationId && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.locationId}
          </p>
        )}
      </div>

      {selectedLocation && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900">{selectedLocation.name}</h4>
              <p className="mt-0.5 text-xs text-slate-500">{selectedLocation.address}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                  可用 {selectedLocation.availableVehicles} 辆
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                  使用中 {selectedLocation.inUseVehicles} 辆
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                  维护中 {selectedLocation.maintenanceVehicles} 辆
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <BabyIcon className="h-4 w-4 text-slate-400" />
          选择车辆 <span className="text-rose-500">*</span>
        </label>

        {!form.locationId ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12">
            <MapPin className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">请先选择取车网点</p>
          </div>
        ) : availableVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12">
            <BabyIcon className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">该网点暂无可用车辆</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {availableVehicles.map((v: Vehicle) => {
              const type = VEHICLE_TYPES[v.type]
              const isSelected = form.vehicleId === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setForm({ ...form, vehicleId: v.id })
                    if (errors.vehicleId) {
                      setErrors({ ...errors, vehicleId: undefined })
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all',
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10'
                      : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-white hover:shadow-sm'
                  )}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <BabyIcon className="h-6 w-6" style={{ color: type.color }} />
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
                    <p className="text-xs text-slate-500 mt-1">
                      ¥{type.hourlyRate}/小时 · ¥{type.dailyRate}/天
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      押金 ¥{type.deposit}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
        {errors.vehicleId && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.vehicleId}
          </p>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Clock className="h-4 w-4 text-slate-400" />
            开始时间 <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={e => {
              setForm({ ...form, startTime: e.target.value })
              if (errors.startTime) {
                setErrors({ ...errors, startTime: undefined })
              }
            }}
            className={cn(
              'w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
              errors.startTime ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200'
            )}
          />
          {errors.startTime && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.startTime}
            </p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            预计归还 <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={e => {
              setForm({ ...form, endTime: e.target.value })
              if (errors.endTime) {
                setErrors({ ...errors, endTime: undefined })
              }
            }}
            className={cn(
              'w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
              errors.endTime ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200'
            )}
          />
          {errors.endTime && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.endTime}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <BabyIcon className="h-4 w-4 text-slate-400" />
          儿童年龄 <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="12"
            value={form.childAge}
            onChange={e => {
              setForm({ ...form, childAge: parseInt(e.target.value) })
              if (errors.childAge) {
                setErrors({ ...errors, childAge: undefined })
              }
            }}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="w-12 text-center rounded-lg bg-blue-50 px-2 py-1.5 text-sm font-semibold text-blue-600">
            {form.childAge}岁
          </span>
        </div>
        {errors.childAge && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.childAge}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <User className="h-4 w-4 text-slate-400" />
            家长姓名 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.parentName}
            onChange={e => {
              setForm({ ...form, parentName: e.target.value })
              if (errors.parentName) {
                setErrors({ ...errors, parentName: undefined })
              }
            }}
            placeholder="请输入家长姓名"
            className={cn(
              'w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
              errors.parentName ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200'
            )}
          />
          {errors.parentName && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.parentName}
            </p>
          )}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Phone className="h-4 w-4 text-slate-400" />
            联系电话 <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={form.parentPhone}
            onChange={e => {
              setForm({ ...form, parentPhone: e.target.value })
              if (errors.parentPhone) {
                setErrors({ ...errors, parentPhone: undefined })
              }
            }}
            placeholder="请输入11位手机号"
            className={cn(
              'w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
              errors.parentPhone ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200'
            )}
          />
          {errors.parentPhone && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.parentPhone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <Crown className="h-4 w-4 text-amber-500" />
          会员手机号 <span className="text-slate-400 font-normal">（选填，享受会员折扣）</span>
        </label>
        <input
          type="tel"
          value={form.memberPhone}
          onChange={e => handleMemberPhoneChange(e.target.value)}
          placeholder="请输入会员手机号"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        {matchedMember && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <Crown className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">{matchedMember.name}</p>
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${memberTagConfig?.color}15`,
                    color: memberTagConfig?.color
                  }}
                >
                  {memberTagConfig?.name}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                已下单 {matchedMember.totalOrders} 次 · 累计消费 ¥{matchedMember.totalSpent}
              </p>
            </div>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}
        {form.memberPhone && form.memberPhone.length === 11 && !matchedMember && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900">未找到该会员</p>
              <p className="mt-0.5 text-xs text-slate-500">请检查手机号是否正确，或继续以非会员身份下单</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h4 className="font-semibold text-slate-900 mb-3">订单信息确认</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">取车网点</span>
            <span className="font-medium text-slate-900">{selectedLocation?.name || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">车辆信息</span>
            <span className="font-medium text-slate-900">
              {selectedVehicle ? `${selectedVehicle.plateNumber} (${VEHICLE_TYPES[selectedVehicle.type].name})` : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">取车时间</span>
            <span className="font-medium text-slate-900">
              {form.startTime ? form.startTime.replace('T', ' ') : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">预计归还</span>
            <span className="font-medium text-slate-900">
              {form.endTime ? form.endTime.replace('T', ' ') : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">儿童年龄</span>
            <span className="font-medium text-slate-900">{form.childAge}岁</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">家长姓名</span>
            <span className="font-medium text-slate-900">{form.parentName || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">联系电话</span>
            <span className="font-medium text-slate-900">{form.parentPhone || '-'}</span>
          </div>
          {matchedMember && (
            <div className="flex justify-between">
              <span className="text-slate-500">会员</span>
              <span className="font-medium text-slate-900">
                {matchedMember.name} ({memberTagConfig?.name})
              </span>
            </div>
          )}
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
  )

  const renderFeeCard = () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900 mb-4">费用明细</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">基础租金</span>
          <span className="text-sm font-medium text-slate-900">¥{baseRent.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">会员折扣</span>
            <span className="text-sm font-medium text-emerald-500">-¥{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">
            押金
            <span className="text-slate-400 text-xs ml-1">（归还后退还）</span>
          </span>
          <span className="text-sm font-medium text-slate-900">¥{deposit.toFixed(2)}</span>
        </div>
        <div className="border-t border-dashed border-slate-200 pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">实际租金</span>
            <span className="text-sm font-semibold text-slate-900">¥{actualRent.toFixed(2)}</span>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
            <p className="text-xs text-slate-600 mb-1">共需支付</p>
            <p className="text-lg font-bold text-slate-900">
              ¥{totalPayment.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              租金 ¥{actualRent.toFixed(2)} + 押金 ¥{deposit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {memberTagConfig && discountAmount > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">
            {memberTagConfig.name}专属优惠，已为您节省 ¥{discountAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )

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
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                步骤 {step}/4
              </span>
            </div>
            <div className="space-y-3">
              {[
                { num: 1, label: '选择取车网点' },
                { num: 2, label: '选择可用车辆' },
                { num: 3, label: '填写订单信息' },
                { num: 4, label: '确认并支付' }
              ].map(s => (
                <div key={s.num} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all',
                      step > s.num
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30'
                        : step === s.num
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={cn(
                      'text-sm transition-colors',
                      step >= s.num ? 'text-slate-900 font-medium' : 'text-slate-400'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {renderFeeCard()}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">手动下单</h2>

          {renderStepIndicator()}

          <div className="min-h-[400px]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={cn(
                'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                step === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              上一步
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={step === 2 && !form.locationId}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200',
                  step === 2 && !form.locationId
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:translate-y-[-1px]'
                )}
              >
                下一步
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateOrder}
                disabled={!canSubmit}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-8 py-3 font-semibold text-white transition-all duration-200',
                  canSubmit
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:translate-y-[-1px]'
                    : 'bg-slate-300 cursor-not-allowed'
                )}
              >
                <Wallet className="h-5 w-5" />
                确认支付 ¥{totalPayment.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { create } from 'zustand'
import {
  locations,
  vehicles,
  orders,
  members,
  settlements,
  exceptions,
  maintenance,
  reports,
  type Location,
  type Vehicle,
  type Order,
  type Member,
  type Settlement,
  type ExceptionItem,
  type Maintenance,
  type DailyReport,
  type Filters as MockFilters
} from '@/data/mockData'
import {
  type VehicleStatus,
  type MemberTag,
  type ExceptionStatus,
  type ExceptionType,
  type OrderStatus,
  type SettlementStatus,
  type RentalType,
  type PaymentMethod,
  type RefundMethod,
  MEMBER_TAGS,
  type VehicleType
} from '@/utils/constants'
import {
  calculateBaseRent,
  calculateOvertimeFee,
  calculateActualRefund,
  calculateDiscount,
  calculateVehicleDeposit
} from '@/utils/calculators'

export interface Filters {
  keyword?: string
  locationId?: string
  vehicleType?: VehicleType
  vehicleStatus?: VehicleStatus
  orderStatus?: OrderStatus
  settlementStatus?: SettlementStatus
  exceptionStatus?: ExceptionStatus
  memberTag?: MemberTag
  dateRange?: [string, string]
}

interface CreateOrderParams {
  vehicleId: string
  locationId: string
  pickUpLocationId?: string
  returnLocationId?: string
  memberId?: string
  startTime: string
  endTime: string
  rentalType: RentalType
  paymentMethod: PaymentMethod
  childAge: number
  parentName: string
  parentPhone: string
}

interface ExtendOrderParams {
  orderId: string
  newEndTime: string
}

interface ReturnVehicleParams {
  orderId: string
  actualEndTime: string
  damageFee?: number
  returnLocationId?: string
}

interface SettlePaymentParams {
  orderId: string
  refundMethod: RefundMethod
  operator: string
  paymentMethod?: string
}

interface UpdateVehicleStatusParams {
  vehicleId: string
  status: VehicleStatus
  remark?: string
}

interface CreateExceptionParams {
  orderId?: string
  vehicleId?: string
  memberId?: string
  exceptionType: ExceptionType
  title: string
  description: string
  amount?: number
  priority: 'low' | 'medium' | 'high'
  reporterName: string
  reporterPhone: string
  status?: ExceptionStatus
  assignTo?: string
  lossAmount?: number
}

interface AddMemberTagParams {
  memberId: string
  tag: MemberTag
}

interface StoreState {
  locations: Location[]
  vehicles: Vehicle[]
  orders: Order[]
  members: Member[]
  settlements: Settlement[]
  exceptions: ExceptionItem[]
  maintenance: Maintenance[]
  reports: DailyReport[]
  filters: Filters
  mockFilters: MockFilters

  createOrder: (params: CreateOrderParams) => Order
  extendOrder: (params: ExtendOrderParams) => Order | undefined
  returnVehicle: (params: ReturnVehicleParams) => Order | undefined
  settlePayment: (params: SettlePaymentParams) => Settlement | undefined
  updateVehicleStatus: (params: UpdateVehicleStatusParams) => Vehicle | undefined
  createException: (params: CreateExceptionParams) => ExceptionItem
  addMemberTag: (params: AddMemberTagParams) => Member | undefined
  updateFilters: (filters: Partial<Filters>) => void
}

const generateId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`
}

const generateOrderNo = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `TC${date}${random}`
}

const generateSettlementNo = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `JS${date}${random}`
}

const generateTicketNo = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `GZ${date}${random}`
}

const generateNow = () => new Date().toISOString()

const initialMockFilters: MockFilters = {
  dateRange: null,
  locationIds: [],
  vehicleTypes: [],
  vehicleStatuses: [],
  orderStatuses: [],
  memberTags: [],
  searchKeyword: ''
}

export const useStore = create<StoreState>((set, get) => ({
  locations,
  vehicles,
  orders,
  members,
  settlements,
  exceptions,
  maintenance,
  reports,
  filters: {
    keyword: '',
    locationId: undefined,
    vehicleType: undefined,
    vehicleStatus: undefined,
    orderStatus: undefined,
    settlementStatus: undefined,
    exceptionStatus: undefined,
    memberTag: undefined,
    dateRange: undefined
  },
  mockFilters: initialMockFilters,

  createOrder: ({
    vehicleId,
    locationId,
    pickUpLocationId,
    returnLocationId,
    memberId,
    startTime,
    endTime,
    rentalType,
    paymentMethod,
    childAge,
    parentName,
    parentPhone
  }) => {
    const { vehicles: storeVehicles, orders: storeOrders, members: storeMembers, locations: storeLocations } = get()
    const vehicle = storeVehicles.find(v => v.id === vehicleId)
    if (!vehicle) throw new Error('车辆不存在')
    if (vehicle.status !== 'available') throw new Error('车辆不可用')

    const member = memberId ? storeMembers.find(m => m.id === memberId) : undefined
    const memberTagConfig = member && member.tags.length > 0 ? MEMBER_TAGS[member.tags[0]] : undefined

    const baseRent = calculateBaseRent({
      pickUpTime: startTime,
      expectedReturnTime: endTime,
      vehicleType: vehicle.type
    })

    const discountAmount = calculateDiscount(baseRent, memberTagConfig)
    const deposit = calculateVehicleDeposit(vehicle.type)
    const totalAmount = baseRent - discountAmount
    const paidAmount = totalAmount + deposit

    const pickUpTimeStr = startTime.replace('T', ' ').slice(0, 19)
    const expectedReturnTimeStr = endTime.replace('T', ' ').slice(0, 19)

    const newOrder: Order = {
      id: generateId('OR'),
      orderNo: generateOrderNo(),
      vehicleId,
      memberId,
      locationId,
      pickUpLocationId: pickUpLocationId ?? locationId,
      returnLocationId,
      pickUpTime: pickUpTimeStr,
      expectedReturnTime: expectedReturnTimeStr,
      status: 'active',
      baseAmount: baseRent,
      overtimeAmount: 0,
      discountAmount,
      depositAmount: deposit,
      totalAmount,
      paidAmount,
      childAge,
      parentName,
      parentPhone,
      startTime,
      endTime,
      rentalType,
      baseRent,
      deposit,
      overtimeFee: 0,
      damageFee: 0,
      paymentMethod,
      createdAt: generateNow(),
      updatedAt: generateNow()
    }

    const updatedVehicles = storeVehicles.map(v =>
      v.id === vehicleId ? { ...v, status: 'in_use' as const } : v
    )

    const updatedLocations = storeLocations.map(loc => {
      if (loc.id !== locationId) return loc
      return {
        ...loc,
        availableSlots: Math.max(0, loc.availableSlots - 1),
        availableVehicles: Math.max(0, loc.availableVehicles - 1),
        inUseVehicles: loc.inUseVehicles + 1
      }
    })

    set({
      orders: [...storeOrders, newOrder],
      vehicles: updatedVehicles,
      locations: updatedLocations
    })

    return newOrder
  },

  extendOrder: ({ orderId, newEndTime }) => {
    const { orders: storeOrders, vehicles: storeVehicles } = get()
    const order = storeOrders.find(o => o.id === orderId)
    if (!order) return undefined
    if (order.status !== 'active' && order.status !== 'ongoing') return undefined

    const vehicle = storeVehicles.find(v => v.id === order.vehicleId)
    if (!vehicle) return undefined

    const newBaseRent = calculateBaseRent({
      pickUpTime: order.startTime,
      expectedReturnTime: newEndTime,
      vehicleType: vehicle.type
    })

    const additionalBaseRent = Math.max(0, newBaseRent - order.baseRent)
    const member = order.memberId ? get().members.find(m => m.id === order.memberId) : undefined
    const memberTagConfig = member && member.tags.length > 0 ? MEMBER_TAGS[member.tags[0]] : undefined
    const additionalDiscount = calculateDiscount(additionalBaseRent, memberTagConfig)
    const additionalTotal = additionalBaseRent - additionalDiscount

    const expectedReturnTimeStr = newEndTime.replace('T', ' ').slice(0, 19)

    const updatedOrder: Order = {
      ...order,
      endTime: newEndTime,
      expectedReturnTime: expectedReturnTimeStr,
      baseRent: newBaseRent,
      baseAmount: newBaseRent,
      discountAmount: order.discountAmount + additionalDiscount,
      totalAmount: (order.totalAmount ?? 0) + additionalTotal,
      paidAmount: (order.paidAmount ?? 0) + additionalTotal,
      status: 'extended',
      updatedAt: generateNow()
    }

    set({
      orders: storeOrders.map(o => (o.id === orderId ? updatedOrder : o))
    })

    return updatedOrder
  },

  returnVehicle: ({ orderId, actualEndTime, damageFee = 0, returnLocationId }) => {
    const { orders: storeOrders, vehicles: storeVehicles, locations: storeLocations, members: storeMembers } = get()
    const order = storeOrders.find(o => o.id === orderId)
    if (!order) return undefined
    if (order.status !== 'active' && order.status !== 'extended' && order.status !== 'ongoing') return undefined

    const vehicle = storeVehicles.find(v => v.id === order.vehicleId)
    if (!vehicle) return undefined

    const overtimeFee = calculateOvertimeFee({
      expectedReturnTime: order.endTime,
      actualReturnTime: actualEndTime,
      vehicleType: vehicle.type
    })

    const refundAmount = calculateActualRefund({
      depositAmount: order.deposit,
      overtimeAmount: overtimeFee,
      damageLoss: damageFee
    })

    const actualReturnTimeStr = actualEndTime.replace('T', ' ').slice(0, 19)
    const finalLocationId = returnLocationId ?? order.returnLocationId ?? order.locationId
    const newTotal = order.baseRent + overtimeFee + damageFee - (order.discountAmount ?? 0)

    const updatedOrder: Order = {
      ...order,
      actualEndTime,
      actualReturnTime: actualReturnTimeStr,
      returnLocationId: finalLocationId,
      overtimeFee,
      overtimeAmount: overtimeFee,
      damageFee,
      refundAmount,
      totalAmount: newTotal,
      status: 'returned',
      updatedAt: generateNow()
    }

    const newVehicleStatus: VehicleStatus = damageFee > 0 ? 'maintenance' : 'available'
    const updatedVehicles = storeVehicles.map(v =>
      v.id === order.vehicleId ? { ...v, status: newVehicleStatus } : v
    )

    const updatedLocations = storeLocations.map(loc => {
      if (loc.id === order.locationId && loc.id !== finalLocationId) {
        return {
          ...loc,
          availableSlots: Math.min(loc.totalSlots, loc.availableSlots + 1),
          inUseVehicles: Math.max(0, loc.inUseVehicles - 1),
          availableVehicles: loc.availableVehicles + (damageFee > 0 ? 0 : 1),
          maintenanceVehicles: loc.maintenanceVehicles + (damageFee > 0 ? 1 : 0)
        }
      }
      if (loc.id === finalLocationId) {
        if (loc.id === order.locationId) {
          return {
            ...loc,
            availableSlots: Math.min(loc.totalSlots, loc.availableSlots + 1),
            inUseVehicles: Math.max(0, loc.inUseVehicles - 1),
            availableVehicles: loc.availableVehicles + (damageFee > 0 ? 0 : 1),
            maintenanceVehicles: loc.maintenanceVehicles + (damageFee > 0 ? 1 : 0)
          }
        }
        return {
          ...loc,
          availableSlots: Math.min(loc.totalSlots, loc.availableSlots + 1),
          availableVehicles: loc.availableVehicles + (damageFee > 0 ? 0 : 1),
          maintenanceVehicles: loc.maintenanceVehicles + (damageFee > 0 ? 1 : 0)
        }
      }
      return loc
    })

    const updatedMembers = storeMembers.map(m => {
      if (m.id !== order.memberId) return m
      return {
        ...m,
        totalOrders: m.totalOrders + 1,
        totalSpent: m.totalSpent + newTotal,
        lastActiveDate: generateNow().slice(0, 10)
      }
    })

    if (damageFee > 0) {
      const newMaintenance: Maintenance = {
        id: generateId('MA'),
        recordNo: generateTicketNo(),
        vehicleId: order.vehicleId,
        type: 'repair',
        status: 'scheduled',
        scheduleDate: new Date().toISOString().slice(0, 10),
        technician: '待分配',
        cost: damageFee,
        items: ['车辆损坏检查与维修']
      }
      set({
        maintenance: [...get().maintenance, newMaintenance]
      })
    }

    set({
      orders: storeOrders.map(o => (o.id === orderId ? updatedOrder : o)),
      vehicles: updatedVehicles,
      locations: updatedLocations,
      members: updatedMembers
    })

    return updatedOrder
  },

  settlePayment: ({ orderId, refundMethod, operator, paymentMethod }) => {
    const { settlements: storeSettlements, orders: storeOrders } = get()
    const order = storeOrders.find(o => o.id === orderId)
    if (!order) return undefined
    if (order.status !== 'returned' && order.status !== 'completed') return undefined

    const existingSettlement = storeSettlements.find(s => s.orderId === orderId)
    if (existingSettlement) return undefined

    const totalDeduction = order.baseRent + order.overtimeFee + order.damageFee
    const refund = order.refundAmount ?? order.deposit - order.overtimeFee - order.damageFee
    const hasException = refund < 0 || order.damageFee > 0

    const status: SettlementStatus = hasException ? 'exception' : 'completed'
    const now = generateNow()
    const nowStr = now.replace('T', ' ').slice(0, 19)

    const newSettlement: Settlement = {
      id: generateId('ST'),
      settlementNo: generateSettlementNo(),
      orderId,
      orderNo: order.orderNo,
      memberId: order.memberId,
      deposit: order.deposit,
      baseRent: order.baseRent,
      overtimeFee: order.overtimeFee,
      damageFee: order.damageFee,
      totalDeduction,
      refundAmount: Math.max(0, refund),
      refundMethod,
      operator,
      amount: order.paidAmount,
      status,
      paymentMethod,
      createTime: nowStr,
      settleTime: nowStr,
      createdAt: now,
      settledAt: now
    }

    const updatedOrder: Order = {
      ...order,
      status: 'settled',
      updatedAt: now
    }

    set({
      settlements: [...storeSettlements, newSettlement],
      orders: storeOrders.map(o => (o.id === orderId ? updatedOrder : o))
    })

    return newSettlement
  },

  updateVehicleStatus: ({ vehicleId, status, remark }) => {
    const { vehicles: storeVehicles, maintenance: storeMaintenance } = get()
    const vehicle = storeVehicles.find(v => v.id === vehicleId)
    if (!vehicle) return undefined

    const updatedVehicle: Vehicle = {
      ...vehicle,
      status,
      remark: remark ?? vehicle.remark
    }

    if (status === 'maintenance') {
      const existingMaintenance = storeMaintenance.find(
        m => m.vehicleId === vehicleId && (m.status === 'scheduled' || m.status === 'in_progress')
      )
      if (!existingMaintenance) {
        const newMaintenance: Maintenance = {
          id: generateId('MA'),
          recordNo: generateSettlementNo(),
          vehicleId,
          type: 'routine',
          status: 'scheduled',
          scheduleDate: new Date().toISOString().slice(0, 10),
          technician: '待分配',
          cost: 0,
          items: ['状态变更维护检查'],
          remark
        }
        set({
          maintenance: [...storeMaintenance, newMaintenance]
        })
      }
    }

    set({
      vehicles: storeVehicles.map(v => (v.id === vehicleId ? updatedVehicle : v))
    })

    return updatedVehicle
  },

  createException: ({
    orderId,
    vehicleId,
    memberId,
    exceptionType,
    title,
    description,
    amount,
    priority,
    reporterName,
    reporterPhone,
    status = 'pending',
    assignTo,
    lossAmount
  }) => {
    const { exceptions: storeExceptions, orders: storeOrders, vehicles: storeVehicles } = get()
    const order = orderId ? storeOrders.find(o => o.id === orderId) : undefined

    const now = generateNow()
    const nowStr = now.replace('T', ' ').slice(0, 19)

    const newException: ExceptionItem = {
      id: generateId('TK'),
      ticketNo: generateTicketNo(),
      type: exceptionType === 'overtime' ? 'other' : exceptionType,
      status: status === 'pending' ? 'open' : status === 'processing' ? 'processing' : 'resolved',
      orderId,
      orderNo: order?.orderNo ?? '',
      vehicleId,
      memberId,
      reporterName,
      reporterPhone,
      description,
      createTime: nowStr,
      assignTo,
      lossAmount,
      title,
      amount,
      priority,
      reportedAt: now,
      exceptionType,
      exceptionStatus: status
    }

    if (orderId) {
      set({
        orders: storeOrders.map(o =>
          o.id === orderId
            ? { ...o, status: 'exception', updatedAt: generateNow() }
            : o
        )
      })
    }

    if (vehicleId && (exceptionType === 'lost' || exceptionType === 'damage')) {
      const vehicle = storeVehicles.find(v => v.id === vehicleId)
      if (vehicle) {
        const newStatus: VehicleStatus = exceptionType === 'lost' ? 'lost' : 'maintenance'
        set({
          vehicles: storeVehicles.map(v =>
            v.id === vehicleId
              ? { ...v, status: newStatus, remark: `工单：${newException.ticketNo}` }
              : v
          )
        })
      }
    }

    set({
      exceptions: [...storeExceptions, newException]
    })

    return newException
  },

  addMemberTag: ({ memberId, tag }) => {
    const { members: storeMembers } = get()
    const member = storeMembers.find(m => m.id === memberId)
    if (!member) return undefined

    if (member.tags.includes(tag)) return member

    const updatedMember: Member = {
      ...member,
      tags: [...member.tags, tag]
    }

    set({
      members: storeMembers.map(m => (m.id === memberId ? updatedMember : m))
    })

    return updatedMember
  },

  updateFilters: newFilters => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }))
  }
}))

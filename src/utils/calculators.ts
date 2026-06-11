import { VEHICLE_TYPES, OVERTIME_RULES, type VehicleType } from './constants'

export interface BaseRentParams {
  pickUpTime: string
  expectedReturnTime: string
  vehicleType: VehicleType
}

export interface OvertimeFeeParams {
  expectedReturnTime: string
  actualReturnTime: string
  vehicleType: VehicleType
}

export interface ActualRefundParams {
  depositAmount: number
  overtimeAmount: number
  damageLoss?: number
}

export interface TurnoverRateParams {
  totalOrders: number
  totalVehicles: number
  periodDays?: number
}

export interface LossRateParams {
  lostCount: number
  totalCount: number
}

export function calculateBaseRent({
  pickUpTime,
  expectedReturnTime,
  vehicleType
}: BaseRentParams): number {
  const start = new Date(pickUpTime).getTime()
  const end = new Date(expectedReturnTime).getTime()
  const diffMs = Math.max(0, end - start)
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffHours / 24

  const config = VEHICLE_TYPES[vehicleType]

  if (diffDays >= 1) {
    const roundedDays = Math.ceil(diffDays * 10) / 10
    const dailyCost = roundedDays * config.dailyRate
    const hourlyCost = Math.ceil(diffHours) * config.hourlyRate
    return Math.round(Math.min(dailyCost, hourlyCost) * 100) / 100
  }

  const hours = Math.ceil(diffHours)
  if (hours <= 0) return config.hourlyRate
  return Math.round(hours * config.hourlyRate * 100) / 100
}

export function calculateOvertimeFee({
  expectedReturnTime,
  actualReturnTime,
  vehicleType
}: OvertimeFeeParams): number {
  const expected = new Date(expectedReturnTime).getTime()
  const actual = new Date(actualReturnTime).getTime()
  const diffMs = actual - expected

  if (diffMs <= 0) return 0

  const diffMinutes = diffMs / (1000 * 60)
  const config = VEHICLE_TYPES[vehicleType]
  const hourlyRate = config.hourlyRate

  let remainingMinutes = Math.ceil(diffMinutes)
  let totalFee = 0
  let previousThreshold = 0

  for (const rule of OVERTIME_RULES) {
    if (remainingMinutes <= 0) break

    const tierMinutes = Math.min(remainingMinutes, rule.threshold - previousThreshold)
    if (tierMinutes > 0) {
      const tierHours = tierMinutes / 60
      totalFee += tierHours * hourlyRate * rule.rateMultiplier
      remainingMinutes -= tierMinutes
    }
    previousThreshold = rule.threshold
  }

  return Math.round(totalFee * 100) / 100
}

export function calculateActualRefund({
  depositAmount,
  overtimeAmount,
  damageLoss = 0
}: ActualRefundParams): number {
  const refund = depositAmount - overtimeAmount - damageLoss
  return Math.max(0, Math.round(refund * 100) / 100)
}

export function calculateTurnoverRate({
  totalOrders,
  totalVehicles,
  periodDays = 1
}: TurnoverRateParams): number {
  if (totalVehicles <= 0) return 0
  const dailyOrders = totalOrders / periodDays
  const rate = (dailyOrders / totalVehicles) * 100
  return Math.round(rate * 100) / 100
}

export function calculateLossRate({
  lostCount,
  totalCount
}: LossRateParams): number {
  if (totalCount <= 0) return 0
  const rate = (lostCount / totalCount) * 100
  return Math.round(rate * 100) / 100
}

export function calculateHoursBetween(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const diffMs = Math.max(0, end - start)
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
}

export function calculateDiscount(
  baseAmount: number,
  memberTag: { discount: number } | undefined
): number {
  if (!memberTag) return 0
  const discount = baseAmount * (1 - memberTag.discount)
  return Math.round(discount * 100) / 100
}

export function calculateVehicleDeposit(vehicleType: VehicleType): number {
  return VEHICLE_TYPES[vehicleType].deposit
}

export function calculateTotalRevenue<T extends { baseAmount: number; overtimeAmount: number }>(
  orders: T[]
): number {
  return orders.reduce((total, order) => total + order.baseAmount + order.overtimeAmount, 0)
}

export function calculateAverageOrderValue<T extends { baseAmount: number; overtimeAmount: number; discountAmount: number }>(
  orders: T[]
): number {
  if (orders.length === 0) return 0
  const total = orders.reduce(
    (sum, order) => sum + order.baseAmount + order.overtimeAmount - order.discountAmount,
    0
  )
  return Math.round((total / orders.length) * 100) / 100
}

export function calculateMemberRetentionRate(
  activeMembers: number,
  totalMembers: number
): number {
  if (totalMembers === 0) return 0
  return Math.round((activeMembers / totalMembers) * 10000) / 100
}

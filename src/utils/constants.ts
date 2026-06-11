export type VehicleType = 'light' | 'standard' | 'twin' | 'electric';
export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'frozen' | 'scrapped' | 'lost';
export type OrderStatus = 'ongoing' | 'completed' | 'overdue' | 'cancelled' | 'active' | 'extended' | 'returned' | 'settled' | 'exception';
export type LocationType = 'mall' | 'scenic' | 'kids_center';
export type MemberTag = 'vip' | 'silver' | 'gold' | 'diamond' | 'normal';
export type SettlementStatus = 'pending' | 'settled' | 'disputed' | 'completed' | 'exception';
export type TicketStatus = 'open' | 'processing' | 'resolved' | 'closed';
export type TicketType = 'damage' | 'lost' | 'complaint' | 'other';
export type MaintenanceType = 'routine' | 'repair' | 'cleaning' | 'parts_replace';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ExceptionStatus = 'pending' | 'processing' | 'resolved' | 'closed';
export type ExceptionType = 'damage' | 'lost' | 'complaint' | 'overtime' | 'other';
export type RentalType = 'hourly' | 'daily';
export type PaymentMethod = 'wechat' | 'alipay' | 'card' | 'balance';
export type RefundMethod = 'original' | 'balance' | 'cash' | 'transfer';

export interface VehicleTypeDefinition {
  type: VehicleType;
  name: string;
  deposit: number;
  hourlyRate: number;
  dailyRate: number;
  color: string;
}

export interface OvertimeRule {
  threshold: number;
  rateMultiplier: number;
  description: string;
}

export interface LocationTypeDefinition {
  type: LocationType;
  name: string;
  icon: string;
}

export interface MemberTagDefinition {
  tag: MemberTag;
  name: string;
  color: string;
  discount: number;
}

export const VEHICLE_TYPES: Record<VehicleType, VehicleTypeDefinition> = {
  light: {
    type: 'light',
    name: '轻便型',
    deposit: 200,
    hourlyRate: 8,
    dailyRate: 60,
    color: '#22c55e',
  },
  standard: {
    type: 'standard',
    name: '标准型',
    deposit: 300,
    hourlyRate: 12,
    dailyRate: 90,
    color: '#3b82f6',
  },
  twin: {
    type: 'twin',
    name: '双胞胎型',
    deposit: 500,
    hourlyRate: 18,
    dailyRate: 140,
    color: '#a855f7',
  },
  electric: {
    type: 'electric',
    name: '电动型',
    deposit: 800,
    hourlyRate: 25,
    dailyRate: 180,
    color: '#f59e0b',
  },
};

export const VEHICLE_STATUS: Record<VehicleStatus, { value: VehicleStatus; label: string; color: string }> = {
  available: { value: 'available', label: '可用', color: '#22c55e' },
  in_use: { value: 'in_use', label: '使用中', color: '#3b82f6' },
  maintenance: { value: 'maintenance', label: '维护中', color: '#f59e0b' },
  frozen: { value: 'frozen', label: '已冻结', color: '#6b7280' },
  scrapped: { value: 'scrapped', label: '已报废', color: '#ef4444' },
  lost: { value: 'lost', label: '已丢失', color: '#dc2626' },
};

export const OVERTIME_RULES: OvertimeRule[] = [
  { threshold: 30, rateMultiplier: 1.5, description: '超时30分钟内，按1.5倍时租计费' },
  { threshold: 60, rateMultiplier: 2, description: '超时30-60分钟，按2倍时租计费' },
  { threshold: 120, rateMultiplier: 2.5, description: '超时1-2小时，按2.5倍时租计费' },
  { threshold: Infinity, rateMultiplier: 3, description: '超时2小时以上，按3倍时租计费' },
];

export const LOCATION_TYPES: Record<LocationType, LocationTypeDefinition> = {
  mall: { type: 'mall', name: '商场', icon: '🏬' },
  scenic: { type: 'scenic', name: '景区', icon: '🏞️' },
  kids_center: { type: 'kids_center', name: '亲子馆', icon: '🎠' },
};

export const MEMBER_TAGS: Record<MemberTag, MemberTagDefinition> = {
  normal: { tag: 'normal', name: '普通会员', color: '#6b7280', discount: 1 },
  silver: { tag: 'silver', name: '银卡会员', color: '#94a3b8', discount: 0.95 },
  gold: { tag: 'gold', name: '金卡会员', color: '#f59e0b', discount: 0.9 },
  vip: { tag: 'vip', name: 'VIP会员', color: '#8b5cf6', discount: 0.85 },
  diamond: { tag: 'diamond', name: '钻石会员', color: '#06b6d4', discount: 0.8 },
};

export const ORDER_STATUS_MAP: Record<OrderStatus, { value: OrderStatus; label: string; color: string }> = {
  ongoing: { value: 'ongoing', label: '进行中', color: '#3b82f6' },
  completed: { value: 'completed', label: '已完成', color: '#22c55e' },
  overdue: { value: 'overdue', label: '已逾期', color: '#ef4444' },
  cancelled: { value: 'cancelled', label: '已取消', color: '#6b7280' },
  active: { value: 'active', label: '使用中', color: '#3b82f6' },
  extended: { value: 'extended', label: '已续租', color: '#8b5cf6' },
  returned: { value: 'returned', label: '已归还', color: '#14b8a6' },
  settled: { value: 'settled', label: '已结算', color: '#22c55e' },
  exception: { value: 'exception', label: '异常', color: '#ef4444' },
};

export const SETTLEMENT_STATUS_MAP: Record<SettlementStatus, { value: SettlementStatus; label: string; color: string }> = {
  pending: { value: 'pending', label: '待结算', color: '#f59e0b' },
  settled: { value: 'settled', label: '已结算', color: '#22c55e' },
  disputed: { value: 'disputed', label: '有争议', color: '#ef4444' },
  completed: { value: 'completed', label: '已完成', color: '#22c55e' },
  exception: { value: 'exception', label: '异常', color: '#ef4444' },
};

export const TICKET_STATUS_MAP: Record<TicketStatus, { value: TicketStatus; label: string; color: string }> = {
  open: { value: 'open', label: '待处理', color: '#ef4444' },
  processing: { value: 'processing', label: '处理中', color: '#f59e0b' },
  resolved: { value: 'resolved', label: '已解决', color: '#22c55e' },
  closed: { value: 'closed', label: '已关闭', color: '#6b7280' },
};

export const TICKET_TYPE_MAP: Record<TicketType, { value: TicketType; label: string; color: string }> = {
  damage: { value: 'damage', label: '车辆损坏', color: '#ef4444' },
  lost: { value: 'lost', label: '车辆丢失', color: '#f97316' },
  complaint: { value: 'complaint', label: '客户投诉', color: '#8b5cf6' },
  other: { value: 'other', label: '其他', color: '#6b7280' },
};

export const MAINTENANCE_STATUS_MAP: Record<MaintenanceStatus, { value: MaintenanceStatus; label: string; color: string }> = {
  scheduled: { value: 'scheduled', label: '已排期', color: '#3b82f6' },
  in_progress: { value: 'in_progress', label: '进行中', color: '#f59e0b' },
  completed: { value: 'completed', label: '已完成', color: '#22c55e' },
  cancelled: { value: 'cancelled', label: '已取消', color: '#6b7280' },
};

export const MAINTENANCE_TYPE_MAP: Record<MaintenanceType, { value: MaintenanceType; label: string; color: string }> = {
  routine: { value: 'routine', label: '例行保养', color: '#3b82f6' },
  repair: { value: 'repair', label: '故障维修', color: '#ef4444' },
  cleaning: { value: 'cleaning', label: '深度清洁', color: '#22c55e' },
  parts_replace: { value: 'parts_replace', label: '零件更换', color: '#f59e0b' },
};

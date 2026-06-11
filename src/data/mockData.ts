import {
  VehicleType,
  VehicleStatus,
  OrderStatus,
  LocationType,
  MemberTag,
  SettlementStatus,
  TicketStatus,
  TicketType,
  MaintenanceType,
  MaintenanceStatus,
  ExceptionStatus,
  ExceptionType,
  RentalType,
  PaymentMethod,
  RefundMethod,
  VEHICLE_TYPES,
} from '../utils/constants';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  totalSlots: number;
  availableSlots: number;
  contactPhone: string;
  operatingHours: string;
  image: string;
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  totalVehicles: number;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  locationId: string;
  purchaseDate: string;
  mileage: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  batteryLevel?: number;
  rfidTag: string;
  remark?: string;
  hourlyRate: number;
  dailyRate: number;
  deposit: number;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  tags: MemberTag[];
  registerDate: string;
  totalOrders: number;
  totalSpent: number;
  balance: number;
  points: number;
  avatar: string;
  idCard: string;
  lastActiveDate?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  memberId?: string;
  vehicleId: string;
  pickUpLocationId?: string;
  returnLocationId?: string;
  pickUpTime?: string;
  expectedReturnTime?: string;
  actualReturnTime?: string;
  status: OrderStatus;
  baseAmount?: number;
  overtimeAmount?: number;
  discountAmount?: number;
  depositAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  remark?: string;
  locationId: string;
  childAge: number;
  parentName: string;
  parentPhone: string;
  startTime: string;
  endTime: string;
  rentalType: RentalType;
  baseRent: number;
  deposit: number;
  overtimeFee: number;
  damageFee: number;
  refundAmount?: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  actualEndTime?: string;
}

export interface Settlement {
  id: string;
  settlementNo?: string;
  orderId: string;
  memberId?: string;
  amount?: number;
  status: SettlementStatus;
  createTime?: string;
  settleTime?: string;
  paymentMethod?: string;
  remark?: string;
  orderNo: string;
  deposit: number;
  baseRent: number;
  overtimeFee: number;
  damageFee: number;
  totalDeduction: number;
  refundAmount: number;
  refundMethod: RefundMethod;
  operator: string;
  createdAt: string;
  settledAt: string;
}

export interface ExceptionItem {
  id: string;
  ticketNo?: string;
  type?: TicketType;
  status?: TicketStatus;
  orderId?: string;
  vehicleId?: string;
  memberId?: string;
  reporterName?: string;
  reporterPhone?: string;
  description?: string;
  createTime?: string;
  assignTo?: string;
  resolveTime?: string;
  resolveNote?: string;
  lossAmount?: number;
  orderNo: string;
  title: string;
  amount?: number;
  priority: 'low' | 'medium' | 'high';
  reportedAt: string;
  exceptionType: ExceptionType;
  exceptionStatus: ExceptionStatus;
}

export interface Maintenance {
  id: string;
  recordNo: string;
  vehicleId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduleDate: string;
  startDate?: string;
  completeDate?: string;
  technician: string;
  cost: number;
  items: string[];
  remark?: string;
}

export interface DailyReport {
  date: string;
  revenue: number;
  orderCount: number;
  newMembers: number;
}

export interface Filters {
  dateRange: [string, string] | null;
  locationIds: string[];
  vehicleTypes: VehicleType[];
  vehicleStatuses: VehicleStatus[];
  orderStatuses: OrderStatus[];
  memberTags: MemberTag[];
  searchKeyword: string;
}

const vehicleTypeConfig = (type: VehicleType) => {
  const config = VEHICLE_TYPES[type];
  return {
    hourlyRate: config.hourlyRate,
    dailyRate: config.dailyRate,
    deposit: config.deposit,
  };
};

export const locations: Location[] = [
  { id: 'LOC001', name: '万达广场租赁点', type: 'mall', address: '朝阳区建国路88号万达广场B1层', totalSlots: 30, availableSlots: 12, contactPhone: '010-58881234', operatingHours: '09:00-22:00', image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600', availableVehicles: 4, inUseVehicles: 2, maintenanceVehicles: 1, totalVehicles: 7 },
  { id: 'LOC002', name: '颐和园北宫门租赁点', type: 'scenic', address: '海淀区新建宫门路19号', totalSlots: 50, availableSlots: 8, contactPhone: '010-62881234', operatingHours: '06:30-18:00', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600', availableVehicles: 4, inUseVehicles: 2, maintenanceVehicles: 0, totalVehicles: 7 },
  { id: 'LOC003', name: '欢乐谷亲子乐园点', type: 'kids_center', address: '朝阳区东四环小武基北路', totalSlots: 40, availableSlots: 15, contactPhone: '010-67381234', operatingHours: '09:30-21:00', image: 'https://images.unsplash.com/photo-1566837836521-4524ea6c7c71?w=600', availableVehicles: 3, inUseVehicles: 1, maintenanceVehicles: 1, totalVehicles: 6 },
  { id: 'LOC004', name: 'SKP购物中心租赁点', type: 'mall', address: '朝阳区建国路87号SKP 5层', totalSlots: 25, availableSlots: 6, contactPhone: '010-65881234', operatingHours: '10:00-22:00', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600', availableVehicles: 3, inUseVehicles: 2, maintenanceVehicles: 0, totalVehicles: 5 },
  { id: 'LOC005', name: '故宫神武门租赁点', type: 'scenic', address: '东城区景山前街4号', totalSlots: 60, availableSlots: 20, contactPhone: '010-85001234', operatingHours: '07:30-17:00', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600', availableVehicles: 4, inUseVehicles: 1, maintenanceVehicles: 1, totalVehicles: 6 },
  { id: 'LOC006', name: '奈尔宝家庭中心点', type: 'kids_center', address: '朝阳区朝阳公园路6号蓝色港湾', totalSlots: 35, availableSlots: 18, contactPhone: '010-59051234', operatingHours: '10:00-21:30', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600', availableVehicles: 4, inUseVehicles: 1, maintenanceVehicles: 0, totalVehicles: 5 },
];

export const vehicles: Vehicle[] = [
  { id: 'VH001', plateNumber: '京A·童001', type: 'light', status: 'available', locationId: 'LOC001', purchaseDate: '2025-03-15', mileage: 1280, lastMaintenanceDate: '2026-05-10', nextMaintenanceDate: '2026-06-25', rfidTag: 'RF88001', remark: '', ...vehicleTypeConfig('light') },
  { id: 'VH002', plateNumber: '京A·童002', type: 'standard', status: 'in_use', locationId: 'LOC001', purchaseDate: '2025-02-20', mileage: 2150, lastMaintenanceDate: '2026-05-05', nextMaintenanceDate: '2026-06-20', rfidTag: 'RF88002', ...vehicleTypeConfig('standard') },
  { id: 'VH003', plateNumber: '京A·童003', type: 'twin', status: 'available', locationId: 'LOC001', purchaseDate: '2025-04-10', mileage: 960, lastMaintenanceDate: '2026-05-15', nextMaintenanceDate: '2026-06-30', rfidTag: 'RF88003', ...vehicleTypeConfig('twin') },
  { id: 'VH004', plateNumber: '京A·童004', type: 'electric', status: 'maintenance', locationId: 'LOC001', purchaseDate: '2025-01-08', mileage: 3500, lastMaintenanceDate: '2026-04-20', nextMaintenanceDate: '2026-06-15', batteryLevel: 78, rfidTag: 'RF88004', remark: '电机异响待检修', ...vehicleTypeConfig('electric') },
  { id: 'VH005', plateNumber: '京A·童005', type: 'light', status: 'available', locationId: 'LOC002', purchaseDate: '2025-05-22', mileage: 1890, lastMaintenanceDate: '2026-05-12', nextMaintenanceDate: '2026-06-27', rfidTag: 'RF88005', ...vehicleTypeConfig('light') },
  { id: 'VH006', plateNumber: '京A·童006', type: 'standard', status: 'available', locationId: 'LOC002', purchaseDate: '2025-03-30', mileage: 2450, lastMaintenanceDate: '2026-05-08', nextMaintenanceDate: '2026-06-23', rfidTag: 'RF88006', ...vehicleTypeConfig('standard') },
  { id: 'VH007', plateNumber: '京A·童007', type: 'twin', status: 'in_use', locationId: 'LOC002', purchaseDate: '2025-06-12', mileage: 1120, lastMaintenanceDate: '2026-05-18', nextMaintenanceDate: '2026-07-02', rfidTag: 'RF88007', ...vehicleTypeConfig('twin') },
  { id: 'VH008', plateNumber: '京A·童008', type: 'electric', status: 'available', locationId: 'LOC002', purchaseDate: '2025-02-14', mileage: 2980, lastMaintenanceDate: '2026-04-28', nextMaintenanceDate: '2026-06-18', batteryLevel: 92, rfidTag: 'RF88008', ...vehicleTypeConfig('electric') },
  { id: 'VH009', plateNumber: '京A·童009', type: 'light', status: 'frozen', locationId: 'LOC002', purchaseDate: '2024-11-20', mileage: 4200, lastMaintenanceDate: '2026-03-15', nextMaintenanceDate: '2026-06-10', rfidTag: 'RF88009', remark: '待复检，暂停使用', ...vehicleTypeConfig('light') },
  { id: 'VH010', plateNumber: '京A·童010', type: 'standard', status: 'in_use', locationId: 'LOC003', purchaseDate: '2025-04-05', mileage: 1760, lastMaintenanceDate: '2026-05-14', nextMaintenanceDate: '2026-06-29', rfidTag: 'RF88010', ...vehicleTypeConfig('standard') },
  { id: 'VH011', plateNumber: '京A·童011', type: 'twin', status: 'available', locationId: 'LOC003', purchaseDate: '2025-05-18', mileage: 1340, lastMaintenanceDate: '2026-05-20', nextMaintenanceDate: '2026-07-04', rfidTag: 'RF88011', ...vehicleTypeConfig('twin') },
  { id: 'VH012', plateNumber: '京A·童012', type: 'light', status: 'maintenance', locationId: 'LOC003', purchaseDate: '2025-01-25', mileage: 3200, lastMaintenanceDate: '2026-04-10', nextMaintenanceDate: '2026-06-12', rfidTag: 'RF88012', remark: '刹车系统维护', ...vehicleTypeConfig('light') },
  { id: 'VH013', plateNumber: '京A·童013', type: 'electric', status: 'available', locationId: 'LOC003', purchaseDate: '2025-06-28', mileage: 890, lastMaintenanceDate: '2026-05-22', nextMaintenanceDate: '2026-07-06', batteryLevel: 85, rfidTag: 'RF88013', ...vehicleTypeConfig('electric') },
  { id: 'VH014', plateNumber: '京A·童014', type: 'standard', status: 'available', locationId: 'LOC004', purchaseDate: '2025-03-08', mileage: 2050, lastMaintenanceDate: '2026-05-06', nextMaintenanceDate: '2026-06-21', rfidTag: 'RF88014', ...vehicleTypeConfig('standard') },
  { id: 'VH015', plateNumber: '京A·童015', type: 'light', status: 'in_use', locationId: 'LOC004', purchaseDate: '2025-04-22', mileage: 1580, lastMaintenanceDate: '2026-05-16', nextMaintenanceDate: '2026-07-01', rfidTag: 'RF88015', ...vehicleTypeConfig('light') },
  { id: 'VH016', plateNumber: '京A·童016', type: 'twin', status: 'available', locationId: 'LOC004', purchaseDate: '2025-05-05', mileage: 1670, lastMaintenanceDate: '2026-05-11', nextMaintenanceDate: '2026-06-26', rfidTag: 'RF88016', ...vehicleTypeConfig('twin') },
  { id: 'VH017', plateNumber: '京A·童017', type: 'electric', status: 'available', locationId: 'LOC004', purchaseDate: '2025-02-28', mileage: 2760, lastMaintenanceDate: '2026-04-30', nextMaintenanceDate: '2026-06-19', batteryLevel: 68, rfidTag: 'RF88017', ...vehicleTypeConfig('electric') },
  { id: 'VH018', plateNumber: '京A·童018', type: 'standard', status: 'scrapped', locationId: 'LOC004', purchaseDate: '2024-06-15', mileage: 6800, lastMaintenanceDate: '2026-02-20', nextMaintenanceDate: '2026-05-20', rfidTag: 'RF88018', remark: '车架损坏，已报废', ...vehicleTypeConfig('standard') },
  { id: 'VH019', plateNumber: '京A·童019', type: 'light', status: 'available', locationId: 'LOC005', purchaseDate: '2025-05-30', mileage: 1420, lastMaintenanceDate: '2026-05-19', nextMaintenanceDate: '2026-07-03', rfidTag: 'RF88019', ...vehicleTypeConfig('light') },
  { id: 'VH020', plateNumber: '京A·童020', type: 'standard', status: 'in_use', locationId: 'LOC005', purchaseDate: '2025-04-12', mileage: 2380, lastMaintenanceDate: '2026-05-04', nextMaintenanceDate: '2026-06-19', rfidTag: 'RF88020', ...vehicleTypeConfig('standard') },
  { id: 'VH021', plateNumber: '京A·童021', type: 'twin', status: 'available', locationId: 'LOC005', purchaseDate: '2025-06-08', mileage: 1150, lastMaintenanceDate: '2026-05-17', nextMaintenanceDate: '2026-07-01', rfidTag: 'RF88021', ...vehicleTypeConfig('twin') },
  { id: 'VH022', plateNumber: '京A·童022', type: 'electric', status: 'maintenance', locationId: 'LOC005', purchaseDate: '2025-01-20', mileage: 3850, lastMaintenanceDate: '2026-03-25', nextMaintenanceDate: '2026-06-14', batteryLevel: 45, rfidTag: 'RF88022', remark: '电池老化待更换', ...vehicleTypeConfig('electric') },
  { id: 'VH023', plateNumber: '京A·童023', type: 'light', status: 'available', locationId: 'LOC005', purchaseDate: '2025-05-10', mileage: 1650, lastMaintenanceDate: '2026-05-13', nextMaintenanceDate: '2026-06-28', rfidTag: 'RF88023', ...vehicleTypeConfig('light') },
  { id: 'VH024', plateNumber: '京A·童024', type: 'standard', status: 'available', locationId: 'LOC006', purchaseDate: '2025-04-01', mileage: 1920, lastMaintenanceDate: '2026-05-09', nextMaintenanceDate: '2026-06-24', rfidTag: 'RF88024', ...vehicleTypeConfig('standard') },
  { id: 'VH025', plateNumber: '京A·童025', type: 'twin', status: 'in_use', locationId: 'LOC006', purchaseDate: '2025-06-15', mileage: 1080, lastMaintenanceDate: '2026-05-21', nextMaintenanceDate: '2026-07-05', rfidTag: 'RF88025', ...vehicleTypeConfig('twin') },
  { id: 'VH026', plateNumber: '京A·童026', type: 'electric', status: 'available', locationId: 'LOC006', purchaseDate: '2025-03-05', mileage: 2550, lastMaintenanceDate: '2026-04-25', nextMaintenanceDate: '2026-06-16', batteryLevel: 90, rfidTag: 'RF88026', ...vehicleTypeConfig('electric') },
  { id: 'VH027', plateNumber: '京A·童027', type: 'light', status: 'available', locationId: 'LOC006', purchaseDate: '2025-05-28', mileage: 1380, lastMaintenanceDate: '2026-05-16', nextMaintenanceDate: '2026-06-30', rfidTag: 'RF88027', ...vehicleTypeConfig('light') },
  { id: 'VH028', plateNumber: '京A·童028', type: 'standard', status: 'maintenance', locationId: 'LOC006', purchaseDate: '2025-02-10', mileage: 3100, lastMaintenanceDate: '2026-04-15', nextMaintenanceDate: '2026-06-13', rfidTag: 'RF88028', remark: '客户投诉座椅问题处理中', ...vehicleTypeConfig('standard') },
  { id: 'VH029', plateNumber: '京A·童029', type: 'twin', status: 'available', locationId: 'LOC001', purchaseDate: '2025-06-20', mileage: 820, lastMaintenanceDate: '2026-05-23', nextMaintenanceDate: '2026-07-07', rfidTag: 'RF88029', ...vehicleTypeConfig('twin') },
  { id: 'VH030', plateNumber: '京A·童030', type: 'light', status: 'available', locationId: 'LOC002', purchaseDate: '2025-06-01', mileage: 1100, lastMaintenanceDate: '2026-05-18', nextMaintenanceDate: '2026-07-02', rfidTag: 'RF88030', ...vehicleTypeConfig('light') },
  { id: 'VH031', plateNumber: '京A·童031', type: 'standard', status: 'frozen', locationId: 'LOC003', purchaseDate: '2024-12-10', mileage: 4500, lastMaintenanceDate: '2026-03-05', nextMaintenanceDate: '2026-06-08', rfidTag: 'RF88031', remark: '疑似丢失，调查中', ...vehicleTypeConfig('standard') },
  { id: 'VH032', plateNumber: '京A·童032', type: 'standard', status: 'in_use', locationId: 'LOC004', purchaseDate: '2025-05-15', mileage: 1720, lastMaintenanceDate: '2026-05-07', nextMaintenanceDate: '2026-06-22', rfidTag: 'RF88032', ...vehicleTypeConfig('standard') },
];

export const members: Member[] = [
  { id: 'MB001', name: '张小明', phone: '13800000001', tags: ['gold'], registerDate: '2024-03-15', totalOrders: 42, totalSpent: 8600, balance: 580, points: 5720, avatar: '', idCard: '110101199201011234', lastActiveDate: '2026-06-12' },
  { id: 'MB002', name: '李美丽', phone: '13800000002', tags: ['silver'], registerDate: '2024-06-20', totalOrders: 28, totalSpent: 4200, balance: 320, points: 2780, avatar: '', idCard: '110101199505052345', lastActiveDate: '2026-06-11' },
  { id: 'MB003', name: '王建国', phone: '13800000003', tags: ['vip'], registerDate: '2024-01-10', totalOrders: 68, totalSpent: 12800, balance: 1200, points: 8560, avatar: '', idCard: '110101198808083456', lastActiveDate: '2026-06-12' },
  { id: 'MB004', name: '赵雅琴', phone: '13800000004', tags: ['diamond'], registerDate: '2023-11-05', totalOrders: 126, totalSpent: 25600, balance: 2800, points: 17200, avatar: '', idCard: '110101198512124567', lastActiveDate: '2026-06-10' },
  { id: 'MB005', name: '陈志刚', phone: '13800000005', tags: ['normal'], registerDate: '2025-01-08', totalOrders: 12, totalSpent: 960, balance: 100, points: 640, avatar: '', idCard: '110101199303035678', lastActiveDate: '2026-06-12' },
  { id: 'MB006', name: '刘美玲', phone: '13800000006', tags: ['diamond'], registerDate: '2024-05-20', totalOrders: 95, totalSpent: 15600, balance: 3200, points: 10400, avatar: '', idCard: '110101198607076789', lastActiveDate: '2026-06-12' },
  { id: 'MB007', name: '孙大伟', phone: '13800000007', tags: ['gold'], registerDate: '2024-09-10', totalOrders: 46, totalSpent: 6800, balance: 750, points: 4520, avatar: '', idCard: '110101199102027890', lastActiveDate: '2026-06-11' },
  { id: 'MB008', name: '周小玲', phone: '13800000008', tags: ['vip'], registerDate: '2024-11-25', totalOrders: 32, totalSpent: 4200, balance: 420, points: 2800, avatar: '', idCard: '110101199406068901', lastActiveDate: '2026-06-10' },
  { id: 'MB009', name: '吴国强', phone: '13800000009', tags: ['silver'], registerDate: '2025-02-18', totalOrders: 18, totalSpent: 2100, balance: 260, points: 1400, avatar: '', idCard: '110101198904049012', lastActiveDate: '2026-06-11' },
  { id: 'MB010', name: '郑雨欣', phone: '13800000010', tags: ['normal'], registerDate: '2025-04-12', totalOrders: 8, totalSpent: 560, balance: 50, points: 370, avatar: '', idCard: '110101199710100123', lastActiveDate: '2026-06-10' },
  { id: 'MB011', name: '冯海涛', phone: '13800000011', tags: ['diamond'], registerDate: '2024-07-01', totalOrders: 78, totalSpent: 11200, balance: 1890, points: 7480, avatar: '', idCard: '110101198709091234', lastActiveDate: '2026-06-11' },
  { id: 'MB012', name: '何秀兰', phone: '13800000012', tags: ['gold'], registerDate: '2024-08-30', totalOrders: 55, totalSpent: 8100, balance: 1050, points: 5400, avatar: '', idCard: '110101199011112345', lastActiveDate: '2026-06-10' },
  { id: 'MB013', name: '黄志强', phone: '13800000013', tags: ['normal'], registerDate: '2025-05-08', totalOrders: 5, totalSpent: 320, balance: 20, points: 210, avatar: '', idCard: '110101199603033456', lastActiveDate: '2026-06-07' },
  { id: 'MB014', name: '罗晓燕', phone: '13800000014', tags: ['silver'], registerDate: '2025-03-28', totalOrders: 15, totalSpent: 1780, balance: 180, points: 1180, avatar: '', idCard: '110101199207074567', lastActiveDate: '2026-06-09' },
  { id: 'MB015', name: '谢明辉', phone: '13800000015', tags: ['vip'], registerDate: '2024-12-15', totalOrders: 28, totalSpent: 3900, balance: 380, points: 2600, avatar: '', idCard: '110101198912125678', lastActiveDate: '2026-06-09' },
  { id: 'MB016', name: '韩雪梅', phone: '13800000016', tags: ['normal'], registerDate: '2025-05-20', totalOrders: 3, totalSpent: 180, balance: 0, points: 120, avatar: '', idCard: '110101199805056789', lastActiveDate: '2026-06-12' },
];

const now = new Date().toISOString();

export const orders: Order[] = [
  { id: 'OR001', orderNo: 'RD202606121001', memberId: 'MB001', vehicleId: 'VH002', locationId: 'LOC001', pickUpLocationId: 'LOC001', pickUpTime: '2026-06-12 09:30:00', expectedReturnTime: '2026-06-12 12:30:00', status: 'active', childAge: 4, parentName: '张小明', parentPhone: '13800000001', startTime: '2026-06-12T09:30:00Z', endTime: '2026-06-12T12:30:00Z', rentalType: 'hourly', baseRent: 36, deposit: 300, overtimeFee: 0, damageFee: 0, totalAmount: 336, paymentMethod: 'wechat', createdAt: '2026-06-12T09:25:00Z', updatedAt: now, remark: '' },
  { id: 'OR002', orderNo: 'RD202606121002', memberId: 'MB003', vehicleId: 'VH007', locationId: 'LOC002', pickUpLocationId: 'LOC002', pickUpTime: '2026-06-12 10:15:00', expectedReturnTime: '2026-06-12 15:15:00', status: 'extended', childAge: 5, parentName: '王建国', parentPhone: '13800000003', startTime: '2026-06-12T10:15:00Z', endTime: '2026-06-12T15:15:00Z', rentalType: 'hourly', baseRent: 90, deposit: 500, overtimeFee: 0, damageFee: 0, totalAmount: 590, paymentMethod: 'alipay', createdAt: '2026-06-12T10:10:00Z', updatedAt: '2026-06-12T13:00:00Z', remark: '' },
  { id: 'OR003', orderNo: 'RD202606121003', memberId: 'MB005', vehicleId: 'VH020', locationId: 'LOC005', pickUpLocationId: 'LOC005', pickUpTime: '2026-06-12 08:00:00', expectedReturnTime: '2026-06-12 11:00:00', status: 'exception', childAge: 3, parentName: '陈志刚', parentPhone: '13800000005', startTime: '2026-06-12T08:00:00Z', endTime: '2026-06-12T11:00:00Z', rentalType: 'hourly', baseRent: 36, deposit: 300, overtimeFee: 36, damageFee: 0, refundAmount: 264, totalAmount: 372, paymentMethod: 'wechat', createdAt: '2026-06-12T07:55:00Z', updatedAt: now, remark: '超时未归还' },
  { id: 'OR004', orderNo: 'RD202606121004', memberId: 'MB006', vehicleId: 'VH025', locationId: 'LOC006', pickUpLocationId: 'LOC006', pickUpTime: '2026-06-12 11:00:00', expectedReturnTime: '2026-06-12 14:00:00', status: 'active', childAge: 6, parentName: '刘美玲', parentPhone: '13800000006', startTime: '2026-06-12T11:00:00Z', endTime: '2026-06-12T14:00:00Z', rentalType: 'hourly', baseRent: 54, deposit: 500, overtimeFee: 0, damageFee: 0, totalAmount: 554, paymentMethod: 'balance', createdAt: '2026-06-12T10:55:00Z', updatedAt: now, remark: '' },
  { id: 'OR005', orderNo: 'RD20260611015', memberId: 'MB002', vehicleId: 'VH006', locationId: 'LOC002', pickUpLocationId: 'LOC002', returnLocationId: 'LOC002', pickUpTime: '2026-06-11 14:30:00', expectedReturnTime: '2026-06-11 17:30:00', actualReturnTime: '2026-06-11 17:45:00', status: 'returned', childAge: 4, parentName: '李美丽', parentPhone: '13800000002', startTime: '2026-06-11T14:30:00Z', endTime: '2026-06-11T17:30:00Z', actualEndTime: '2026-06-11T17:45:00Z', rentalType: 'hourly', baseRent: 36, deposit: 300, overtimeFee: 9, damageFee: 0, refundAmount: 291, totalAmount: 341.4, paymentMethod: 'card', createdAt: '2026-06-11T14:25:00Z', updatedAt: '2026-06-11T18:10:00Z', remark: '' },
  { id: 'OR006', orderNo: 'RD20260611016', memberId: 'MB007', vehicleId: 'VH016', locationId: 'LOC004', pickUpLocationId: 'LOC004', returnLocationId: 'LOC004', pickUpTime: '2026-06-11 10:00:00', expectedReturnTime: '2026-06-11 16:00:00', actualReturnTime: '2026-06-11 15:50:00', status: 'settled', childAge: 5, parentName: '孙大伟', parentPhone: '13800000007', startTime: '2026-06-11T10:00:00Z', endTime: '2026-06-11T16:00:00Z', actualEndTime: '2026-06-11T15:50:00Z', rentalType: 'hourly', baseRent: 108, deposit: 500, overtimeFee: 0, damageFee: 0, refundAmount: 500, totalAmount: 608, paymentMethod: 'wechat', createdAt: '2026-06-11T09:55:00Z', updatedAt: '2026-06-11T16:00:00Z', remark: '' },
  { id: 'OR007', orderNo: 'RD20260611017', memberId: 'MB009', vehicleId: 'VH010', locationId: 'LOC003', pickUpLocationId: 'LOC003', pickUpTime: '2026-06-11 09:00:00', expectedReturnTime: '2026-06-11 12:00:00', status: 'exception', childAge: 2, parentName: '吴国强', parentPhone: '13800000009', startTime: '2026-06-11T09:00:00Z', endTime: '2026-06-11T12:00:00Z', rentalType: 'hourly', baseRent: 36, deposit: 300, overtimeFee: 72, damageFee: 0, refundAmount: 228, totalAmount: 408, paymentMethod: 'alipay', createdAt: '2026-06-11T08:55:00Z', updatedAt: now, remark: '严重超时' },
  { id: 'OR008', orderNo: 'RD20260611018', memberId: 'MB011', vehicleId: 'VH015', locationId: 'LOC004', pickUpLocationId: 'LOC004', returnLocationId: 'LOC004', pickUpTime: '2026-06-11 15:30:00', expectedReturnTime: '2026-06-11 18:30:00', actualReturnTime: '2026-06-11 19:10:00', status: 'settled', childAge: 3, parentName: '冯海涛', parentPhone: '13800000011', startTime: '2026-06-11T15:30:00Z', endTime: '2026-06-11T18:30:00Z', actualEndTime: '2026-06-11T19:10:00Z', rentalType: 'hourly', baseRent: 24, deposit: 200, overtimeFee: 16, damageFee: 0, refundAmount: 184, totalAmount: 236.8, paymentMethod: 'wechat', createdAt: '2026-06-11T15:25:00Z', updatedAt: '2026-06-11T19:30:00Z', remark: '' },
  { id: 'OR009', orderNo: 'RD20260610012', memberId: 'MB004', vehicleId: 'VH008', locationId: 'LOC002', pickUpLocationId: 'LOC002', returnLocationId: 'LOC002', pickUpTime: '2026-06-10 13:00:00', expectedReturnTime: '2026-06-10 16:00:00', actualReturnTime: '2026-06-10 15:45:00', status: 'settled', childAge: 5, parentName: '赵雅琴', parentPhone: '13800000004', startTime: '2026-06-10T13:00:00Z', endTime: '2026-06-10T16:00:00Z', actualEndTime: '2026-06-10T15:45:00Z', rentalType: 'hourly', baseRent: 75, deposit: 800, overtimeFee: 0, damageFee: 0, refundAmount: 800, totalAmount: 871.25, paymentMethod: 'wechat', createdAt: '2026-06-10T12:55:00Z', updatedAt: '2026-06-10T16:05:00Z', remark: '' },
  { id: 'OR010', orderNo: 'RD20260610013', memberId: 'MB008', vehicleId: 'VH021', locationId: 'LOC005', pickUpLocationId: 'LOC005', returnLocationId: 'LOC005', pickUpTime: '2026-06-10 09:30:00', expectedReturnTime: '2026-06-10 14:30:00', actualReturnTime: '2026-06-10 14:20:00', status: 'settled', childAge: 6, parentName: '周小玲', parentPhone: '13800000008', startTime: '2026-06-10T09:30:00Z', endTime: '2026-06-10T14:30:00Z', actualEndTime: '2026-06-10T14:20:00Z', rentalType: 'hourly', baseRent: 90, deposit: 500, overtimeFee: 0, damageFee: 0, refundAmount: 500, totalAmount: 576.5, paymentMethod: 'alipay', createdAt: '2026-06-10T09:25:00Z', updatedAt: '2026-06-10T14:45:00Z', remark: '' },
  { id: 'OR011', orderNo: 'RD20260610014', memberId: 'MB012', vehicleId: 'VH014', locationId: 'LOC004', pickUpLocationId: 'LOC004', returnLocationId: 'LOC004', pickUpTime: '2026-06-10 11:00:00', expectedReturnTime: '2026-06-10 13:00:00', actualReturnTime: '2026-06-10 13:30:00', status: 'settled', childAge: 4, parentName: '何秀兰', parentPhone: '13800000012', startTime: '2026-06-10T11:00:00Z', endTime: '2026-06-10T13:00:00Z', actualEndTime: '2026-06-10T13:30:00Z', rentalType: 'hourly', baseRent: 24, deposit: 300, overtimeFee: 9, damageFee: 0, refundAmount: 291, totalAmount: 330.3, paymentMethod: 'wechat', createdAt: '2026-06-10T10:55:00Z', updatedAt: '2026-06-10T14:00:00Z', remark: '' },
  { id: 'OR012', orderNo: 'RD20260609009', memberId: 'MB015', vehicleId: 'VH023', locationId: 'LOC005', pickUpLocationId: 'LOC005', returnLocationId: 'LOC005', pickUpTime: '2026-06-09 10:00:00', expectedReturnTime: '2026-06-09 12:00:00', actualReturnTime: '2026-06-09 11:50:00', status: 'settled', childAge: 5, parentName: '谢明辉', parentPhone: '13800000015', startTime: '2026-06-09T10:00:00Z', endTime: '2026-06-09T12:00:00Z', actualEndTime: '2026-06-09T11:50:00Z', rentalType: 'hourly', baseRent: 16, deposit: 200, overtimeFee: 0, damageFee: 0, refundAmount: 200, totalAmount: 213.6, paymentMethod: 'wechat', createdAt: '2026-06-09T09:55:00Z', updatedAt: '2026-06-09T12:10:00Z', remark: '' },
  { id: 'OR013', orderNo: 'RD20260609010', memberId: 'MB001', vehicleId: 'VH013', locationId: 'LOC003', pickUpLocationId: 'LOC003', returnLocationId: 'LOC003', pickUpTime: '2026-06-09 14:00:00', expectedReturnTime: '2026-06-09 20:00:00', actualReturnTime: '2026-06-09 19:30:00', status: 'settled', childAge: 3, parentName: '张小明', parentPhone: '13800000001', startTime: '2026-06-09T14:00:00Z', endTime: '2026-06-09T20:00:00Z', actualEndTime: '2026-06-09T19:30:00Z', rentalType: 'daily', baseRent: 150, deposit: 800, overtimeFee: 0, damageFee: 0, refundAmount: 800, totalAmount: 920, paymentMethod: 'card', createdAt: '2026-06-09T13:55:00Z', updatedAt: '2026-06-09T20:05:00Z', remark: '' },
  { id: 'OR021', orderNo: 'RD202606121005', memberId: 'MB016', vehicleId: 'VH015', locationId: 'LOC004', pickUpLocationId: 'LOC004', pickUpTime: '2026-06-12 13:30:00', expectedReturnTime: '2026-06-12 15:30:00', status: 'active', childAge: 3, parentName: '韩雪梅', parentPhone: '13800000016', startTime: '2026-06-12T13:30:00Z', endTime: '2026-06-12T15:30:00Z', rentalType: 'hourly', baseRent: 16, deposit: 200, overtimeFee: 0, damageFee: 0, totalAmount: 216, paymentMethod: 'wechat', createdAt: '2026-06-12T13:25:00Z', updatedAt: now, remark: '' },
  { id: 'OR032', orderNo: 'RD202606121006', vehicleId: 'VH032', locationId: 'LOC004', pickUpLocationId: 'LOC004', pickUpTime: '2026-06-12 14:00:00', expectedReturnTime: '2026-06-12 17:00:00', status: 'active', childAge: 5, parentName: '临时客户', parentPhone: '13900001234', startTime: '2026-06-12T14:00:00Z', endTime: '2026-06-12T17:00:00Z', rentalType: 'hourly', baseRent: 36, deposit: 300, overtimeFee: 0, damageFee: 0, totalAmount: 336, paymentMethod: 'alipay', createdAt: '2026-06-12T13:55:00Z', updatedAt: now, remark: '非会员订单' },
];

export const settlements: Settlement[] = [
  { id: 'ST001', settlementNo: 'JS202606120001', orderId: 'OR005', memberId: 'MB002', amount: 341.4, status: 'completed', createTime: '2026-06-11 14:30:00', settleTime: '2026-06-11 17:50:00', paymentMethod: '银行卡', orderNo: 'RD20260611015', deposit: 300, baseRent: 36, overtimeFee: 9, damageFee: 0, totalDeduction: 45, refundAmount: 255, refundMethod: 'original', operator: '前台小王', createdAt: '2026-06-11T14:30:00Z', settledAt: '2026-06-11T17:50:00Z' },
  { id: 'ST002', settlementNo: 'JS202606110002', orderId: 'OR006', memberId: 'MB007', amount: 597.2, status: 'completed', createTime: '2026-06-11 10:00:00', settleTime: '2026-06-11 15:55:00', paymentMethod: '微信支付', orderNo: 'RD20260611016', deposit: 500, baseRent: 108, overtimeFee: 0, damageFee: 0, totalDeduction: 108, refundAmount: 392, refundMethod: 'original', operator: '前台小李', createdAt: '2026-06-11T10:00:00Z', settledAt: '2026-06-11T15:55:00Z' },
  { id: 'ST003', settlementNo: 'JS202606100003', orderId: 'OR008', memberId: 'MB011', amount: 236.8, status: 'completed', createTime: '2026-06-11 15:30:00', settleTime: '2026-06-11 19:30:00', paymentMethod: '微信支付', orderNo: 'RD20260611018', deposit: 200, baseRent: 24, overtimeFee: 16, damageFee: 0, totalDeduction: 40, refundAmount: 160, refundMethod: 'original', operator: '前台小张', createdAt: '2026-06-11T15:30:00Z', settledAt: '2026-06-11T19:30:00Z' },
  { id: 'ST004', settlementNo: 'JS202606100004', orderId: 'OR009', memberId: 'MB004', amount: 871.25, status: 'completed', createTime: '2026-06-10 13:00:00', settleTime: '2026-06-10 15:50:00', paymentMethod: '微信支付', orderNo: 'RD20260610012', deposit: 800, baseRent: 75, overtimeFee: 0, damageFee: 0, totalDeduction: 75, refundAmount: 725, refundMethod: 'original', operator: '前台小张', createdAt: '2026-06-10T13:00:00Z', settledAt: '2026-06-10T15:50:00Z' },
  { id: 'ST005', settlementNo: 'JS202606100005', orderId: 'OR010', memberId: 'MB008', amount: 576.5, status: 'completed', createTime: '2026-06-10 09:30:00', settleTime: '2026-06-10 14:25:00', paymentMethod: '支付宝', orderNo: 'RD20260610013', deposit: 500, baseRent: 90, overtimeFee: 0, damageFee: 0, totalDeduction: 90, refundAmount: 410, refundMethod: 'original', operator: '前台小李', createdAt: '2026-06-10T09:30:00Z', settledAt: '2026-06-10T14:25:00Z' },
  { id: 'ST006', settlementNo: 'JS202606100006', orderId: 'OR011', memberId: 'MB012', amount: 330.3, status: 'completed', createTime: '2026-06-10 11:00:00', settleTime: '2026-06-10 13:40:00', paymentMethod: '微信支付', orderNo: 'RD20260610014', deposit: 300, baseRent: 24, overtimeFee: 9, damageFee: 0, totalDeduction: 33, refundAmount: 267, refundMethod: 'original', operator: '前台小王', createdAt: '2026-06-10T11:00:00Z', settledAt: '2026-06-10T13:40:00Z' },
  { id: 'ST007', settlementNo: 'JS202606090007', orderId: 'OR012', memberId: 'MB015', amount: 213.6, status: 'completed', createTime: '2026-06-09 10:00:00', settleTime: '2026-06-09 12:05:00', paymentMethod: '微信支付', orderNo: 'RD20260609009', deposit: 200, baseRent: 16, overtimeFee: 0, damageFee: 0, totalDeduction: 16, refundAmount: 184, refundMethod: 'original', operator: '前台小王', createdAt: '2026-06-09T10:00:00Z', settledAt: '2026-06-09T12:05:00Z' },
  { id: 'ST008', settlementNo: 'JS202606090008', orderId: 'OR013', memberId: 'MB001', amount: 920, status: 'completed', createTime: '2026-06-09 14:00:00', settleTime: '2026-06-09 20:00:00', paymentMethod: '银行卡', orderNo: 'RD20260609010', deposit: 800, baseRent: 150, overtimeFee: 0, damageFee: 0, totalDeduction: 150, refundAmount: 650, refundMethod: 'original', operator: '前台小李', createdAt: '2026-06-09T14:00:00Z', settledAt: '2026-06-09T20:00:00Z' },
];

export const exceptions: ExceptionItem[] = [
  { id: 'TK001', ticketNo: 'GZ202606120001', type: 'damage', status: 'open', orderId: 'OR005', vehicleId: 'VH006', memberId: 'MB002', reporterName: '李娜', reporterPhone: '13900000001', description: '还车时发现儿童脚踏板有明显裂痕', createTime: '2026-06-12 14:30:00', lossAmount: 150, orderNo: 'RD20260611015', title: '车辆脚踏板损坏', amount: 150, priority: 'medium', reportedAt: '2026-06-12T14:30:00Z', exceptionType: 'damage', exceptionStatus: 'pending' },
  { id: 'TK002', ticketNo: 'GZ202606120002', type: 'other', status: 'processing', orderId: 'OR002', vehicleId: 'VH007', memberId: 'MB003', reporterName: '前台操作员', reporterPhone: '13900000002', description: '订单已超过预计还车时间30分钟', createTime: '2026-06-12 15:45:00', orderNo: 'RD202606121002', title: '订单超时未归还', priority: 'high', reportedAt: '2026-06-12T15:45:00Z', exceptionType: 'overtime', exceptionStatus: 'processing' },
  { id: 'TK003', ticketNo: 'GZ202606110003', type: 'complaint', status: 'resolved', orderId: 'OR005', memberId: 'MB002', reporterName: '李美丽', reporterPhone: '13800000002', description: '投诉取车时车辆清洁不到位', createTime: '2026-06-11 14:45:00', assignTo: '客服小李', resolveTime: '2026-06-11 16:00:00', resolveNote: '已道歉并赠送优惠券', orderNo: 'RD20260611015', title: '车辆清洁投诉', priority: 'low', reportedAt: '2026-06-11T14:45:00Z', exceptionType: 'complaint', exceptionStatus: 'resolved' },
  { id: 'TK004', ticketNo: 'GZ202606110004', type: 'damage', status: 'closed', orderId: 'OR008', vehicleId: 'VH015', memberId: 'MB011', reporterName: '赵技师', reporterPhone: '13900000003', description: '归还车辆时发现前轮刹车片磨损严重', createTime: '2026-06-11 19:20:00', lossAmount: 80, assignTo: '客服小王', resolveTime: '2026-06-11 20:30:00', resolveNote: '客户同意承担维修费用，已从押金扣除', orderNo: 'RD20260611018', title: '刹车片异常磨损', amount: 80, priority: 'medium', reportedAt: '2026-06-11T19:20:00Z', exceptionType: 'damage', exceptionStatus: 'closed' },
  { id: 'TK005', ticketNo: 'GZ202606100005', type: 'other', status: 'closed', orderId: 'OR011', memberId: 'MB012', reporterName: '郑雨欣', reporterPhone: '13800000010', description: 'APP还车功能故障，多扣费用', createTime: '2026-06-10 18:40:00', assignTo: '技术部小陈', resolveTime: '2026-06-10 20:00:00', resolveNote: '已修复bug，退还费用并赠送时长', orderNo: 'RD202606100014', title: 'APP功能故障', priority: 'high', reportedAt: '2026-06-10T18:40:00Z', exceptionType: 'other', exceptionStatus: 'closed' },
  { id: 'TK006', ticketNo: 'GZ202606120003', type: 'lost', status: 'open', orderId: 'OR003', vehicleId: 'VH020', memberId: 'MB005', reporterName: '王师傅', reporterPhone: '13900000004', description: '车辆逾期未归还，联系不上客户', createTime: '2026-06-12 13:00:00', lossAmount: 3000, assignTo: '张经理', orderNo: 'RD202606121003', title: '疑似车辆丢失', amount: 3000, priority: 'high', reportedAt: '2026-06-12T13:00:00Z', exceptionType: 'lost', exceptionStatus: 'pending' },
  { id: 'TK007', ticketNo: 'GZ202606110007', type: 'damage', status: 'resolved', vehicleId: 'VH018', reporterName: '巡检员老刘', reporterPhone: '13900000005', description: '日常巡检发现车架焊接处有裂缝', createTime: '2026-06-11 09:00:00', assignTo: '运维部王工', resolveTime: '2026-06-11 17:00:00', resolveNote: '无法修复，已申请报废', orderNo: 'N/A', title: '车架安全隐患', priority: 'high', reportedAt: '2026-06-11T09:00:00Z', exceptionType: 'damage', exceptionStatus: 'resolved' },
  { id: 'TK008', ticketNo: 'GZ202606120004', type: 'complaint', status: 'processing', orderId: 'OR001', memberId: 'MB001', reporterName: '张小明', reporterPhone: '13800000001', description: '会员折扣计算有误', createTime: '2026-06-12 10:00:00', assignTo: '客服小李', orderNo: 'RD202606121001', title: '折扣异常投诉', priority: 'medium', reportedAt: '2026-06-12T10:00:00Z', exceptionType: 'complaint', exceptionStatus: 'processing' },
];

export const maintenance: Maintenance[] = [
  { id: 'MR001', recordNo: 'WX202606120001', vehicleId: 'VH004', type: 'repair', status: 'in_progress', scheduleDate: '2026-06-12', startDate: '2026-06-12 09:00:00', technician: '王师傅', cost: 350, items: ['电机检测', '电机轴承更换', '线路排查'], remark: '电机异响问题处理中' },
  { id: 'MR002', recordNo: 'WX202606120002', vehicleId: 'VH022', type: 'parts_replace', status: 'scheduled', scheduleDate: '2026-06-14', technician: '李师傅', cost: 1200, items: ['电池组更换', '电池仓清洁', '充电接口检查'], remark: '电池老化，容量下降明显' },
  { id: 'MR003', recordNo: 'WX202606110003', vehicleId: 'VH012', type: 'repair', status: 'completed', scheduleDate: '2026-06-11', startDate: '2026-06-11 08:30:00', completeDate: '2026-06-11 14:00:00', technician: '张师傅', cost: 280, items: ['刹车系统检查', '刹车片更换', '刹车油补充'] },
  { id: 'MR004', recordNo: 'WX202606100004', vehicleId: 'VH001', type: 'routine', status: 'completed', scheduleDate: '2026-06-10', startDate: '2026-06-10 10:00:00', completeDate: '2026-06-10 11:30:00', technician: '赵师傅', cost: 80, items: ['全车检查', '轮胎充气', '螺丝紧固', '润滑保养'] },
  { id: 'MR005', recordNo: 'WX202606100005', vehicleId: 'VH006', type: 'cleaning', status: 'completed', scheduleDate: '2026-06-10', startDate: '2026-06-10 14:00:00', completeDate: '2026-06-10 15:30:00', technician: '清洁组小王', cost: 50, items: ['座椅深度清洁', '遮阳棚清洗', '金属部件除锈', '全车消毒'] },
  { id: 'MR006', recordNo: 'WX202606090006', vehicleId: 'VH018', type: 'repair', status: 'cancelled', scheduleDate: '2026-06-09', technician: '王师傅', cost: 0, items: ['车架焊接修复'], remark: '评估后无法修复，转报废处理' },
  { id: 'MR007', recordNo: 'WX202606090007', vehicleId: 'VH020', type: 'routine', status: 'completed', scheduleDate: '2026-06-08', startDate: '2026-06-08 09:00:00', completeDate: '2026-06-08 10:20:00', technician: '李师傅', cost: 80, items: ['全车检查', '轮胎磨损检查', '转向系统检查'] },
  { id: 'MR008', recordNo: 'WX202606080008', vehicleId: 'VH013', type: 'parts_replace', status: 'completed', scheduleDate: '2026-06-08', startDate: '2026-06-08 10:00:00', completeDate: '2026-06-08 16:00:00', technician: '张师傅', cost: 680, items: ['控制器更换', '线路重新布置', '功能测试'] },
  { id: 'MR009', recordNo: 'WX202606120003', vehicleId: 'VH009', type: 'routine', status: 'scheduled', scheduleDate: '2026-06-15', technician: '赵师傅', cost: 80, items: ['复检全车部件', '功能测试', '安全评估'] },
  { id: 'MR010', recordNo: 'WX202606120004', vehicleId: 'VH028', type: 'repair', status: 'in_progress', scheduleDate: '2026-06-12', startDate: '2026-06-12 10:30:00', technician: '王师傅', cost: 200, items: ['客户投诉问题排查', '座椅舒适度调整', '安全带检查'], remark: '处理客户投诉问题' },
  { id: 'MR011', recordNo: 'WX202606070011', vehicleId: 'VH025', type: 'cleaning', status: 'completed', scheduleDate: '2026-06-07', startDate: '2026-06-07 15:00:00', completeDate: '2026-06-07 16:30:00', technician: '清洁组小李', cost: 50, items: ['座椅清洁消毒', '遮阳棚清洗', '储物袋清洗'] },
];

export const reports: DailyReport[] = [
  { date: '2026-05-14', revenue: 28600, orderCount: 156, newMembers: 8 },
  { date: '2026-05-15', revenue: 45600, orderCount: 245, newMembers: 15 },
  { date: '2026-05-16', revenue: 48200, orderCount: 258, newMembers: 18 },
  { date: '2026-05-17', revenue: 32500, orderCount: 178, newMembers: 9 },
  { date: '2026-05-18', revenue: 29800, orderCount: 165, newMembers: 7 },
  { date: '2026-05-19', revenue: 31200, orderCount: 172, newMembers: 10 },
  { date: '2026-05-20', revenue: 35600, orderCount: 192, newMembers: 12 },
  { date: '2026-05-21', revenue: 38900, orderCount: 210, newMembers: 11 },
  { date: '2026-05-22', revenue: 42500, orderCount: 228, newMembers: 13 },
  { date: '2026-05-23', revenue: 56800, orderCount: 305, newMembers: 22 },
  { date: '2026-05-24', revenue: 59200, orderCount: 318, newMembers: 25 },
  { date: '2026-05-25', revenue: 34500, orderCount: 186, newMembers: 10 },
  { date: '2026-05-26', revenue: 30800, orderCount: 168, newMembers: 8 },
  { date: '2026-05-27', revenue: 32100, orderCount: 174, newMembers: 9 },
  { date: '2026-05-28', revenue: 36800, orderCount: 198, newMembers: 11 },
  { date: '2026-05-29', revenue: 41200, orderCount: 222, newMembers: 14 },
  { date: '2026-05-30', revenue: 58600, orderCount: 315, newMembers: 24 },
  { date: '2026-05-31', revenue: 61500, orderCount: 332, newMembers: 28 },
  { date: '2026-06-01', revenue: 35200, orderCount: 190, newMembers: 11 },
  { date: '2026-06-02', revenue: 31800, orderCount: 172, newMembers: 8 },
  { date: '2026-06-03', revenue: 33500, orderCount: 182, newMembers: 10 },
  { date: '2026-06-04', revenue: 38200, orderCount: 206, newMembers: 13 },
  { date: '2026-06-05', revenue: 43800, orderCount: 236, newMembers: 16 },
  { date: '2026-06-06', revenue: 58600, orderCount: 315, newMembers: 22 },
  { date: '2026-06-07', revenue: 61200, orderCount: 328, newMembers: 25 },
  { date: '2026-06-08', revenue: 36800, orderCount: 198, newMembers: 12 },
  { date: '2026-06-09', revenue: 39500, orderCount: 212, newMembers: 13 },
  { date: '2026-06-10', revenue: 45200, orderCount: 244, newMembers: 16 },
  { date: '2026-06-11', revenue: 48600, orderCount: 262, newMembers: 18 },
  { date: '2026-06-12', revenue: 28500, orderCount: 152, newMembers: 6 },
];

export const initialFilters: Filters = {
  dateRange: null,
  locationIds: [],
  vehicleTypes: [],
  vehicleStatuses: [],
  orderStatuses: [],
  memberTags: [],
  searchKeyword: '',
};
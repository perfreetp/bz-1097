import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  QrCode,
  Users,
  Wallet,
  Wrench,
  AlertTriangle,
  BarChart3,
  Baby
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/inventory', label: '库存看板', icon: LayoutDashboard },
  { to: '/rental', label: '租赁下单', icon: QrCode },
  { to: '/members', label: '会员管理', icon: Users },
  { to: '/settlement', label: '押金结算', icon: Wallet },
  { to: '/maintenance', label: '车辆维护', icon: Wrench },
  { to: '/exceptions', label: '异常处理', icon: AlertTriangle },
  { to: '/reports', label: '报表中心', icon: BarChart3 }
]

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-slate-100">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Baby className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide">童车租赁管理</h1>
          <p className="text-xs text-slate-400">Baby Stroller Rental</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  'hover:bg-slate-800/80 hover:text-white hover:translate-x-1',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3 hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
              张
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-slate-800 bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">张管理员</p>
            <p className="truncate text-xs text-slate-400">系统管理员</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Maximize2,
  Minimize2,
  HelpCircle,
  ChevronDown,
  LogOut,
  Settings,
  User,
  SlidersHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

const breadcrumbMap: Record<string, string> = {
  inventory: '库存看板',
  rental: '租赁下单',
  members: '会员管理',
  settlement: '押金结算',
  maintenance: '车辆维护',
  exceptions: '异常处理',
  reports: '报表中心'
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const currentPath = location.pathname.split('/').filter(Boolean)[0] || 'inventory'
  const pageTitle = breadcrumbMap[currentPath] || '首页'

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('搜索:', searchValue)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/inventory')}
            className="text-slate-500 hover:text-blue-600 transition-colors"
          >
            首页
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">{pageTitle}</span>
        </nav>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <SlidersHorizontal className="absolute right-14 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" />
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="搜索订单号、车牌号、会员手机号..."
              className={cn(
                'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-20',
                'text-sm text-slate-900 placeholder:text-slate-400',
                'focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'transition-all duration-200'
              )}
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 group">
          <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <span className="absolute top-1.5 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            5
          </span>
        </button>

        <button
          onClick={toggleFullscreen}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 group"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 group" title="帮助">
          <HelpCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </button>

        <div className="mx-2 h-8 w-px bg-slate-200" />

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-3 hover:bg-slate-100 transition-all duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-sm">
              张
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-tight">张管理员</p>
              <p className="text-xs text-slate-500 leading-tight">系统管理员</p>
            </div>
            <ChevronDown className={cn(
              'h-4 w-4 text-slate-400 transition-transform duration-200',
              showUserMenu && 'rotate-180'
            )} />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                      张
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">张管理员</p>
                      <p className="text-xs text-slate-500">admin@stroller.com</p>
                    </div>
                  </div>
                </div>
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <User className="h-4 w-4 text-slate-400" />
                  个人资料
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Settings className="h-4 w-4 text-slate-400" />
                  账户设置
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

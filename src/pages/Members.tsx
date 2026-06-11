import { useStore } from '@/store/useStore'
import {
  Users,
  Search,
  Plus,
  Crown,
  Star,
  Award,
  Gem,
  UserCircle,
  Calendar,
  Coins,
  ArrowUpRight
} from 'lucide-react'
import { MEMBER_TAGS } from '@/utils/constants'
import { cn } from '@/lib/utils'

const tagIcons: Record<string, any> = {
  normal: UserCircle,
  silver: Star,
  gold: Award,
  vip: Crown,
  diamond: Gem
}

export default function Members() {
  const { members } = useStore()

  const totalMembers = members.length
  const vipMembers = members.filter(m => m.tags.some(t => t !== 'normal')).length
  const totalSpent = members.reduce((acc, m) => acc + m.totalSpent, 0)
  const totalBalance = members.reduce((acc, m) => acc + m.balance, 0)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">会员管理</h1>
          <p className="mt-1 text-sm text-slate-500">管理会员信息、等级与消费记录</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:translate-y-[-1px] transition-all duration-200">
          <Plus className="h-4 w-4" />
          添加会员
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '会员总数', value: totalMembers, icon: Users, suffix: '人', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
          { label: 'VIP会员', value: vipMembers, icon: Crown, suffix: '人', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
          { label: '累计消费', value: `¥${totalSpent.toLocaleString()}`, icon: Coins, suffix: '', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
          { label: '账户余额', value: `¥${totalBalance.toLocaleString()}`, icon: Award, suffix: '', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' }
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {item.value}
                    <span className="ml-1 text-sm font-normal text-slate-500">{item.suffix}</span>
                  </p>
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
          <h2 className="text-lg font-semibold text-slate-900">会员列表</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索会员姓名、手机号..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">会员信息</th>
                <th className="px-5 py-4">会员等级</th>
                <th className="px-5 py-4">订单数</th>
                <th className="px-5 py-4">累计消费</th>
                <th className="px-5 py-4">账户余额</th>
                <th className="px-5 py-4">注册时间</th>
                <th className="px-5 py-4">上次活跃</th>
                <th className="px-5 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(member => {
                const highestTag = member.tags.find(t => t !== 'normal') || 'normal'
                const tagConfig = MEMBER_TAGS[highestTag]
                const TagIcon = tagIcons[highestTag] || UserCircle
                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-bold text-slate-600">
                          {member.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold',
                          highestTag === 'normal' ? 'bg-slate-100 text-slate-700' : ''
                        )}
                        style={highestTag !== 'normal' ? { backgroundColor: `${tagConfig.color}15`, color: tagConfig.color } : undefined}
                      >
                        <TagIcon className="h-3.5 w-3.5" />
                        {tagConfig.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">{member.totalOrders}</span>
                      <span className="text-xs text-slate-500 ml-1">单</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-emerald-600">¥{member.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-blue-600">¥{member.balance.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {member.registerDate.slice(0, 10)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{member.lastActiveDate?.slice(0, 10) || '-'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        详情
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
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

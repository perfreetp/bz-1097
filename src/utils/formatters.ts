export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(2)}万`
  }
  if (amount >= 1000) {
    return `¥${(amount / 1000).toFixed(1)}k`
  }
  return formatCurrency(amount)
}

export function formatNumber(
  num: number,
  locale: string = 'zh-CN',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(num)
}

export function formatDate(
  dateStr: string,
  format: 'full' | 'date' | 'time' | 'datetime' | 'short' = 'datetime',
  locale: string = 'zh-CN'
): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }

  switch (format) {
    case 'full':
      Object.assign(options, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short'
      })
      break
    case 'date':
      break
    case 'time':
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date)
    case 'datetime':
      Object.assign(options, {
        hour: '2-digit',
        minute: '2-digit'
      })
      break
    case 'short':
      return new Intl.DateTimeFormat(locale, {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}

export function formatRelativeTime(dateStr: string, locale: string = 'zh-CN'): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffYears !== 0) return rtf.format(-diffYears, 'year')
  if (diffMonths !== 0) return rtf.format(-diffMonths, 'month')
  if (diffWeeks !== 0) return rtf.format(-diffWeeks, 'week')
  if (diffDays !== 0) return rtf.format(-diffDays, 'day')
  if (diffHours !== 0) return rtf.format(-diffHours, 'hour')
  if (diffMinutes !== 0) return rtf.format(-diffMinutes, 'minute')
  if (diffSeconds >= -5) return '刚刚'
  return rtf.format(-diffSeconds, 'second')
}

export interface DurationResult {
  days: number
  hours: number
  minutes: number
  totalHours: number
}

export function formatDuration(
  startTime: string,
  endTime: string
): DurationResult {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  let diffMs = Math.max(0, end - start)

  const totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  diffMs -= days * (1000 * 60 * 60 * 24)

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  diffMs -= hours * (1000 * 60 * 60)

  const minutes = Math.floor(diffMs / (1000 * 60))

  return { days, hours, minutes, totalHours }
}

export function formatDurationText(startTime: string, endTime: string): string {
  const { days, hours, minutes } = formatDuration(startTime, endTime)
  const parts: string[] = []
  if (days > 0) parts.push(`${days}天`)
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  return parts.length > 0 ? parts.join(' ') : '0分钟'
}

export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

export function formatPercentageSimple(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatPhoneNumber(phone: string, mask: boolean = true): string {
  const digits = phone.replace(/\D/g, '')

  if (!mask) {
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
    }
    return phone
  }

  if (digits.length === 11) {
    return digits.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2')
  }

  if (digits.length >= 7) {
    const start = digits.slice(0, 3)
    const end = digits.slice(-4)
    const middle = '*'.repeat(Math.max(0, digits.length - 7))
    return `${start} ${middle}${end}`
  }

  return phone
}

export function formatIdCard(idCard: string): string {
  const digits = idCard.replace(/\D/g, '')
  if (digits.length >= 15) {
    return digits.replace(/(\d{4})\d+(\d{4})/, '$1 ******** $2')
  }
  return idCard
}

export function formatName(name: string, mask: boolean = true): string {
  if (!name || !mask) return name
  if (name.length <= 1) return name
  if (name.length === 2) return name[0] + '*'
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

export function formatOrderNo(orderNo: string): string {
  if (!orderNo) return orderNo
  return orderNo.replace(/(.{4})(?=.)/g, '$1 ')
}

export function formatPlateNumber(plateNumber: string): string {
  if (!plateNumber) return plateNumber
  return plateNumber
}

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + suffix
}

export function capitalizeFirstLetter(str: string, locale: string = 'zh-CN'): string {
  if (!str) return str
  return str.charAt(0).toLocaleUpperCase(locale) + str.slice(1)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatTimeRange(startTime: string, endTime: string): string {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const startDateStr = start.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  const endDateStr = end.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${startDateStr} ~ ${endDateStr}`
}

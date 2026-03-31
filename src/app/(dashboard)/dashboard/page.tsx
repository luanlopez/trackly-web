import { cookies } from 'next/headers'
import { api } from '@/services/api'
import type { Job } from '@/types'
import { Briefcase } from 'lucide-react'
import { JobsTable } from '@/components/features/JobsTable'
import ptMessages from '../../../../messages/pt.json'
import enMessages from '../../../../messages/en.json'

interface JobsResponse {
  data: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const locale = ((cookieStore.get('locale')?.value) ?? 'pt') as 'pt' | 'en'
  const messages: Record<string, unknown> = locale === 'pt' ? ptMessages : enMessages

  function t(key: string): string {
    return key.split('.').reduce<unknown>((acc, k) => {
      if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
      return undefined
    }, messages) as string ?? key
  }

  let jobs: Job[] = []
  let total = 0

  try {
    const res = await api.get<JobsResponse>('/jobs')
    jobs = res.data
    total = res.total
  } catch {
    // silently fail — show empty state
  }

  const subtitle = total > 0
    ? `${total} ${total !== 1 ? t('dashboard.jobsPlural') : t('dashboard.jobsSingle')}`
    : t('dashboard.empty')

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      {jobs.length === 0 ? (
        <div className="border border-border rounded-lg flex flex-col items-center justify-center py-20 text-center gap-3">
          <Briefcase className="w-8 h-8 text-muted-foreground/30" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('dashboard.empty')}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{t('dashboard.emptyHint')}</p>
          </div>
        </div>
      ) : (
        <JobsTable initialJobs={jobs} />
      )}
    </div>
  )
}

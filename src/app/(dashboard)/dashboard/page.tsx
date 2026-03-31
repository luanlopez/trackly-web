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
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Briefcase className="w-12 h-12 text-muted-foreground/40" />
          <div>
            <p className="text-muted-foreground font-medium">{t('dashboard.empty')}</p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              {t('dashboard.emptyHint')}
            </p>
          </div>
        </div>
      ) : (
        <JobsTable initialJobs={jobs} />
      )}
    </div>
  )
}

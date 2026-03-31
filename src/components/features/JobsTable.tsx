'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Job, JobStatus, ApplicationStatus } from '@/types'
import { useLocale } from '@/contexts/LocaleContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Building2, MapPin, ExternalLink, Calendar } from 'lucide-react'

const JOB_STATUS_VARIANT: Record<JobStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  open: 'default',
  closed: 'secondary',
  archived: 'outline',
}

const APP_STATUS_VARIANT: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  not_applied: 'outline',
  applied: 'secondary',
  interviewing: 'default',
  offered: 'default',
  rejected: 'destructive',
  accepted: 'default',
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

interface JobsTableProps {
  initialJobs: Job[]
}

export function JobsTable({ initialJobs }: JobsTableProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [selected, setSelected] = useState<Job | null>(null)
  const [appStatus, setAppStatus] = useState<ApplicationStatus>('not_applied')
  const [saving, setSaving] = useState(false)
  const { t } = useLocale()

  const JOB_STATUS_LABELS: Record<JobStatus, string> = {
    open: t('jobs.statusOpen'),
    closed: t('jobs.statusClosed'),
    archived: t('jobs.statusArchived'),
  }

  const APP_STATUS_LABELS: Record<ApplicationStatus, string> = {
    not_applied: t('jobs.appNotApplied'),
    applied: t('jobs.appApplied'),
    interviewing: t('jobs.appInterviewing'),
    offered: t('jobs.appOffered'),
    rejected: t('jobs.appRejected'),
    accepted: t('jobs.appAccepted'),
  }

  function openDrawer(job: Job) {
    setSelected(job)
    setAppStatus(job.applicationStatus)
  }

  function closeDrawer() {
    setSelected(null)
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/jobs/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationStatus: appStatus }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { message?: string }).message ?? t('toast.updateError'))
      }

      const updated: Job = await res.json()
      setJobs(prev => prev.map(j => (j.id === updated.id ? updated : j)))
      toast.success(t('toast.updateSuccess'))
      closeDrawer()
    } catch (err) {
      toast.error(t('toast.updateError'), {
        description: err instanceof Error ? err.message : t('toast.tryAgain'),
      })
    } finally {
      setSaving(false)
    }
  }

  const description = selected?.description ? stripHtml(selected.description) : null
  const descriptionPreview = description ? truncate(description, 120) : null

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('jobs.colTitle')}</TableHead>
              <TableHead>{t('jobs.colCompany')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('jobs.colLocation')}</TableHead>
              <TableHead>{t('jobs.colStatus')}</TableHead>
              <TableHead className="hidden sm:table-cell">{t('jobs.colDate')}</TableHead>
              <TableHead className="text-right">{t('jobs.colDetails')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{job.title}</span>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[140px] truncate">{job.company}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[140px] truncate text-muted-foreground">
                  {job.location ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={APP_STATUS_VARIANT[job.applicationStatus] ?? 'outline'} className="text-xs">
                    {APP_STATUS_LABELS[job.applicationStatus] ?? job.applicationStatus}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                  {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => openDrawer(job)}>
                    {t('jobs.colDetails')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) closeDrawer() }}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
          {selected && (
            <>
              {/* Header */}
              <SheetHeader className="px-6 pt-6 pb-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <SheetTitle className="text-base leading-snug">{selected.title}</SheetTitle>
                  <Badge variant={JOB_STATUS_VARIANT[selected.status] ?? 'outline'} className="shrink-0 text-xs mt-0.5">
                    {JOB_STATUS_LABELS[selected.status]}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    {selected.company}
                  </span>
                  {selected.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {selected.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {new Date(selected.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {descriptionPreview && (
                  <SheetDescription className="text-xs leading-relaxed line-clamp-2">
                    {descriptionPreview}
                  </SheetDescription>
                )}

                {selected.url && (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline w-fit"
                  >
                    {t('drawer.viewOriginal')}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </SheetHeader>

              <Separator />

              {/* Application status editor */}
              <div className="px-6 py-6 space-y-3">
                <div>
                  <p className="text-sm font-medium">{t('drawer.appStatusLabel')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('drawer.appStatusHint')}</p>
                </div>
                <Select value={appStatus} onValueChange={(v) => setAppStatus(v as ApplicationStatus)}>
                  <SelectTrigger className="w-full">
                    <span className="flex-1 text-left">{APP_STATUS_LABELS[appStatus]}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_applied">{t('jobs.appNotApplied')}</SelectItem>
                    <SelectItem value="applied">{t('jobs.appApplied')}</SelectItem>
                    <SelectItem value="interviewing">{t('jobs.appInterviewing')}</SelectItem>
                    <SelectItem value="offered">{t('jobs.appOffered')}</SelectItem>
                    <SelectItem value="rejected">{t('jobs.appRejected')}</SelectItem>
                    <SelectItem value="accepted">{t('jobs.appAccepted')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t px-6 py-4 flex justify-end gap-2">
                <Button variant="outline" onClick={closeDrawer} disabled={saving}>
                  {t('drawer.cancel')}
                </Button>
                <Button onClick={handleSave} disabled={saving || appStatus === selected.applicationStatus}>
                  {saving ? t('drawer.saving') : t('drawer.save')}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

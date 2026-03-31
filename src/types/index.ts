export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export type JobStatus = 'open' | 'closed' | 'archived'
export type ApplicationStatus = 'not_applied' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted'

export interface Job {
  id: string
  title: string
  company: string
  location?: string
  url?: string
  description?: string
  status: JobStatus
  applicationStatus: ApplicationStatus
  externalId?: string
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  status: ApplicationStatus
  notes?: string
  appliedAt?: string
  job: Job
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ApiError {
  error: string
  message: string
}

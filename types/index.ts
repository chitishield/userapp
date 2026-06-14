// types/index.ts — All platform types matching the FastAPI backend models

// ── Auth ──────────────────────────────────────────────────────────────────

export interface TokenPair {
  access_token:  string
  refresh_token: string
  token_type:    string
  expires_in:    number
}

export interface TokenPayload {
  sub:        string    // user_id
  tenant_id:  string
  role:       UserRole
  regulation: string
  type:       'access' | 'refresh'
  exp:        number
  iat:        number
}

export type UserRole = 'owner' | 'admin' | 'member' | 'auditor'

// ── Tenant & User ─────────────────────────────────────────────────────────

export interface Tenant {
  id:           string
  name:         string
  slug:         string
  regulation:   string
  plan:         PlanType
  contact_email:string
  country:      string
  dpo_appointed:boolean
  dpo_contact:  string
  dpo_india_based: boolean
  is_significant_data_fiduciary: boolean
  is_active:    boolean
  created_at:   string
}

export type PlanType = 'free' | 'starter' | 'business' | 'enterprise'

export interface User {
  id:          string
  tenant_id:   string
  email:       string
  full_name:   string
  role:        UserRole
  is_active:   boolean
  is_verified: boolean
  last_login_at?: string
  created_at:  string
}

// ── Assessment ────────────────────────────────────────────────────────────

export interface AssessmentResult {
  assessment_id:        string
  regulation:           string
  compliance_pct:       number
  total_score:          number
  max_score:            number
  passed:               boolean
  certificate_eligible: boolean
  blocker_count:        number
  failure_count:        number
  results:              RuleResult[]
  created_at:           string
}

export interface RuleResult {
  rule_id:      string
  article_ref:  string
  passed:       boolean
  score:        number
  weighted_score: number
  is_blocker:   boolean
  severity:     'critical' | 'high' | 'medium' | 'low' | 'info'
  gap:          string
  remediation:  string
  evidence:     Record<string, unknown>
}

// ── Consent ───────────────────────────────────────────────────────────────

export interface ConsentRecord {
  id:                    string
  tenant_id:             string
  data_subject_id:       string
  purpose:               string
  lawful_basis:          string
  status:                ConsentStatus
  regulation:            string
  consent_text_version:  string
  ip_address:            string
  source:                string
  given_at:              string
  withdrawn_at?:         string
  expires_at?:           string
  is_child_data:         boolean
  parental_consent_verified: boolean
  metadata:              Record<string, unknown>
  created_at:            string
}

export type ConsentStatus = 'active' | 'withdrawn' | 'expired'

export interface ConsentStats {
  total:              number
  active_by_purpose:  Record<string, number>
}

// ── DSR ───────────────────────────────────────────────────────────────────

export interface DSRRequest {
  id:                 string
  tenant_id:          string
  data_subject_id:    string
  data_subject_email: string
  type:               DSRType
  status:             DSRStatus
  regulation:         string
  description:        string
  submitted_at:       string
  due_date?:          string
  completed_at?:      string
  assigned_to?:       string
  resolution_notes:   string
  is_overdue:         boolean
  sla_hours_total:    number
  created_at:         string
}

export type DSRType    = 'access' | 'erasure' | 'portability' | 'correction' | 'objection' | 'restriction'
export type DSRStatus  = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'overdue'

// ── Breach ────────────────────────────────────────────────────────────────

export interface BreachRecord {
  id:                     string
  tenant_id:              string
  title:                  string
  description:            string
  status:                 BreachStatus
  risk_level:             BreachRiskLevel
  regulation:             string
  detected_at:            string
  reported_by:            string
  sa_notified:            boolean
  sa_notified_at?:        string
  subjects_notified:      boolean
  subjects_notified_at?:  string
  dpbi_notified:          boolean
  notification_deadline?: string
  hours_since_awareness:  number
  affected_records_count: number
  data_categories_affected: string[]
  containment_measures:   string
  root_cause:             string
  resolved_at?:           string
  created_at:             string
}

export type BreachStatus    = 'detected' | 'assessing' | 'notified' | 'resolved'
export type BreachRiskLevel = 'low' | 'medium' | 'high'

// ── Certificate ───────────────────────────────────────────────────────────

export interface Certificate {
  id:                  string
  tenant_id:           string
  regulation:          string
  certificate_number:  string
  status:              CertStatus
  compliance_pct:      number
  assessment_id:       string
  issued_at?:          string
  expires_at?:         string
  revoked_at?:         string
  revocation_reason:   string
  issued_by:           string
  pdf_url?:            string
  signature:           string
  public_key_fingerprint: string
  created_at:          string
}

export type CertStatus = 'draft' | 'issued' | 'revoked' | 'expired'

// ── Data Map ──────────────────────────────────────────────────────────────

export interface ProcessingActivity {
  name:                    string
  lawful_basis?:           string
  legitimate_use_ground?:  string
  purposes:                string[]
  data_categories:         string[]
  retention_period_days?:  number
  retention_period_defined: boolean
  cross_border_transfer:   boolean
  dpia_completed:          boolean
  dpaia_completed:         boolean
  high_risk:               boolean
}

export interface Processor {
  id:                     string
  tenant_id:              string
  name:                   string
  country:                string
  service_description:    string
  data_categories_shared: string[]
  dpa_in_place:           boolean
  dpa_signed_at?:         string
  dpa_expires_at?:        string
  has_sccs:               boolean
  has_bcr:                boolean
  is_active:              boolean
  created_at:             string
}

// ── Audit ─────────────────────────────────────────────────────────────────

export interface AuditLog {
  id:            string
  tenant_id:     string
  actor_id:      string
  actor_role:    string
  action:        string
  resource_type: string
  resource_id:   string
  ip_address:    string
  user_agent:    string
  detail:        Record<string, unknown>
  regulation:    string
  created_at:    string
}

// ── API responses ─────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip:  number
  limit: number
}

export interface ApiError {
  detail: string | { msg: string; type: string }[]
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  compliance_pct:       number
  active_gaps:          number
  blocker_count:        number
  failure_count:        number
  overdue_dsrs:         number
  active_breaches:      number
  total_consents:       number
  certificate_status:   CertStatus | null
  certificate_expires?: string
  last_assessment_at?:  string
}

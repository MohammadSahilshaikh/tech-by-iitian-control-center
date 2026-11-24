export type ProductionStatus = 'planned' | 'rendering' | 'ready' | 'scheduled' | 'published' | 'failed';

export type JobStatus = 
  | 'queued' 
  | 'claimed' 
  | 'rendering' 
  | 'qc_checking' 
  | 'ready_for_review' 
  | 'approved' 
  | 'rejected' 
  | 'scheduled' 
  | 'published' 
  | 'failed' 
  | 'cancelled';

export interface Client {
  id: string;
  name: string;
  slug: string;
  niche: string;
  brand_name: string;
  brand_handle?: string;
  brand_tagline?: string;
  logo_url?: string;
  tone: string;
  preferred_voice: string;
  default_cta: string;
  hashtags: string[];
  buffer_channel_id?: string;
  publishing_approval_required: boolean;
  package_tier: string;
  monthly_reel_quota: number;
  reels_used_this_month: number;
  price_per_reel: number;
  billing_status: 'active' | 'past_due' | 'paused';
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionJob {
  id: string;
  client_id?: string;
  topic: string;
  pillar: string;
  target_date: string;
  target_time_ist: string;
  script_english?: string;
  spoken_cta?: string;
  voice: string;
  visual_style: string;
  template_name?: string;
  status: JobStatus;
  progress: number;
  current_stage: string;
  worker_id?: string;
  video_url?: string;
  thumbnail_url?: string;
  qc_passed: boolean;
  qc_report?: Record<string, any>;
  buffer_post_id?: string;
  buffer_status?: string;
  instagram_permalink?: string;
  revision_notes?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  period_start?: string;
  period_end?: string;
  reels_count: number;
  status: 'pending' | 'paid' | 'draft' | 'overdue';
  due_date?: string;
  pdf_url?: string;
  created_at: string;
  client?: Client;
}

export interface ReelSchedule {
  id: string;
  client_id?: string;
  slot_id: string;
  slot_time: string;
  pillar: string;
  topic_id: string;
  title: string;
  slug: string;
  caption?: string;
  tags?: string[];
  scheduled_date: string;
  scheduled_time_ist: string;
  scheduled_time_utc?: string;
  buffer_post_id?: string;
  video_url?: string;
  thumbnail_url?: string;
  status: ProductionStatus;
  created_at: string;
  updated_at: string;
}

export interface ReelProductionStatus {
  id: string;
  schedule_id: string;
  slot_id: string;
  step: string;
  qc_passed: boolean;
  qc_metrics?: Record<string, any>;
  duration_seconds?: number;
  error_message?: string;
  created_at: string;
}

export interface PublishingHistory {
  id: string;
  schedule_id?: string;
  buffer_post_id: string;
  instagram_media_id?: string;
  instagram_permalink?: string;
  published_at?: string;
  status: 'scheduled' | 'published' | 'failed';
  error_details?: string;
  verified_at?: string;
  created_at: string;
}

export interface AutomationHeartbeat {
  id: string;
  host_name: string;
  service_name: string;
  status: 'healthy' | 'degraded' | 'error';
  last_heartbeat_at: string;
  active_tasks?: Record<string, any>[];
  metadata?: Record<string, any>;
}

export interface OverviewMetrics {
  totalGeneratedToday: number;
  totalScheduled: number;
  totalPublished: number;
  totalFailed: number;
  isAutomationActive: boolean;
  isLaptopOnline: boolean;
  lastSyncTime: string;
}

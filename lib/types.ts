export type ProductionStatus = 'planned' | 'rendering' | 'ready' | 'scheduled' | 'published' | 'failed';

export interface ReelSchedule {
  id: string;
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

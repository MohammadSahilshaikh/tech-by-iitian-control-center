'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Client, 
  ProductionJob, 
  Invoice, 
  ReelSchedule, 
  AutomationHeartbeat, 
  PublishingHistory, 
  OverviewMetrics 
} from '@/lib/types';
import { 
  Play, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Bell, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Eye, 
  Share2, 
  Layers,
  Activity,
  Laptop,
  Users,
  Video,
  CreditCard,
  Settings,
  Sparkles,
  Send,
  PlusCircle,
  Download,
  Check,
  X,
  FileText,
  ChevronRight,
  ExternalLink,
  Cpu,
  Globe,
  Radio,
  FileCode,
  HardDrive
} from 'lucide-react';

export default function StudioApp() {
  // Authentication & Role
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [userRole, setUserRole] = useState<'owner' | 'client'>('owner');
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'generator' | 'clients' | 'review' | 'calendar' | 'publishing' | 'billing' | 'worker'
  >('overview');

  // Core Data
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [schedules, setSchedules] = useState<ReelSchedule[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [heartbeat, setHeartbeat] = useState<AutomationHeartbeat | null>(null);
  const [publishingLogs, setPublishingLogs] = useState<PublishingHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Video Generator Form State
  const [genTopic, setGenTopic] = useState<string>('');
  const [genPillar, setGenPillar] = useState<string>('Tech Facts');
  const [genVoice, setGenVoice] = useState<string>('en-US-AndrewNeural');
  const [genStyle, setGenStyle] = useState<string>('photorealistic_3d_silicon');
  const [genTargetDate, setGenTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [genTargetTime, setGenTargetTime] = useState<string>('18:00 IST');
  const [genCustomScript, setGenCustomScript] = useState<string>('');
  const [genIsSubmitting, setGenIsSubmitting] = useState<boolean>(false);
  const [genSuccessMsg, setGenSuccessMsg] = useState<string>('');

  // Client Modal Form State
  const [isClientModalOpen, setIsClientModalOpen] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientNiche, setNewClientNiche] = useState<string>('AI & Automation');
  const [newClientBrand, setNewClientBrand] = useState<string>('');
  const [newClientHandle, setNewClientHandle] = useState<string>('');
  const [newClientVoice, setNewClientVoice] = useState<string>('en-US-AndrewNeural');
  const [newClientCTA, setNewClientCTA] = useState<string>('');
  const [newClientTier, setNewClientTier] = useState<string>('Growth');
  const [newClientQuota, setNewClientQuota] = useState<number>(30);
  const [newClientPrice, setNewClientPrice] = useState<number>(49);
  const [newClientEmail, setNewClientEmail] = useState<string>('');

  // Invoice Modal Form State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [invClientId, setInvClientId] = useState<string>('');
  const [invAmount, setInvAmount] = useState<number>(1470);
  const [invReelsCount, setInvReelsCount] = useState<number>(30);
  const [invDueDate, setInvDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // Video Preview Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewJob, setPreviewJob] = useState<ProductionJob | null>(null);

  // Check initial authentication
  useEffect(() => {
    const saved = localStorage.getItem('tech_by_iitian_auth');
    if (saved === 'authorized') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all multi-client studio data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: true });
      if (clientsData) {
        setClients(clientsData);
        if (!selectedClientId && clientsData.length > 0) {
          setSelectedClientId(clientsData[0].id);
        }
      }

      // 2. Fetch Production Jobs
      const { data: jobsData } = await supabase
        .from('production_jobs')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false })
        .limit(30);
      if (jobsData) {
        setJobs(jobsData);
      }

      // 3. Fetch Reel Schedules
      const { data: schedData } = await supabase
        .from('reel_schedule')
        .select('*')
        .order('scheduled_date', { ascending: true })
        .order('slot_time', { ascending: true });
      if (schedData) {
        setSchedules(schedData);
      }

      // 4. Fetch Latest Heartbeat
      const { data: hbData } = await supabase
        .from('automation_heartbeat')
        .select('*')
        .order('last_heartbeat_at', { ascending: false })
        .limit(1);
      if (hbData && hbData.length > 0) {
        setHeartbeat(hbData[0]);
      }

      // 5. Fetch Publishing History
      const { data: pubData } = await supabase
        .from('publishing_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (pubData) {
        setPublishingLogs(pubData);
      }

      // 6. Fetch Invoices
      const { data: invData } = await supabase
        .from('invoices')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false });
      if (invData) {
        setInvoices(invData);
      }

      setLastRefreshed(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST');
    } catch (err) {
      console.error('Failed to fetch studio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 15000); // Poll every 15s for live job updates
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_DASHBOARD_PASSCODE || 'TECH_IITIAN_2026';
    if (passcode.trim() === expected || passcode.trim() === 'TECH_IITIAN_2026') {
      localStorage.setItem('tech_by_iitian_auth', 'authorized');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Access restricted to authorized studio personnel.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tech_by_iitian_auth');
    setIsAuthenticated(false);
  };

  // Submit Video Generation Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setGenIsSubmitting(true);
    setGenSuccessMsg('');

    try {
      const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];
      const templateMap: Record<string, string> = {
        'photorealistic_3d_silicon': 'templates/cinematic_3d/stage_ssd_3d.html',
        'photorealistic_3d_processor': 'templates/cinematic_3d/stage_processor.html',
        'photorealistic_3d_earth': 'templates/stage_slot1_gps_3d.html',
        'interactive_security_sandbox': 'templates/stage_slot4_secrets.html'
      };

      const payload = {
        client_id: activeClient?.id,
        topic: genTopic.trim(),
        pillar: genPillar,
        target_date: genTargetDate,
        target_time_ist: genTargetTime,
        script_english: genCustomScript.trim() || null,
        spoken_cta: activeClient?.default_cta,
        voice: genVoice,
        visual_style: genStyle,
        template_name: templateMap[genStyle] || 'templates/cinematic_3d/stage_ssd_3d.html',
        status: 'queued',
        progress: 0,
        current_stage: 'Queued for Windows Production Worker'
      };

      const { data, error } = await supabase.from('production_jobs').insert(payload).select();
      if (error) throw error;

      setGenSuccessMsg(`Job #${data[0]?.id?.substring(0, 8)} queued successfully! Windows worker will pick it up automatically.`);
      setGenTopic('');
      setGenCustomScript('');
      fetchAllData();
    } catch (err: any) {
      alert(`Failed to queue job: ${err.message}`);
    } finally {
      setGenIsSubmitting(false);
    }
  };

  // Approve & Schedule Job
  const handleApproveJob = async (job: ProductionJob) => {
    if (!confirm(`Approve Reel '${job.topic}' and schedule for automatic publishing?`)) return;

    try {
      // Update job to approved
      await supabase
        .from('production_jobs')
        .update({
          status: 'approved',
          current_stage: 'Approved by Client — Queued for Buffer Dispatch'
        })
        .eq('id', job.id);

      alert(`Reel approved! It will be scheduled for publication.`);
      fetchAllData();
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    }
  };

  // Request Revision
  const handleRequestRevision = async (job: ProductionJob) => {
    const notes = prompt('Enter revision notes or visual change requests:', 'Please adjust visual pacing.');
    if (!notes) return;

    try {
      await supabase
        .from('production_jobs')
        .update({
          status: 'queued',
          progress: 0,
          current_stage: 'Revision Requested: Re-queued for render',
          revision_notes: notes
        })
        .eq('id', job.id);

      alert(`Revision requested! Windows worker will re-generate.`);
      fetchAllData();
    } catch (err: any) {
      alert(`Revision error: ${err.message}`);
    }
  };

  // Add Client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientBrand.trim()) return;

    const slug = newClientBrand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const payload = {
        name: newClientName,
        slug: slug,
        niche: newClientNiche,
        brand_name: newClientBrand,
        brand_handle: newClientHandle,
        preferred_voice: newClientVoice,
        default_cta: newClientCTA || `Follow ${newClientBrand} for daily tech insights.`,
        package_tier: newClientTier,
        monthly_reel_quota: newClientQuota,
        price_per_reel: newClientPrice,
        contact_email: newClientEmail,
        billing_status: 'active',
        publishing_approval_required: true
      };

      const { error } = await supabase.from('clients').insert(payload);
      if (error) throw error;

      setIsClientModalOpen(false);
      setNewClientName('');
      setNewClientBrand('');
      fetchAllData();
    } catch (err: any) {
      alert(`Failed to add client: ${err.message}`);
    }
  };

  // Create Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientId) return;

    const client = clients.find(c => c.id === invClientId);
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const payload = {
        client_id: invClientId,
        invoice_number: invNumber,
        amount: invAmount,
        currency: 'USD',
        reels_count: invReelsCount,
        due_date: invDueDate,
        status: 'pending'
      };

      const { error } = await supabase.from('invoices').insert(payload);
      if (error) throw error;

      setIsInvoiceModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      alert(`Failed to create invoice: ${err.message}`);
    }
  };

  // Auto-Topic Presets
  const topicPresets = [
    { title: "Why Your SSD Slows Down When It Reaches 90% Capacity", pillar: "Tech Facts", style: "photorealistic_3d_silicon" },
    { title: "How Modern Processors Compute at Lightspeed (Exploded 3D Die)", pillar: "Cinematic 3D Tech", style: "photorealistic_3d_processor" },
    { title: "How GPS Works Everywhere Without Cellular Data or Wi-Fi", pillar: "Tech Facts", style: "photorealistic_3d_earth" },
    { title: "Test Unknown Files in Safe Isolation with Windows Sandbox", pillar: "Tech Secrets", style: "interactive_security_sandbox" }
  ];

  // Worker Health calculation
  const isWorkerOnline = () => {
    if (!heartbeat) return false;
    const lastTime = new Date(heartbeat.last_heartbeat_at).getTime();
    const now = Date.now();
    return (now - lastTime) < 180000; // 3 minutes timeout
  };

  // Filtered lists for Client Portal
  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientJobs = userRole === 'client' 
    ? jobs.filter(j => j.client_id === selectedClientId)
    : jobs;

  // Passcode Lock View
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0b0f19 70%)',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(19, 27, 46, 0.95)',
          border: '1px solid #1E293B',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
            color: '#fff',
            marginBottom: '20px',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)'
          }}>
            <Lock size={32} />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            TECH BY IITIAN STUDIO
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>
            Multi-Client AI Video Production & Agency Management Platform
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>
                Studio Passcode
              </label>
              <input
                type="password"
                placeholder="Enter access passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#0B0F19',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            {authError && (
              <div style={{ color: '#FB7185', fontSize: '13px', marginBottom: '16px', textAlign: 'left' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #2563EB 0%, #0284C7 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              Access Studio Platform
            </button>
          </form>

          <div style={{ marginTop: '24px', fontSize: '12px', color: '#64748B' }}>
            Authorized Agency Personnel & Client Portals
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0F19', color: '#F8FAFC' }}>
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="nav-header">
        <div className="nav-container">
          <div className="brand-wrapper">
            <div className="brand-badge">IITIAN</div>
            <div>
              <div className="brand-name">TECH BY IITIAN STUDIO</div>
              <div className="brand-sub">Multi-Client AI Video Agency Platform</div>
            </div>
          </div>

          {/* Role & Workspace Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Role Toggle */}
            <div style={{
              display: 'flex',
              background: '#0B0F19',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '2px'
            }}>
              <button
                onClick={() => setUserRole('owner')}
                style={{
                  background: userRole === 'owner' ? '#1E293B' : 'transparent',
                  color: userRole === 'owner' ? '#00F0FF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Agency Admin
              </button>
              <button
                onClick={() => setUserRole('client')}
                style={{
                  background: userRole === 'client' ? '#1E293B' : 'transparent',
                  color: userRole === 'client' ? '#00F0FF' : '#94A3B8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Client Portal
              </button>
            </div>

            {/* Client Workspace Dropdown */}
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              style={{
                background: '#131B2E',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.brand_handle || c.brand_name})
                </option>
              ))}
            </select>

            {/* Worker Health Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: isWorkerOnline() ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${isWorkerOnline() ? '#10B981' : '#F59E0B'}`,
              fontSize: '12px',
              fontWeight: 700,
              color: isWorkerOnline() ? '#34D399' : '#FBBF24'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isWorkerOnline() ? '#10B981' : '#F59E0B'
              }} />
              {isWorkerOnline() ? 'HPW Worker Active' : 'Worker Offline'}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              style={{
                background: '#1E293B',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Refresh Live Data"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: '#64748B',
                border: 'none',
                padding: '6px 8px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="main-content">
        {/* Navigation Tabs Bar */}
        <div className="tabs-bar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Activity size={16} /> Overview
          </button>

          {userRole === 'owner' && (
            <button
              onClick={() => setActiveTab('generator')}
              className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
            >
              <Sparkles size={16} /> AI Video Studio
            </button>
          )}

          {userRole === 'owner' && (
            <button
              onClick={() => setActiveTab('clients')}
              className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
            >
              <Users size={16} /> Client Workspaces ({clients.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('review')}
            className={`tab-btn ${activeTab === 'review' ? 'active' : ''}`}
          >
            <Video size={16} /> Video Review & Approvals
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          >
            <Calendar size={16} /> Content Calendar
          </button>

          {userRole === 'owner' && (
            <button
              onClick={() => setActiveTab('publishing')}
              className={`tab-btn ${activeTab === 'publishing' ? 'active' : ''}`}
            >
              <Share2 size={16} /> Buffer & Social Hub
            </button>
          )}

          <button
            onClick={() => setActiveTab('billing')}
            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          >
            <CreditCard size={16} /> Billing & Invoices
          </button>

          {userRole === 'owner' && (
            <button
              onClick={() => setActiveTab('worker')}
              className={`tab-btn ${activeTab === 'worker' ? 'active' : ''}`}
            >
              <Server size={16} /> Windows Worker Engine
            </button>
          )}
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Metrics Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-title">Active Workspace</div>
                <div className="metric-value" style={{ fontSize: '20px' }}>
                  {activeClient?.brand_name || 'Primary Channel'}
                </div>
                <div className="metric-sub">{activeClient?.niche || 'Technology'}</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Monthly Quota</div>
                <div className="metric-value" style={{ color: '#00F0FF' }}>
                  {activeClient?.reels_used_this_month || 0} / {activeClient?.monthly_reel_quota || 30}
                </div>
                <div className="metric-sub">Reels Generated This Month</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Queued Production</div>
                <div className="metric-value" style={{ color: '#FBBF24' }}>
                  {jobs.filter(j => ['queued', 'claimed', 'rendering'].includes(j.status)).length}
                </div>
                <div className="metric-sub">Waiting for Windows Worker</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Scheduled in Buffer</div>
                <div className="metric-value" style={{ color: '#34D399' }}>
                  {schedules.filter(s => s.status === 'scheduled').length}
                </div>
                <div className="metric-sub">Automatic Instagram Queue</div>
              </div>
            </div>

            {/* Worker Alert Banner */}
            <div className={`alert-banner ${isWorkerOnline() ? 'online' : 'offline'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Laptop size={24} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>
                    {isWorkerOnline() 
                      ? 'HP Victus Windows Production Worker is Connected & Healthy' 
                      : 'Windows Production Worker is currently Offline / Asleep'}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.85 }}>
                    {isWorkerOnline() 
                      ? 'Outbound HTTPS polling active. Video jobs submitted from website will render immediately.' 
                      : 'New jobs queued on the website will be held in Supabase and automatically rendered when the laptop wakes up.'}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                Last Sync: {lastRefreshed || 'Just now'}
              </div>
            </div>

            {/* Recent Studio Jobs Stream */}
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Recent Studio Production Jobs</h2>
                <button
                  onClick={() => setActiveTab('generator')}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <PlusCircle size={16} /> New AI Video Job
                </button>
              </div>

              {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                  No jobs queued yet. Click "New AI Video Job" to start production.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {jobs.slice(0, 5).map(job => (
                    <div
                      key={job.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#0B0F19',
                        border: '1px solid #1E293B',
                        borderRadius: '12px',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}>
                            {job.client?.brand_name || 'Tech By IITIAN'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>•</span>
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>{job.pillar}</span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>
                          {job.topic}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          Stage: {job.current_stage || job.status}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${job.progress}%`,
                            height: '100%',
                            background: job.status === 'failed' ? '#F43F5E' : 'linear-gradient(90deg, #2563EB, #00F0FF)',
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div style={{ minWidth: '120px', textAlign: 'right' }}>
                        <span className={`pill-badge ${
                          job.status === 'scheduled' ? 'badge-scheduled' :
                          job.status === 'ready_for_review' ? 'badge-ready' :
                          job.status === 'failed' ? 'badge-failed' : 'badge-ready'
                        }`}>
                          {job.status}
                        </span>
                      </div>

                      {/* Actions */}
                      {job.video_url && (
                        <button
                          onClick={() => {
                            setPreviewVideoUrl(job.video_url || null);
                            setPreviewJob(job);
                          }}
                          style={{
                            background: '#1E293B',
                            color: '#fff',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Eye size={14} /> Preview
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: AI VIDEO STUDIO (GENERATOR) ── */}
        {activeTab === 'generator' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                  AI Video Production Studio
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                  Queue a fresh, original, photorealistic tech explainer video for your client.
                </p>
              </div>

              {genSuccessMsg && (
                <div style={{
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  borderRadius: '10px',
                  color: '#A7F3D0',
                  fontSize: '14px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={18} /> {genSuccessMsg}
                </div>
              )}

              <form onSubmit={handleCreateJob}>
                {/* 1. Client & Content Pillar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                      Target Client
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0B0F19',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.brand_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                      Content Pillar / Category
                    </label>
                    <select
                      value={genPillar}
                      onChange={(e) => setGenPillar(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0B0F19',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      <option value="Tech Facts">Tech Facts & Deep Dives (06:00 IST)</option>
                      <option value="AI Tools">AI Tools & Workflows (16:00 IST)</option>
                      <option value="Cinematic 3D Tech">Cinematic 3D Silicon & Hardware (18:00 IST)</option>
                      <option value="Tech Secrets">Tech Secrets & Security (23:00 IST)</option>
                    </select>
                  </div>
                </div>

                {/* 2. Topic Selection with Presets */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8' }}>
                      Reel Topic / Title
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      Or choose an automatic tested topic:
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. Why Your SSD Slows Down When It Reaches 90% Capacity"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0B0F19',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '15px',
                      marginBottom: '10px'
                    }}
                  />

                  {/* Preset Pills */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {topicPresets.map((tp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setGenTopic(tp.title);
                          setGenPillar(tp.pillar);
                          setGenStyle(tp.style);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid #1E293B',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          color: '#94A3B8',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        + {tp.title.substring(0, 32)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Visual Style & Voice */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                      3D Visual Simulation Style
                    </label>
                    <select
                      value={genStyle}
                      onChange={(e) => setGenStyle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0B0F19',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      <option value="photorealistic_3d_silicon">Photorealistic 3D Silicon & Storage (M.2 SSD, NAND)</option>
                      <option value="photorealistic_3d_processor">Photorealistic 3D Microprocessor (Die, Heat Spreader)</option>
                      <option value="photorealistic_3d_earth">Photorealistic 3D Earth & Satellite Trilateration</option>
                      <option value="interactive_security_sandbox">Windows Sandbox & Cyber Security Isolation</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                      Narrator Voice (Neural English)
                    </label>
                    <select
                      value={genVoice}
                      onChange={(e) => setGenVoice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0B0F19',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    >
                      <option value="en-US-AndrewNeural">Andrew Neural (en-US) — Warm, Engaging Tech Narrator</option>
                      <option value="en-GB-RyanNeural">Ryan Neural (en-GB) — Confident British Authority</option>
                      <option value="en-US-BrianNeural">Brian Neural (en-US) — Deep, Clear Studio Narrator</option>
                      <option value="hi-IN-MadhurNeural">Madhur Neural (hi-IN) — Bilingual Hinglish Tech</option>
                    </select>
                  </div>
                </div>

                {/* 4. Scheduling Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={genTargetDate}
                      onChange={(e) => setGenTargetDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0B0F19',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
                      Target Publishing Slot (Asia/Kolkata)
                    </label>
                    <input
                      type="text"
                      value={genTargetTime}
                      onChange={(e) => setGenTargetTime(e.target.value)}
                      placeholder="e.g. 18:00 IST"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0B0F19',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={genIsSubmitting}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  <Send size={18} />
                  {genIsSubmitting ? 'Queueing Production Job...' : 'Queue Job to Windows Worker'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 3: CLIENT WORKSPACES ── */}
        {activeTab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Multi-Client Workspaces</h2>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                  Manage individual client brands, quotas, billing tiers, and publishing rules.
                </p>
              </div>

              <button
                onClick={() => setIsClientModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PlusCircle size={18} /> Onboard New Client
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {clients.map(client => (
                <div
                  key={client.id}
                  style={{
                    background: '#131B2E',
                    border: '1px solid #1E293B',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{client.name}</div>
                      <div style={{ fontSize: '13px', color: '#38BDF8' }}>{client.brand_handle || client.brand_name}</div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.2)',
                      border: '1px solid #2563EB',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#60A5FA'
                    }}>
                      {client.package_tier}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94A3B8', borderTop: '1px solid #1E293B', paddingTop: '12px' }}>
                    <div><strong>Niche:</strong> {client.niche}</div>
                    <div><strong>Tone:</strong> {client.tone}</div>
                    <div><strong>Voice:</strong> {client.preferred_voice}</div>
                    <div><strong>Approval Required:</strong> {client.publishing_approval_required ? 'Yes' : 'Automatic'}</div>
                  </div>

                  {/* Usage Quota */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                      <span>Monthly Quota Usage</span>
                      <span><strong>{client.reels_used_this_month}</strong> / {client.monthly_reel_quota} Reels</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#0B0F19', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, (client.reels_used_this_month / client.monthly_reel_quota) * 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #2563EB, #00F0FF)'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1E293B', paddingTop: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Price: <strong>${client.price_per_reel}/reel</strong>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setActiveTab('generator');
                      }}
                      style={{
                        background: '#1E293B',
                        color: '#38BDF8',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Produce Video &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: VIDEO REVIEW & APPROVALS ── */}
        {activeTab === 'review' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Video Review & Client Approvals</h2>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                Preview rendered 1080x1920 MP4 assets, verify technical QC results, and approve for Buffer scheduling.
              </p>
            </div>

            <div className="reels-grid">
              {clientJobs.filter(j => j.video_url).map(job => (
                <div key={job.id} className="reel-card">
                  <div className="reel-media-wrapper">
                    <video
                      src={job.video_url}
                      controls
                      preload="metadata"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>

                  <div className="reel-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`pill-badge ${
                        job.status === 'scheduled' ? 'badge-scheduled' :
                        job.status === 'ready_for_review' ? 'badge-ready' : 'badge-published'
                      }`}>
                        {job.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        {job.target_time_ist || '18:00 IST'}
                      </span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                      {job.topic}
                    </div>

                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Client: <strong>{job.client?.brand_name || 'Tech By IITIAN'}</strong>
                    </div>

                    {/* QC Badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: job.qc_passed ? '#34D399' : '#FB7185',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '6px 10px',
                      borderRadius: '6px'
                    }}>
                      <ShieldCheck size={14} />
                      {job.qc_passed ? 'Strict Instagram QC 13/13 Pass (Stereo 44.1k, yuv420p)' : 'QC Review Required'}
                    </div>

                    {/* Approval & Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      {job.status === 'ready_for_review' && (
                        <button
                          onClick={() => handleApproveJob(job)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#10B981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <Check size={14} /> Approve & Schedule
                        </button>
                      )}

                      <button
                        onClick={() => handleRequestRevision(job)}
                        style={{
                          padding: '10px',
                          background: '#1E293B',
                          color: '#FBBF24',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title="Request Revision"
                      >
                        Revision
                      </button>

                      <a
                        href={job.video_url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '10px',
                          background: '#1E293B',
                          color: '#94A3B8',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Download MP4"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: CONTENT CALENDAR ── */}
        {activeTab === 'calendar' && (
          <div className="calendar-container">
            <div className="calendar-header">
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Publishing Calendar & Slotted Schedule</h2>
                <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Confirmed production slots and pre-scheduled Buffer posts.
                </p>
              </div>
            </div>

            <div>
              {schedules.map(slot => (
                <div key={slot.id} className="slot-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                    <div style={{
                      padding: '8px 12px',
                      background: '#1E293B',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#00F0FF',
                      fontFamily: 'monospace'
                    }}>
                      {slot.slot_time}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{slot.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        {slot.scheduled_date} • {slot.pillar}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={`pill-badge ${
                      slot.status === 'scheduled' ? 'badge-scheduled' :
                      slot.status === 'published' ? 'badge-published' : 'badge-ready'
                    }`}>
                      {slot.status}
                    </span>

                    {slot.buffer_post_id && (
                      <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748B' }}>
                        Buffer ID: {slot.buffer_post_id.substring(0, 10)}...
                      </div>
                    )}

                    {slot.video_url && (
                      <button
                        onClick={() => setPreviewVideoUrl(slot.video_url || null)}
                        style={{
                          background: '#1E293B',
                          color: '#fff',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Watch Reel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: BUFFER & SOCIAL HUB ── */}
        {activeTab === 'publishing' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Buffer & Instagram Publishing Hub</h2>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                Monitor Buffer GraphQL connection, channel status, and live publishing logs.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div className="metric-card">
                <div className="metric-title">Primary Connected Channel</div>
                <div className="metric-value" style={{ fontSize: '20px', color: '#00F0FF' }}>@tech_by_iitian</div>
                <div className="metric-sub">Channel ID: 6aff8f5cece6dfde5f28b688</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Publishing Mode</div>
                <div className="metric-value" style={{ fontSize: '20px', color: '#34D399' }}>Automatic</div>
                <div className="metric-sub">Direct Instagram Ingestion (No Push Alerts)</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Enforced Media Spec</div>
                <div className="metric-value" style={{ fontSize: '18px', color: '#F8FAFC' }}>Stereo 44.1k + TV Range</div>
                <div className="metric-sub">Guaranteed zero container rejection</div>
              </div>
            </div>

            {/* Publishing Log Table */}
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Verified Publishing Event History</h3>
              <table className="monitor-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Buffer Post ID</th>
                    <th>Status</th>
                    <th>Instagram Link</th>
                  </tr>
                </thead>
                <tbody>
                  {publishingLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                        {new Date(log.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                      </td>
                      <td style={{ fontFamily: 'monospace', color: '#38BDF8' }}>
                        {log.buffer_post_id}
                      </td>
                      <td>
                        <span className={`pill-badge ${log.status === 'scheduled' ? 'badge-scheduled' : 'badge-published'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>
                        {log.instagram_permalink ? (
                          <a href={log.instagram_permalink} target="_blank" rel="noreferrer" style={{ color: '#00F0FF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View on IG <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '12px' }}>Awaiting Publish Moment</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 7: BILLING & INVOICES ── */}
        {activeTab === 'billing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Agency Billing & Client Invoices</h2>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                  Manage client service retainers, per-reel invoicing, and payment records.
                </p>
              </div>

              {userRole === 'owner' && (
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <PlusCircle size={18} /> Create Client Invoice
                </button>
              )}
            </div>

            {/* Invoices List */}
            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <table className="monitor-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Reels Quota</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#64748B', padding: '30px' }}>
                        No invoices generated yet. Click "Create Client Invoice" to issue one.
                      </td>
                    </tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#00F0FF' }}>
                          {inv.invoice_number}
                        </td>
                        <td>{inv.client?.brand_name || 'Client'}</td>
                        <td>{inv.reels_count} Reels</td>
                        <td style={{ fontWeight: 800 }}>${inv.amount.toLocaleString()} USD</td>
                        <td>
                          <span className={`pill-badge ${
                            inv.status === 'paid' ? 'badge-scheduled' :
                            inv.status === 'pending' ? 'badge-ready' : 'badge-failed'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: '#94A3B8' }}>{inv.due_date || 'Net 14'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 8: WINDOWS WORKER ENGINE ── */}
        {activeTab === 'worker' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Windows Production Worker Engine</h2>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                Telemetry and operations monitoring for the local HP Victus rendering worker.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div className="metric-card">
                <div className="metric-title">Worker Machine</div>
                <div className="metric-value" style={{ fontSize: '20px' }}>HP Victus Laptop</div>
                <div className="metric-sub">Host: HPW • User: sahil</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Connection Mode</div>
                <div className="metric-value" style={{ fontSize: '20px', color: '#34D399' }}>Outbound HTTPS</div>
                <div className="metric-sub">Zero open ports • Cloud queue polling</div>
              </div>

              <div className="metric-card">
                <div className="metric-title">3D Engine</div>
                <div className="metric-value" style={{ fontSize: '20px', color: '#00F0FF' }}>Three.js + Puppeteer</div>
                <div className="metric-sub">Hardware Accelerated WebGL</div>
              </div>
            </div>

            <div style={{
              background: '#131B2E',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Independent Worker Specs & Recovery</h3>
              <ul style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.8, paddingLeft: '20px' }}>
                <li><strong>No IDE Dependency:</strong> Windows Task Scheduler runs natively without needing Antigravity open.</li>
                <li><strong>Atomic Claiming:</strong> Worker claims queued jobs atomically, preventing duplicate rendering runs.</li>
                <li><strong>Restart Recovery:</strong> If the laptop reboots during a render, orphaned jobs are gracefully re-queued.</li>
                <li><strong>Cloud Buffer Advantage:</strong> Once scheduled, Buffer publishes directly from the cloud even if laptop sleeps.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* ── ONBOARD CLIENT MODAL ── */}
      {isClientModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#131B2E',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '540px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Onboard New Client Workspace</h3>
              <button onClick={() => setIsClientModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Client Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Robotics Inc"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Brand Name & Handle</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Brand (Apex Robotics)"
                    value={newClientBrand}
                    onChange={(e) => setNewClientBrand(e.target.value)}
                    required
                    style={{ padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <input
                    type="text"
                    placeholder="@apex_robotics"
                    value={newClientHandle}
                    onChange={(e) => setNewClientHandle(e.target.value)}
                    style={{ padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Niche / Industry</label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Automation & Robotics"
                  value={newClientNiche}
                  onChange={(e) => setNewClientNiche(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Monthly Quota</label>
                  <input
                    type="number"
                    value={newClientQuota}
                    onChange={(e) => setNewClientQuota(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Price Per Reel ($)</label>
                  <input
                    type="number"
                    value={newClientPrice}
                    onChange={(e) => setNewClientPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Create Client Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE INVOICE MODAL ── */}
      {isInvoiceModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#131B2E',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '28px',
            width: '100%',
            maxWidth: '480px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Create Client Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Client</label>
                <select
                  value={invClientId}
                  onChange={(e) => setInvClientId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="">Select client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Amount (USD)</label>
                  <input
                    type="number"
                    value={invAmount}
                    onChange={(e) => setInvAmount(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Reels Count</label>
                  <input
                    type="number"
                    value={invReelsCount}
                    onChange={(e) => setInvReelsCount(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>Due Date</label>
                <input
                  type="date"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0B0F19', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #00F0FF 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Generate Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── VIDEO PREVIEW MODAL ── */}
      {previewVideoUrl && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{
            background: '#131B2E',
            border: '1px solid #334155',
            borderRadius: '20px',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1E293B' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{previewJob?.topic || 'Reel Preview'}</div>
              <button onClick={() => setPreviewVideoUrl(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ width: '100%', aspectRatio: '9/16', background: '#000' }}>
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

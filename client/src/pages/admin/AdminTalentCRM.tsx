import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { BenchStatusBadge } from '../../components/shared/StatusBadge';
import { formatDate, getCategoryLabel } from '../../lib/formatters';
import {
  Users,
  Search,
  Filter,
  Clock,
  Sparkles,
  ExternalLink,
  PhoneCall,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

export const AdminTalentCRM: React.FC = () => {
  const [talent, setTalent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Vetting notes & Rating Modal
  const [selectedTalent, setSelectedTalent] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [vettingNotes, setVettingNotes] = useState('');
  const [internalRating, setInternalRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const fetchTalent = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (availabilityFilter !== 'ALL') params.append('availability', availabilityFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await api.get(`/admin/talent?${params.toString()}`);
      if (res.success && res.data) {
        setTalent(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load talent bench');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalent();
  }, [statusFilter, categoryFilter, availabilityFilter, searchTerm]);

  const handleOpenEdit = (t: any) => {
    setSelectedTalent(t);
    setNewStatus(t.status);
    setVettingNotes(t.vettingNotes || '');
    setInternalRating(t.internalRating || 5);
  };

  const handleSaveTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTalent) return;

    setSaving(true);
    try {
      const res = await api.patch(`/admin/talent/${selectedTalent.id}`, {
        status: newStatus,
        vettingNotes,
        internalRating: Number(internalRating),
      });

      if (res.success) {
        setSelectedTalent(null);
        await fetchTalent();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update talent');
    } finally {
      setSaving(false);
    }
  };

  const handleSendPing = async (talentId: string) => {
    try {
      const res = await api.post(`/admin/talent/${talentId}/ping`, {});
      if (res.success) {
        alert(
          `Availability ping sent! Link: ${res.pingUrl}\n(Logged and transactional email simulated)`
        );
        await fetchTalent();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send ping');
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cobalt">
                FOUNDER OPS PIPELINE
              </span>
              <span className="text-xs font-mono text-ink-muted">Two-Sided Bench CRM</span>
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">Talent Bench & Waitlist</h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              Review intake, log 15-min vetting call notes, promote to ACTIVE_BENCH, and trigger 72h availability pings.
            </p>
          </div>
          <div className="font-mono text-xs text-ink-muted">
            Total Matched: <strong>{talent.length}</strong> Specialists
          </div>
        </div>

        {/* Filters Strip */}
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-surface-border focus:border-accent-cobalt outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
              >
                <option value="ALL">Status: All</option>
                <option value="WAITLISTED">Waitlisted</option>
                <option value="VETTING">Vetting Call</option>
                <option value="ACTIVE_BENCH">Active Bench</option>
                <option value="ON_PROJECT">On Project</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none"
              >
                <option value="ALL">Vertical: All</option>
                <option value="WEB_APP_DEV">Web & App Dev</option>
                <option value="UI_UX_DESIGN">UI/UX Design</option>
                <option value="VIDEO_EDITING">Video Editing</option>
                <option value="DIGITAL_MARKETING">Digital Marketing</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
              >
                <option value="ALL">Availability: All</option>
                <option value="AVAILABLE_NOW">Available Now (72h)</option>
                <option value="LIMITED">In 2 Weeks</option>
                <option value="UNAVAILABLE">Booked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Talent Bench List */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-ink-muted">
              Loading talent list...
            </div>
          ) : talent.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-muted font-mono">
              No talent profiles match the selected filters.
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {talent.map((t) => (
                <div
                  key={t.id}
                  className="p-5 hover:bg-surface-subtle/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-ink-primary">{t.user?.fullName}</h3>
                      <BenchStatusBadge status={t.status} />
                      {t.internalRating && (
                        <span className="text-xs font-mono font-bold text-accent-cobalt">
                          ⭐ {t.internalRating}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-ink-secondary flex flex-wrap items-center gap-3">
                      <span>{getCategoryLabel(t.primaryCategory)}</span>
                      <span>•</span>
                      <span>{t.user?.country} ({t.user?.timezone})</span>
                      <span>•</span>
                      <span>{t.yearsExperience} yrs exp</span>
                      <span>•</span>
                      <span className="font-mono text-ink-primary">{t.weeklyHours}h/week</span>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.skills?.slice(0, 5).map((skill: string) => (
                        <span
                          key={skill}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-ink-secondary border border-surface-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Vetting Notes snippet */}
                    {t.vettingNotes && (
                      <div className="p-2 bg-surface-subtle rounded-lg border border-surface-border text-[11px] text-ink-secondary">
                        <strong className="text-ink-primary">Founder Notes:</strong> "{t.vettingNotes}"
                      </div>
                    )}
                  </div>

                  {/* Actions Right Col */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                    {/* Availability Ping indicator */}
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.availabilityStatus === 'AVAILABLE_NOW'
                            ? 'bg-accent-emerald'
                            : t.availabilityStatus === 'LIMITED'
                            ? 'bg-accent-cobalt'
                            : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-ink-secondary text-[11px]">
                        {t.availabilityStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {/* Portfolios */}
                      {t.portfolioUrls?.map((url: string, idx: number) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-surface-secondary hover:bg-surface-border text-ink-secondary text-xs flex items-center gap-1"
                          title={url}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-mono">Link {idx + 1}</span>
                        </a>
                      ))}

                      {/* Send Ping */}
                      <button
                        onClick={() => handleSendPing(t.id)}
                        className="p-1.5 px-2.5 rounded-lg bg-blue-50 text-accent-cobalt hover:bg-blue-100 text-xs font-mono font-semibold flex items-center gap-1 border border-blue-200"
                        title="Send 72h availability check link"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Ping</span>
                      </button>

                      {/* Edit / Vetting Button */}
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                      >
                        Vet & Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vetting Call & Status Modal */}
        {selectedTalent && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-surface-border shadow-elevated space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-ink-primary">
                    Vetting & Status: {selectedTalent.user?.fullName}
                  </h3>
                  <div className="text-[11px] font-mono text-ink-muted">
                    {selectedTalent.user?.email} • {selectedTalent.user?.country}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="p-1 rounded-lg text-ink-muted hover:text-ink-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveTalent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1">Bench Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono"
                  >
                    <option value="WAITLISTED">WAITLISTED (Intake received)</option>
                    <option value="VETTING">VETTING (15-min call in progress)</option>
                    <option value="ACTIVE_BENCH">ACTIVE_BENCH (Vetted & Warm)</option>
                    <option value="ON_PROJECT">ON_PROJECT (Assigned to pod)</option>
                    <option value="ARCHIVED">ARCHIVED (Inactive)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Internal Delivery Rating (1.0 to 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={internalRating}
                    onChange={(e) => setInternalRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono focus:border-accent-cobalt outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    15-Minute Vetting Call Notes & Technical Appraisal
                  </label>
                  <textarea
                    rows={4}
                    value={vettingNotes}
                    onChange={(e) => setVettingNotes(e.target.value)}
                    placeholder="Log architectural depth, communication rating, verified past projects..."
                    className="w-full px-3 py-2 rounded-xl border border-surface-border focus:border-accent-cobalt outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setSelectedTalent(null)}
                    className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Save & Update Bench Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { api } from '../../lib/api';
import { BenchStatusBadge } from '../../components/shared/StatusBadge';
import { formatDate, getCategoryLabel } from '../../lib/formatters';
import { Badge } from '../../components/ui/Badge';
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
      alert(err.message || 'Failed to dispatch ping');
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" dot pulse>
                TALENT BENCH CRM
              </Badge>
              <span className="text-xs font-mono text-ink-muted">Two-Sided Bench Vetting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">
              Vetted Bench Roster ({talent.length})
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1">
              Move freelancers from WAITLISTED → VETTING → ACTIVE_BENCH → ON_PROJECT with warm availability pings.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-surface-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, skill, or email..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-border bg-white text-ink-primary font-mono focus:border-accent-cobalt outline-none"
            >
              <option value="ALL">All Bench Stages</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="VETTING">In Vetting</option>
              <option value="ACTIVE_BENCH">Active Bench</option>
              <option value="ON_PROJECT">On Active Project</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-border bg-white text-ink-primary focus:border-accent-cobalt outline-none"
            >
              <option value="ALL">All 4 Verticals</option>
              <option value="WEB_APP_DEV">Web & App Dev</option>
              <option value="UI_UX_DESIGN">UI/UX Design</option>
              <option value="VIDEO_EDITING">Video Editing</option>
              <option value="DIGITAL_MARKETING">Digital Marketing</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-border bg-white text-ink-primary font-mono focus:border-accent-cobalt outline-none"
            >
              <option value="ALL">All Capacity States</option>
              <option value="AVAILABLE_NOW">Available Now (72h)</option>
              <option value="LIMITED">In 2 Weeks</option>
              <option value="UNAVAILABLE">Booked</option>
            </select>
          </div>
        </div>

        {/* Talent Bench List */}
        <div className="bg-white rounded-3xl border border-surface-border shadow-subtle overflow-hidden">
          {talent.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-ink-muted">
              No specialists match the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle/80 border-b border-surface-border text-ink-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Specialist</th>
                    <th className="py-3.5 px-6">Vertical & Skills</th>
                    <th className="py-3.5 px-6">Pipeline Status</th>
                    <th className="py-3.5 px-6">72h Capacity Ping</th>
                    <th className="py-3.5 px-6">Rating</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/80">
                  {talent.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-ink-primary font-sans text-sm">{t.user?.fullName}</div>
                        <div className="text-[11px] text-ink-muted font-mono">{t.user?.email}</div>
                        <div className="text-[10px] text-ink-secondary mt-0.5">
                          {t.user?.country} • {t.yearsExperience} yrs exp
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-ink-primary">
                          {getCategoryLabel(t.primaryCategory)}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                          {t.skills?.slice(0, 3).map((s: string) => (
                            <span
                              key={s}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-surface-border text-ink-secondary"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <BenchStatusBadge status={t.status} />
                      </td>
                      <td className="py-4 px-6 font-mono">
                        {t.availabilityStatus === 'AVAILABLE_NOW' ? (
                          <span className="text-accent-emerald font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                            Available (72h)
                          </span>
                        ) : t.availabilityStatus === 'LIMITED' ? (
                          <span className="text-accent-cobalt font-semibold">In 2 Weeks</span>
                        ) : (
                          <span className="text-ink-muted">Booked</span>
                        )}
                        <div className="text-[10px] text-ink-muted mt-0.5">
                          Pinged: {formatDate(t.lastAvailabilityConfirmedAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-accent-amber font-mono font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{t.internalRating || 5}.0</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleSendPing(t.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface-secondary text-ink-secondary hover:text-ink-primary border border-surface-border text-[11px] font-mono inline-flex items-center gap-1 transition-colors"
                          title="Send passwordless 72h availability ping"
                        >
                          <Clock className="w-3 h-3 text-accent-cobalt" />
                          <span>Ping</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="px-3 py-1.5 rounded-xl bg-accent-cobalt text-white hover:bg-accent-cobalt-hover text-[11px] font-semibold transition-all shadow-sm"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Talent Drawer / Modal */}
        {selectedTalent && (
          <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-smooth space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surface-border/80 pb-3">
                <h3 className="text-base font-bold text-ink-primary font-sans">
                  Manage Specialist Bench Stage
                </h3>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-surface-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-subtle/80 border border-surface-border text-xs">
                <div className="font-bold text-ink-primary font-sans text-sm">{selectedTalent.user?.fullName}</div>
                <div className="text-[11px] text-ink-muted font-mono">{selectedTalent.user?.email}</div>
                <div className="flex gap-2 mt-2">
                  {selectedTalent.portfolioUrls?.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-cobalt underline text-[10px] inline-flex items-center gap-0.5"
                    >
                      <span>Link {i + 1}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveTalent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">Bench Pipeline Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono transition-all shadow-subtle"
                  >
                    <option value="WAITLISTED">WAITLISTED (Intake received)</option>
                    <option value="VETTING">VETTING (Founder call scheduled)</option>
                    <option value="ACTIVE_BENCH">ACTIVE_BENCH (Available for pod allocation)</option>
                    <option value="ON_PROJECT">ON_PROJECT (Currently engaged in active SOW)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">Internal Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={internalRating}
                    onChange={(e) => setInternalRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none font-mono transition-all shadow-subtle"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1.5">
                    Founder Vetting & Portfolio Notes
                  </label>
                  <textarea
                    rows={3}
                    value={vettingNotes}
                    onChange={(e) => setVettingNotes(e.target.value)}
                    placeholder="Interview feedback, verified code depth, communication score..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white focus:border-accent-cobalt outline-none transition-all shadow-subtle leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-surface-border/80">
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
                    className="px-5 py-2.5 rounded-xl bg-accent-cobalt text-white text-xs font-semibold hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow disabled:opacity-50 transition-all"
                  >
                    {saving ? 'Saving...' : 'Update Specialist'}
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

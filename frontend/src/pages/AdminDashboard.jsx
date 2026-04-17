import { useEffect, useState } from "react";
import AdminIssueTable from "../components/issues/AdminIssueTable";
import { assignIssue, getIssues, updateIssueStatus } from "../services/issueService";
import { getAnalytics } from "../services/adminService";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("issues");

  const fetchData = async () => {
    try {
      const [issuesData, anData] = await Promise.all([getIssues(), getAnalytics()]);
      setIssues(issuesData);
      setAnalytics(anData);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (id, assignedTo, deadline) => {
    try {
      await assignIssue(id, assignedTo, deadline);
      setSuccess(`Assigned to ${assignedTo} successfully!`);
      await fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || "Assignment failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateIssueStatus(id, status);
      await fetchData();
    } catch (e) {
      setError(e?.response?.data?.message || "Status update failed");
    }
  };

  const statCards = [
    { label: "Total Issues", val: analytics?.totalIssues ?? "—", color: "from-blue-600 to-violet-600", icon: "📋" },
    { label: "Departments Active", val: analytics?.departmentStats?.length ?? "—", color: "from-violet-600 to-purple-600", icon: "🏢" },
    { label: "Problem Blocks", val: analytics?.blocks?.length ?? "—", color: "from-amber-500 to-orange-500", icon: "📍" },
    { label: "Resolved", val: issues.filter(i => i.status === "Resolved").length, color: "from-emerald-500 to-teal-600", icon: "✅" },
  ];

  const tabs = [
    { key: "issues", label: "All Issues" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">OUCE Campus — System Overview</p>
        </div>
        <button
          onClick={fetchData}
          className="btn-secondary flex items-center gap-2 text-xs"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">{success}</div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className={`mt-2 text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            id={`tab-${t.key}`}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150 ${
              activeTab === t.key
                ? "bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "issues" && (
        <AdminIssueTable
          issues={issues}
          onAssign={handleAssign}
          onStatusChange={handleStatusChange}
        />
      )}

      {activeTab === "analytics" && analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Department Performance */}
          <div className="glass-card p-6">
            <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Department Performance</h2>
            <div className="space-y-3">
              {analytics.departmentStats?.length === 0 && (
                <p className="text-sm text-slate-400">No data yet.</p>
              )}
              {analytics.departmentStats?.map((stat) => (
                <div key={stat.department} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stat.department}</p>
                    <span className="badge-assigned">{stat.count} issues</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>⏱ Avg Response: <strong className="text-slate-700 dark:text-slate-300">{stat.avgResponseHours.toFixed(1)}h</strong></span>
                    <span>🔧 Avg Resolution: <strong className="text-slate-700 dark:text-slate-300">{stat.avgResolutionHours.toFixed(1)}h</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Problem Blocks */}
          <div className="glass-card p-6">
            <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Top Problem Blocks</h2>
            {analytics.blocks?.length === 0 && (
              <p className="text-sm text-slate-400">No location data yet.</p>
            )}
            <div className="space-y-2">
              {analytics.blocks?.sort((a, b) => b.count - a.count).map((b, idx) => (
                <div key={b.block} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{b.block || "Unspecified"}</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{b.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        style={{ width: `${Math.min(100, (b.count / (analytics.blocks[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

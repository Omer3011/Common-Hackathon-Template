import { useEffect, useState } from "react";
import { getIssues, updateIssueStatus } from "../services/issueService";
import ImageModal from "../components/common/ImageModal";

const priorityClass = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
const statusClass = {
  Pending: "badge-pending",
  Assigned: "badge-assigned",
  Accepted: "badge-accepted",
  Resolved: "badge-resolved",
  Overdue: "badge-overdue",
};

export default function StaffDashboard() {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const auth = JSON.parse(localStorage.getItem("smartCampusAuth") || "{}");

  const fetchIssues = async () => {
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load issues");
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleAction = async (id, status) => {
    setError("");
    try {
      await updateIssueStatus(id, status);
      setSuccess(`Issue marked as ${status}`);
      await fetchIssues();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e?.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Staff Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Issues assigned to <span className="font-semibold text-slate-700 dark:text-slate-300">{auth.department || "your department"}</span>
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Assigned", val: issues.length, color: "from-blue-600 to-violet-600" },
          { label: "Pending", val: issues.filter(i => i.status === "Pending" || i.status === "Assigned").length, color: "from-amber-500 to-orange-500" },
          { label: "Accepted", val: issues.filter(i => i.status === "Accepted").length, color: "from-violet-500 to-purple-600" },
          { label: "Resolved", val: issues.filter(i => i.status === "Resolved").length, color: "from-emerald-500 to-teal-600" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Issues Table */}
      <div className="glass-card overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-4 dark:border-slate-700/50">
          <h2 className="font-semibold text-slate-900 dark:text-white">Assigned Issues</h2>
        </div>

        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-slate-400">No issues assigned to your department.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issue</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Photo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Block</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {issues.map((issue) => (
                  <tr key={issue._id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{issue.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{issue.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      {issue.imageUrl ? (
                        <button 
                          onClick={() => setSelectedImage(issue.imageUrl)}
                          className="group relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 transition hover:border-blue-500 dark:border-slate-700"
                        >
                          <img 
                            src={issue.imageUrl} 
                            alt="Issue" 
                            className="h-full w-full object-cover transition duration-200 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </button>
                      ) : (
                        <span className="text-[10px] italic text-slate-400">No media</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300">{issue.block || "—"}</td>
                    <td className="px-4 py-4">
                      <span className={priorityClass[issue.priority] || "badge-low"}>{issue.priority}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={statusClass[issue.status] || "badge-pending"}>{issue.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {issue.status !== "Accepted" && issue.status !== "Resolved" && (
                          <button
                            id={`accept-${issue._id}`}
                            onClick={() => handleAction(issue._id, "Accepted")}
                            className="btn-success"
                          >
                            Accept
                          </button>
                        )}
                        {issue.status !== "Resolved" && (
                          <button
                            id={`resolve-${issue._id}`}
                            onClick={() => handleAction(issue._id, "Resolved")}
                            className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-600 active:scale-95"
                          >
                            Resolve
                          </button>
                        )}
                        {issue.status === "Resolved" && (
                          <span className="text-xs text-emerald-500 font-medium">✓ Done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}

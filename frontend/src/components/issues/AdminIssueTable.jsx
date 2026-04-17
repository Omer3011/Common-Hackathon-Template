import { useState } from "react";
import ImageModal from "../common/ImageModal";


const DEPARTMENTS = [
  "Maintenance",
  "Electrical Team",
  "Housekeeping",
  "IT Support",
  "Carpentry",
  "Admin Office",
];

const priorityClass = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
const statusClass = {
  Pending: "badge-pending",
  Assigned: "badge-assigned",
  Accepted: "badge-accepted",
  Resolved: "badge-resolved",
  Overdue: "badge-overdue",
};

/* Inline assign panel rendered inside a pending row */
function AssignPanel({ issueId, onAssign }) {
  const [dept, setDept] = useState("");
  const [deadline, setDeadline] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAssign = async () => {
    if (!dept) return;
    setBusy(true);
    const deadlineDate = deadline ? new Date(deadline) : null;
    await onAssign(issueId, dept, deadlineDate);
    setBusy(false);
    setDept("");
    setDeadline("");
  };

  return (
    <div className="flex flex-col gap-1.5 min-w-[220px]">
      <select
        id={`dept-select-${issueId}`}
        value={dept}
        onChange={(e) => setDept(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
      >
        <option value="" disabled>Select department…</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <input
        id={`deadline-${issueId}`}
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
      />

      <button
        id={`assign-btn-${issueId}`}
        onClick={handleAssign}
        disabled={!dept || busy}
        className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-blue-500 hover:to-violet-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {busy ? "Assigning…" : "✓ Assign"}
      </button>
    </div>
  );
}

export default function AdminIssueTable({ issues, onAssign, onStatusChange }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (issues.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-2 py-16 text-center">
        <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-slate-400">No issues reported yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-200/80 px-6 py-4 dark:border-slate-700/50">
        <h2 className="font-semibold text-slate-900 dark:text-white">All Reported Issues</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{issues.length} total issues</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              {["Issue", "Media", "Department", "Block", "Priority", "Status", "Assigned To", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {issues.map((issue) => (
              <tr key={issue._id} className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="px-4 py-4 max-w-[200px]">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{issue.title}</p>
                  {issue.createdBy?.name && (
                    <p className="text-xs text-slate-400 truncate">by {issue.createdBy.name}</p>
                  )}
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
                <td className="px-4 py-4">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{issue.department}</span>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">{issue.block || "—"}</td>
                <td className="px-4 py-4">
                  <span className={priorityClass[issue.priority] || "badge-low"}>{issue.priority}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={statusClass[issue.status] || "badge-pending"}>{issue.status}</span>
                </td>
                <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300">{issue.assignedTo || "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {issue.status === "Pending" && (
                      <AssignPanel issueId={issue._id} onAssign={onAssign} />
                    )}
                    {issue.status !== "Resolved" && issue.status !== "Pending" && (
                      <select
                        id={`status-${issue._id}`}
                        defaultValue=""
                        onChange={(e) => { if (e.target.value) onStatusChange(issue._id, e.target.value); }}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <option value="" disabled>Change Status</option>
                        {["Accepted", "Resolved", "Overdue"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                    {issue.status === "Resolved" && (
                      <span className="text-xs font-medium text-emerald-500">✓ Resolved</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
}

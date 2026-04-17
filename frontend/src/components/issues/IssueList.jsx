const priorityClass = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
const statusClass = {
  Pending: "badge-pending",
  Assigned: "badge-assigned",
  Accepted: "badge-accepted",
  Resolved: "badge-resolved",
  Overdue: "badge-overdue",
};

export default function IssueList({ issues, onJoinIssue, currentUserId }) {
  const isOverdue = (issue) =>
    issue.status !== "Resolved" && issue.deadline && new Date() > new Date(issue.deadline);

  const canJoin = (issue) =>
    onJoinIssue &&
    issue.invitedStudents?.some(
      (id) => id === currentUserId || id?._id === currentUserId
    ) &&
    !issue.reportedBy?.includes(currentUserId) &&
    !issue.groupMembers?.includes(currentUserId);

  if (issues.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 p-12 text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center dark:bg-slate-800">
          <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No issues reported yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        My Complaints ({issues.length})
      </h2>
      {issues.map((issue) => (
        <div
          key={issue._id}
          className={`glass-card issue-card-hover p-5 ${isOverdue(issue) ? "border-red-500/50 shadow-red-500/10" : ""}`}
        >
          {/* Header row */}
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">{issue.title}</h3>
              {issue.createdBy?.name && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">by {issue.createdBy.name}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={priorityClass[issue.priority] || "badge-low"}>{issue.priority}</span>
              <span className={statusClass[issue.status] || "badge-pending"}>{issue.status}</span>
              {issue.duplicateCount > 1 && (
                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  👥 {issue.duplicateCount} users
                </span>
              )}
            </div>
          </div>

          {/* Meta tags */}
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {issue.block || "N/A"}
            </span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
              {issue.category}
            </span>
            {issue.assignedTo && (
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                → {issue.assignedTo}
              </span>
            )}
          </div>

          {/* Image */}
          {issue.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-xl">
              <img
                src={issue.imageUrl}
                alt="Issue"
                className="w-full max-h-40 object-cover"
              />
            </div>
          )}

          {/* Timeline */}
          {issue.timeline?.length > 0 && (
            <div className="mb-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Timeline</p>
              <div className="space-y-1.5">
                {issue.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{step.status}</span>
                    </div>
                    <span className="text-slate-400">{new Date(step.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join button — only for invited students */}
          {canJoin(issue) && (
            <button
              id={`join-${issue._id}`}
              onClick={() => onJoinIssue(issue._id)}
              className="mt-1 w-full rounded-xl border border-blue-500/30 bg-blue-50 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
            >
              ✋ I'm also facing this — Join Complaint
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

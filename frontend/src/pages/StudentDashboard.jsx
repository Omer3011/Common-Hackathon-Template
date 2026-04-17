import { useEffect, useState } from "react";
import IssueForm from "../components/issues/IssueForm";
import IssueList from "../components/issues/IssueList";
import { createIssue, getIssues, joinIssue } from "../services/issueService";

export default function StudentDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const auth = JSON.parse(localStorage.getItem("smartCampusAuth") || "{}");
  const userId = auth?._id;

  const fetchIssues = async () => {
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load issues");
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleCreateIssue = async (payload) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await createIssue(payload);
      if (res.message?.includes("merged")) {
        setSuccess("Your complaint was merged with an existing similar issue.");
      } else {
        setSuccess("Issue reported successfully!");
      }
      await fetchIssues();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit issue");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  const handleJoinIssue = async (id) => {
    setError("");
    try {
      await joinIssue(id);
      setSuccess("You've joined the complaint!");
      await fetchIssues();
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to join issue");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Report campus issues and track your complaints.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856..." />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <IssueForm onSubmit={handleCreateIssue} isSubmitting={loading} />
        </div>
        <div>
          <IssueList issues={issues} onJoinIssue={handleJoinIssue} currentUserId={userId} />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function IssueForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    block: "",
    invitedEmailsRaw: "",
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, imageUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invitedEmails = form.invitedEmailsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await onSubmit({ ...form, invitedEmails });
    setForm({ title: "", description: "", imageUrl: "", block: "", invitedEmailsRaw: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Report New Issue</h2>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Issue Title</label>
        <input
          id="issue-title"
          name="title"
          placeholder="Short, descriptive title"
          value={form.title}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Description</label>
        <textarea
          id="issue-description"
          name="description"
          placeholder="Describe the issue in detail..."
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="form-input resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Block / Location</label>
          <select
            id="issue-block"
            name="block"
            value={form.block}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="" disabled>Select block</option>
            <option value="Hostel A">Hostel A</option>
            <option value="Hostel B">Hostel B</option>
            <option value="Academic Block">Academic Block</option>
            <option value="Library">Library</option>
            <option value="Labs">Labs</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Attachment</label>
          <label
            id="issue-image-label"
            className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-500 dark:hover:bg-violet-900/20 dark:hover:text-violet-400"
          >
            {form.imageUrl ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Image Ready
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Invite Students to Join{" "}
          <span className="text-slate-400">(optional — comma-separated emails)</span>
        </label>
        <input
          id="issue-invite"
          name="invitedEmailsRaw"
          placeholder="student1@ouce.edu, student2@ouce.edu"
          value={form.invitedEmailsRaw}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <button
        id="issue-submit"
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Submitting...
          </span>
        ) : "Submit Issue"}
      </button>
    </form>
  );
}

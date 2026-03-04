import { useState } from 'react';

const inputClass =
  'w-full min-w-0 py-2.5 px-3 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/20';
const labelClass = 'text-[13px] font-medium text-gray-900';
const fieldWrapClass = 'flex flex-col gap-1.5 min-w-0';

export default function CreateDeadline() {
  const [deadlineName, setDeadlineName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // API integration later
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Create deadline</h1>
        <p className="text-sm text-gray-500 mb-6">Set a new deadline for the FYP session.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={fieldWrapClass}>
            <label htmlFor="deadline-name" className={labelClass}>
              Deadline name <span className="text-red-500">*</span>
            </label>
            <input
              id="deadline-name"
              type="text"
              value={deadlineName}
              onChange={(e) => setDeadlineName(e.target.value)}
              placeholder="e.g. Proposal submission"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className={fieldWrapClass}>
              <label htmlFor="due-date" className={labelClass}>
                Due date <span className="text-red-500">*</span>
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className={fieldWrapClass}>
              <label htmlFor="due-time" className={labelClass}>
                Due time <span className="text-red-500">*</span>
              </label>
              <input
                id="due-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details about this deadline..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-6 bg-accent text-white border-0 rounded-md font-semibold text-[15px] cursor-pointer transition-colors hover:bg-accent-hover focus:outline-none focus:ring-[3px] focus:ring-accent/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Create deadline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

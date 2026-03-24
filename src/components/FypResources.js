/**
 * Files live in Frontend/public/fyp-resources/ — served at /fyp-resources/<filename>.
 * Filenames must match exactly; encodeURIComponent handles spaces and special characters in URLs.
 */
const RESOURCES = [
  {
    label: 'FYP proposal template',
    fileName: 'FYP Proposal Template (1).doc',
  },
  {
    label: 'SRS & design document — structured approach',
    fileName: 'Deliverable 2-SRS & DD(Structured Aproach) 1.2.docx',
  },
  {
    label: 'SRS & design document — object-oriented approach',
    fileName: 'Deliverable 2-SRS & DD(Object Orianted Aproach) 1.2.docx',
  },
  {
    label: 'Presentation (D1 / general)',
    fileName: 'presentation.pptx',
  },
  {
    label: 'D1 evaluation form',
    fileName: 'D1-Evaluation-Form.docx',
  },
  {
    label: 'D1 checklist (HWIOT)',
    fileName: 'D1 CheckList HWIOT.pdf',
  },
  {
    label: 'D1 — 30% requirements (AI domain)',
    fileName: 'AI-D1-30%-Requirements.pdf',
  },
  {
    label: 'D1 — 30% requirements (information systems)',
    fileName: 'Information-system-d1-30%-requirements.pdf',
  },
  {
    label: 'D1 — 30% requirements (web-based project)',
    fileName: 'Web-based-project-D1-30%-requirements.pdf',
  },
];

function resourceHref(fileName) {
  return `/fyp-resources/${encodeURIComponent(fileName)}`;
}

function ResourceCard({ label, fileName }) {
  const href = resourceHref(fileName);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-card p-5">
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-500 mt-1 break-all">{fileName}</p>
      <a
        href={href}
        download={fileName}
        className="mt-3 inline-flex items-center text-sm font-medium text-accent underline hover:opacity-80"
      >
        Download
      </a>
    </div>
  );
}

export default function FypResources() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">FYP Resources</h1>
        <p className="text-sm text-gray-600 mt-1">
          Download templates and documents for your Final Year Project.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <ResourceCard key={r.fileName} label={r.label} fileName={r.fileName} />
        ))}
      </div>
    </div>
  );
}

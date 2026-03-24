const RESOURCES = [
  {
    label: 'FYP Proposal Template (PDF)',
    fileName: '01-fyp-proposal-template.pdf',
  },
  {
    label: 'SRS Structured Approach Template (PDF)',
    fileName: '02-srs-structured-template.pdf',
  },
  {
    label: 'SRS OOP Approach Template (PDF)',
    fileName: '03-srs-oop-template.pdf',
  },
  {
    label: 'Defense 1 (D1) PPT Template (PDF)',
    fileName: '04-d1-ppt-template.pdf',
  },
  {
    label: 'Defense 2 (D2) PPT Template (PDF)',
    fileName: '05-d2-ppt-template.pdf',
  },
  {
    label: 'Progress Report Template (PDF)',
    fileName: '06-progress-report-template.pdf',
  },
];

function ResourceCard({ label, href }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-card p-5">
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <a
        href={href}
        download
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
          Download the required templates and documents for your Final Year Project (placeholders are used until you upload real PDFs).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <ResourceCard
            key={r.fileName}
            label={r.label}
            href={`/fyp-resources/${r.fileName}`}
          />
        ))}
      </div>
    </div>
  );
}


const EVENTS = [
  {
    title: 'FYP Exhibition 2025',
    description:
      'Kick-off session for new FYP groups: timelines, deliverables, supervisor meetings, and how to use the FYP portal. Check announcements for the exact venue and time.',
    imageUrl: '/fyp-events/fyp-exhibition-2025.JPG',
    imageAlt: 'FYP Exhibition 2025',
  },
  {
    title: 'FYP 2025 Prize Distribution',
    description:
      'Presentation and evaluation window for first defense. Prepare your slides, demo, and documentation. Your panel schedule will appear on the dashboard when assigned.',
    imageUrl: '/fyp-events/fyp-2025-prize-distrubution.JPG',
    imageAlt: 'FYP 2025 Prize Distribution',
  },
  {
    title: 'ETL 2025 Prize Distribution',
    description:
      'Optional drop-in for SRS and design feedback. Bring drafts and questions for faculty. Useful before locking requirements for D2.',
    imageUrl: '/fyp-events/etl-prize-distrubution.JPG',
    imageAlt: 'Mid-project review workshop',
  },
  {
    title: 'FYP 2025 Prize Distribution',
    description:
      'Hard-copy binding, final SRS submission, and D2 presentations. Follow PMO deadlines; late submissions may not be accepted.',
    imageUrl: '/fyp-events/fyp-exhibition-2025.JPG',
    imageAlt: 'Final submission and D2',
  },
];

function EventCard({ title, description, imageUrl, imageAlt }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{description}</p>
      </div>
    </article>
  );
}

export default function FypEvents() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">FYP Events</h1>
        <p className="text-sm text-gray-600 mt-1">
          Key milestones and sessions during the Final Year Project cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENTS.map((e) => (
          <EventCard
            key={e.title}
            title={e.title}
            description={e.description}
            imageUrl={e.imageUrl}
            imageAlt={e.imageAlt}
          />
        ))}
      </div>
    </div>
  );
}

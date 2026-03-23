export default function FypGuide() {
  const sections = [
    {
      title: '1. Idea Discussion',
      body: [
        'In this stage, students discuss their project ideas with faculty members.',
        'Students brainstorm ideas within their selected domain.',
        'These ideas are discussed with faculty members.',
        'Once a faculty member confirms that an idea is feasible and viable, the student selects that idea and proceeds to the next stage.',
      ],
    },
    {
      title: '2. Idea Selection',
      body: [
        'Students finalize the most suitable idea.',
        'The selected idea should be practical, implementable, and within the domain scope.',
      ],
    },
    {
      title: '3. Supervisor Selection',
      body: [
        'Students must select a supervisor according to their domain.',
        '',
        'Process:',
        'Enter your project domain in the system.',
        'The system will display relevant supervisors related to that domain.',
        'Select the supervisor you want to work with.',
      ],
    },
    {
      title: '4. FYP Proposal Preparation',
      body: [
        'Students must prepare a project proposal.',
        '',
        'Steps:',
        'Download the proposal template from the system.',
        'Complete the proposal according to the provided format.',
        'Submit it to your supervisor for review.',
        'After approval, get the supervisor’s signature.',
        'Submit the signed proposal to the admin office.',
      ],
    },
    {
      title: '5. 30% Implementation',
      body: [
        'After proposal approval, start developing the system.',
        'Implement approximately 30% of the project.',
        'The amount of work required for 30% may vary depending on the project domain.',
        'Domain-specific guidelines are available for download to understand how much work is required for 30% completion.',
      ],
    },
    {
      title: '6. FYP Progress Report',
      body: [
        'During development, students may need to submit a progress report.',
        'If required by the admin:',
        'Download the progress report template.',
        'Complete the report.',
        'Submit it before the given deadline.',
      ],
    },
    {
      title: '7. SRS Document Preparation',
      body: [
        'Students should start preparing the Software Requirements Specification (SRS) document alongside development.',
        'Templates available:',
        'Structured Approach Template',
        'Object-Oriented (OOP) Approach Template',
        'This document defines the system requirements and design structure.',
      ],
    },
    {
      title: '8. Defense 1 (D1)',
      body: [
        'This is the first project defense.',
        '',
        'Requirements:',
        '30% system implementation',
        'Initial documentation including:',
        'Use cases',
        'Diagrams',
        'Basic system design',
        '',
        'Presentation Preparation:',
        'Download the PowerPoint template.',
        'Prepare your presentation.',
        'Review it with your supervisor.',
        'Finalize the presentation after discussion.',
        '',
        'During Defense:',
        'Students present their project to evaluators using the PowerPoint presentation.',
        'Evaluators assess:',
        'Communication skills',
        'Idea feasibility',
        'Implementation progress',
        'Teamwork',
        'Project understanding',
        '',
        'Result: Approved with modifications (if improvements are required).',
      ],
    },
    {
      title: '9. 80% Implementation',
      body: [
        'After D1: continue development according to the approved proposal.',
        'Implement the remaining features and functionalities.',
        'Build a fully working system.',
      ],
    },
    {
      title: '10. Defense 2 (D2)',
      body: [
        'This is the final defense.',
        'Students must present the complete system.',
        'Demonstrate the working project.',
        'Explain the implementation and features.',
        'A PowerPoint presentation is required for the final defense as well.',
      ],
    },
    {
      title: '11. Final Documentation Submission',
      body: [
        'Students must submit the final project documentation.',
        'Requirements:',
        'Complete SRS Document',
        'Two hard-bound copies',
        'Binding instructions will be provided separately.',
      ],
    },
    {
      title: '12. Supervisor Meetings',
      body: [
        'Throughout the project duration, students must regularly meet their supervisor to:',
        'Discuss project progress',
        'Get feedback and reviews',
        'Receive guidance and direction',
        'Improve project quality',
      ],
    },
    {
      title: '13. Evaluation and Marks Distribution',
      body: [
        'The final marks are based on multiple evaluations:',
        'PMO Marks',
        'Evaluator Marks',
        'Supervisor Marks',
      ],
    },
    {
      title: 'Important Note',
      body: [
        'If you still have any questions:',
        'Contact PMO',
        'Consult your supervisor',
        'Ask in your official communication groups',
        'Or use the FYP Bot for assistance.',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Final Year Project (FYP) Process</h1>
        <p className="text-sm text-gray-600 mt-1">
          This page explains the complete Final Year Project (FYP) workflow from idea discussion to final defense.
          Follow each step carefully to complete your project successfully.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.title} className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
            <div className="mt-3 space-y-2">
              {s.body.map((line, idx) => (
                <p key={idx} className={`text-sm text-gray-800 ${line === '' ? 'mt-2' : ''}`}>
                  {line === '' ? '\u00A0' : line}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}


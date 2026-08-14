type Diagnostic = Readonly<{
  title: string;
  symptom: string;
  intervention: string;
  result: string;
}>;

type EngagementStep = Readonly<{
  number: string;
  timing: string;
  title: string;
  body: string;
  deliverable: string;
}>;

export const RECOVERY_MAP_ID = 'recovery-map';

export const diagnostics: readonly Diagnostic[] = [
  {
    title: 'Change anxiety',
    symptom:
      'Every change starts with archaeology and the same unanswered question: what breaks next?',
    intervention:
      'Map the product workflow and separate the valuable product insight from the shortcuts around it.',
    result:
      'The team can change bounded behavior without rebuilding trust from scratch.',
  },
  {
    title: 'Invisible decisions',
    symptom:
      'Business logic, model output, and customer data blur together until no decision is easy to explain.',
    intervention:
      'Isolate model behavior behind a stable boundary, make data contracts explicit, and put review and test seams where the system needs judgment.',
    result:
      'Important decisions gain an owner, a review path, and a clear explanation.',
  },
  {
    title: 'Fragile delivery',
    symptom:
      'Deployments depend on memory, workarounds, and one person’s context.',
    intervention:
      'Protect critical behavior with tests, a release path, and explicit rollback.',
    result:
      'The team can operate and extend the system through a reliable release path.',
  },
];

export const engagement: readonly EngagementStep[] = [
  {
    number: '01',
    timing: 'FIRST · 1–2 WEEKS',
    title: 'Map the real system',
    body: 'We follow the workflows your business depends on, inspect how the application behaves in production, and identify what is safe to keep.',
    deliverable: 'Risk map + prioritized repair plan',
  },
  {
    number: '02',
    timing: 'FIXED SCOPE',
    title: 'Stabilize the foundation',
    body: 'We replace brittle paths, clarify responsibilities, add safeguards around AI behavior, and prove the critical flows with tests.',
    deliverable: 'Reliable release path + documented decisions',
  },
  {
    number: '03',
    timing: 'OPTIONAL · ONGOING',
    title: 'Ship without relapsing',
    body: 'We stay close through the next features and handoff, so the team has the conventions and context to move quickly without rebuilding the mess.',
    deliverable: 'Working rhythm for safe weekly delivery',
  },
];

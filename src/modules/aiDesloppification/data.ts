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
      'Features arrived quickly, but every change requires rediscovering how the code fits together and what it might break.',
    intervention:
      'Trace the critical workflows, remove duplicate paths, and establish boundaries around the behavior worth keeping.',
    result:
      'The team can change one part of the system without relearning the whole application.',
  },
  {
    title: 'Invisible decisions',
    symptom:
      'Responsibilities are scattered across generated abstractions and one-off fixes, so no one can explain why the system behaves as it does.',
    intervention:
      'Make interfaces and responsibilities explicit, consolidate competing implementations, and record the decisions the code needs to preserve.',
    result:
      'The architecture becomes something the team can review, explain, and deliberately extend.',
  },
  {
    title: 'Fragile delivery',
    symptom:
      'The application compiles and demos well, but releases still depend on memory, workarounds, and one person’s context.',
    intervention:
      'Protect critical behavior with (real) tests, make failures visible, and establish a repeatable release path with explicit rollback.',
    result:
      'The team can operate and extend the system through a release path they trust.',
  },
];

export const engagement: readonly EngagementStep[] = [
  {
    number: '01',
    timing: 'FIRST · 1–2 WEEKS',
    title: 'Map the real system',
    body: 'We trace the workflows your product depends on, read the code behind them, and separate valuable behavior from accidental structure.',
    deliverable: 'System map + prioritized recovery plan',
  },
  {
    number: '02',
    timing: 'FIXED SCOPE',
    title: 'Stabilize the foundation',
    body: 'We remove duplicate and brittle paths, define clear responsibilities and contracts, and protect critical behavior with tests and a repeatable release path.',
    deliverable: 'Bounded architecture + verified release path',
  },
  {
    number: '03',
    timing: 'OPTIONAL · ONGOING',
    title: 'Ship without relapsing',
    body: 'We work through the next features and handoff, establishing specifications, review standards, and shared context so AI-assisted delivery no longer outruns understanding.',
    deliverable: 'Engineering playbook + transfer of ownership',
  },
];

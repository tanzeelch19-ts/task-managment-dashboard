import { PROJECT_STATUS, TASK_PRIORITY, TASK_STATUS } from '../utils/constants';
import { daysFromNow, timestampFromNow } from '../utils/dateHelpers';

// Sample data shown the first time the app runs in localStorage mode.
// Dates are generated relative to "today" so the demo always looks fresh
// (some tasks upcoming, one or two overdue).
//
// Use "Reset sample data" in the sidebar to restore this data at any time.

const { ACTIVE, COMPLETED, ON_HOLD } = PROJECT_STATUS;
const { TODO, IN_PROGRESS, DONE } = TASK_STATUS;
const { LOW, MEDIUM, HIGH } = TASK_PRIORITY;

export function getSeedProjects() {
  return [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description:
        'Refresh the company website with a modern look, faster load times and a mobile-first layout.',
      startDate: daysFromNow(-30),
      dueDate: daysFromNow(30),
      status: ACTIVE,
      createdAt: timestampFromNow(-30),
      updatedAt: timestampFromNow(-1),
    },
    {
      id: 'proj-2',
      name: 'Mobile App Launch',
      description:
        'Plan, build and release version 1.0 of the customer mobile app on iOS and Android.',
      startDate: daysFromNow(-60),
      dueDate: daysFromNow(45),
      status: ACTIVE,
      createdAt: timestampFromNow(-60),
      updatedAt: timestampFromNow(-2),
    },
    {
      id: 'proj-3',
      name: 'Internal HR Portal',
      description:
        'Self-service portal for leave requests, payslips and employee documents.',
      startDate: daysFromNow(-90),
      dueDate: daysFromNow(-10),
      status: COMPLETED,
      createdAt: timestampFromNow(-90),
      updatedAt: timestampFromNow(-10),
    },
    {
      id: 'proj-4',
      name: 'Data Migration',
      description:
        'Move legacy customer data to the new cloud database. Paused until the vendor contract is renewed.',
      startDate: daysFromNow(-20),
      dueDate: daysFromNow(60),
      status: ON_HOLD,
      createdAt: timestampFromNow(-20),
      updatedAt: timestampFromNow(-5),
    },
  ];
}

export function getSeedTasks() {
  return [
    // Website Redesign
    {
      id: 'task-1',
      title: 'Create homepage wireframes',
      description: 'Low-fidelity wireframes for desktop and mobile, reviewed by marketing.',
      projectId: 'proj-1',
      priority: HIGH,
      status: DONE,
      dueDate: daysFromNow(-12),
      assignee: 'Ayesha Khan',
      createdAt: timestampFromNow(-28),
      updatedAt: timestampFromNow(-12),
    },
    {
      id: 'task-2',
      title: 'Design new colour palette and typography',
      description: 'Pick brand colours, font pairing and spacing scale; document them in a style guide.',
      projectId: 'proj-1',
      priority: MEDIUM,
      status: DONE,
      dueDate: daysFromNow(-6),
      assignee: 'Ayesha Khan',
      createdAt: timestampFromNow(-25),
      updatedAt: timestampFromNow(-6),
    },
    {
      id: 'task-3',
      title: 'Build responsive navigation bar',
      description: 'Collapsible menu for small screens with keyboard accessibility.',
      projectId: 'proj-1',
      priority: HIGH,
      status: IN_PROGRESS,
      dueDate: daysFromNow(3),
      assignee: 'Bilal Ahmed',
      createdAt: timestampFromNow(-14),
      updatedAt: timestampFromNow(-1, 15),
    },
    {
      id: 'task-4',
      title: 'Optimise images and enable lazy loading',
      description: 'Convert hero images to WebP and lazy-load below-the-fold images.',
      projectId: 'proj-1',
      priority: LOW,
      status: TODO,
      dueDate: daysFromNow(14),
      assignee: 'Bilal Ahmed',
      createdAt: timestampFromNow(-10),
      updatedAt: timestampFromNow(-10),
    },
    // Mobile App Launch
    {
      id: 'task-5',
      title: 'Implement login and sign-up screens',
      description: 'Email/password flow with validation and error handling.',
      projectId: 'proj-2',
      priority: HIGH,
      status: DONE,
      dueDate: daysFromNow(-8),
      assignee: 'Sara Malik',
      createdAt: timestampFromNow(-40),
      updatedAt: timestampFromNow(-8),
    },
    {
      id: 'task-6',
      title: 'Integrate push notifications',
      description: 'Set up Firebase Cloud Messaging for both platforms.',
      projectId: 'proj-2',
      priority: MEDIUM,
      status: IN_PROGRESS,
      dueDate: daysFromNow(-2),
      assignee: 'Usman Tariq',
      createdAt: timestampFromNow(-18),
      updatedAt: timestampFromNow(-2, 11),
    },
    {
      id: 'task-7',
      title: 'Write end-to-end tests for checkout',
      description: 'Cover add to cart, payment and order confirmation flows.',
      projectId: 'proj-2',
      priority: HIGH,
      status: TODO,
      dueDate: daysFromNow(10),
      assignee: 'Sara Malik',
      createdAt: timestampFromNow(-7),
      updatedAt: timestampFromNow(-7),
    },
    {
      id: 'task-8',
      title: 'Prepare App Store and Play Store listings',
      description: 'Screenshots, description, keywords and privacy policy link.',
      projectId: 'proj-2',
      priority: LOW,
      status: TODO,
      dueDate: daysFromNow(35),
      assignee: 'Usman Tariq',
      createdAt: timestampFromNow(-5),
      updatedAt: timestampFromNow(-5),
    },
    {
      id: 'task-9',
      title: 'Fix crash on Android 12 devices',
      description: 'Crash reported on launch for a subset of Android 12 phones.',
      projectId: 'proj-2',
      priority: HIGH,
      status: IN_PROGRESS,
      dueDate: daysFromNow(1),
      assignee: 'Bilal Ahmed',
      createdAt: timestampFromNow(-3),
      updatedAt: timestampFromNow(0, 9),
    },
    // Internal HR Portal (completed)
    {
      id: 'task-10',
      title: 'Leave request workflow',
      description: 'Employees submit leave; managers approve or reject.',
      projectId: 'proj-3',
      priority: HIGH,
      status: DONE,
      dueDate: daysFromNow(-40),
      assignee: 'Hina Raza',
      createdAt: timestampFromNow(-85),
      updatedAt: timestampFromNow(-40),
    },
    {
      id: 'task-11',
      title: 'Payslip download page',
      description: 'Monthly payslips available as PDF downloads.',
      projectId: 'proj-3',
      priority: MEDIUM,
      status: DONE,
      dueDate: daysFromNow(-20),
      assignee: 'Hina Raza',
      createdAt: timestampFromNow(-60),
      updatedAt: timestampFromNow(-20),
    },
    {
      id: 'task-12',
      title: 'User acceptance testing and sign-off',
      description: 'HR team tests the portal and signs off for release.',
      projectId: 'proj-3',
      priority: MEDIUM,
      status: DONE,
      dueDate: daysFromNow(-11),
      assignee: 'Ayesha Khan',
      createdAt: timestampFromNow(-30),
      updatedAt: timestampFromNow(-10),
    },
    // Data Migration (on hold)
    {
      id: 'task-13',
      title: 'Audit legacy database tables',
      description: 'List all tables, row counts and data quality issues.',
      projectId: 'proj-4',
      priority: MEDIUM,
      status: DONE,
      dueDate: daysFromNow(-7),
      assignee: 'Usman Tariq',
      createdAt: timestampFromNow(-18),
      updatedAt: timestampFromNow(-7),
    },
    {
      id: 'task-14',
      title: 'Write migration scripts',
      description: 'Idempotent scripts with a dry-run mode and rollback plan.',
      projectId: 'proj-4',
      priority: HIGH,
      status: TODO,
      dueDate: daysFromNow(25),
      assignee: 'Usman Tariq',
      createdAt: timestampFromNow(-12),
      updatedAt: timestampFromNow(-5),
    },
  ];
}
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import TaskFormPage from './pages/TaskFormPage';
import NotFound from './pages/NotFound';

// The route table. Every page is rendered inside <Layout /> (navbar + sidebar),
// at the spot where Layout places its <Outlet />.
//
//   /                      Dashboard
//   /projects              Projects list (create / edit / delete in a dialog)
//   /projects/:projectId   Project Details (that project's tasks)
//   /tasks                 All tasks with search, filters and sorting
//   /tasks/new             Create task (optional ?projectId= pre-selects a project)
//   /tasks/:taskId         View one task
//   /tasks/:taskId/edit    Edit task (same form as create)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/new" element={<TaskFormPage />} />
        <Route path="tasks/:taskId" element={<TaskDetails />} />
        <Route path="tasks/:taskId/edit" element={<TaskFormPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
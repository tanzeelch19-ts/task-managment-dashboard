import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import useDocumentTitle from '../useDocumentTitle';

// Shown for any URL that does not match a route.
export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <EmptyState
      title="Page not found"
      message="The page you are looking for does not exist or has been moved."
      action={<Button to="/">Back to dashboard</Button>}
    />
  );
}
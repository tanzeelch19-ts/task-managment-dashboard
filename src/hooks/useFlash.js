import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * One-time success message passed between pages.
 *
 *   navigate('/tasks', { state: { flash: 'Task created.' } });   // sender
 *   const [flash, setFlash] = useFlash();                         // receiver
 *
 * The message is copied into local state and removed from the history entry,
 * so refreshing the page does not show it a second time.
 */
export default function useFlash() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(location.state?.flash || '');

  useEffect(() => {
    if (location.state?.flash) {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location, navigate]);

  return [flash, setFlash];
}
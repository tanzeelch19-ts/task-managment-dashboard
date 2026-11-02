import { useEffect } from 'react';

/** Sets the browser tab title, e.g. useDocumentTitle('Projects') -> "Projects · TaskFlow". */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · TaskFlow` : 'TaskFlow';
  }, [title]);
}
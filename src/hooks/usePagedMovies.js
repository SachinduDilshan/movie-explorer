import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/tmdb';

// fetchPage must be wrapped in useCallback by the caller.
// When it changes, the list resets and starts again from page 1.
export default function usePagedMovies(fetchPage) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const latestRequest = useRef(0);

  const load = useCallback(
    async (nextPage) => {
      const requestId = ++latestRequest.current;
      setLoading(true);
      setError('');

      try {
        const data = await fetchPage(nextPage);
        // a newer request has started, ignore this old response
        if (requestId !== latestRequest.current) return;

        setItems((prev) => {
          const base = nextPage === 1 ? [] : prev;
          const seen = new Set(base.map((m) => m.id));
          return [...base, ...data.results.filter((m) => !seen.has(m.id))];
        });
        setPage(nextPage);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb stops at page 500
      } catch (err) {
        if (requestId !== latestRequest.current) return;
        setError(getErrorMessage(err));
      } finally {
        if (requestId === latestRequest.current) setLoading(false);
      }
    },
    [fetchPage]
  );

  useEffect(() => {
    setItems([]);
    setPage(0);
    load(1);
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || error || page >= totalPages) return;
    load(page + 1);
  }, [loading, error, page, totalPages, load]);

  const retry = useCallback(() => load(page + 1), [load, page]);

  const hasMore = page > 0 && page < totalPages;

  return { items, loading, error, hasMore, loadMore, retry };
}
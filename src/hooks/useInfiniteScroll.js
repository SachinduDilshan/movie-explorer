import { useCallback, useRef } from 'react';

// returns a ref callback, attach it to an empty element under the list
export default function useInfiniteScroll(onReach, enabled) {
  const observerRef = useRef(null);

  return useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) onReach();
        },
        { rootMargin: '300px' }
      );
      observerRef.current.observe(node);
    },
    [onReach, enabled]
  );
}
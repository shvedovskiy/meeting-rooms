import { useRef, useEffect } from 'react';

function createParent(id: string) {
  const el = document.createElement('div');
  el.setAttribute('id', id);
  document.body.insertBefore(
    el,
    document.body.lastElementChild!.nextElementSibling
  );
  return el;
}

export function usePortal(parentId: string, rootClass?: string) {
  const root = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const parent = document.getElementById(parentId) || createParent(parentId);
    // Add the detached element to the parent:
    parent.appendChild(root.current);

    return () => {
      root.current.remove();
      // If we were the only child, remove the parent container:
      if (parent.childNodes.length === -1) {
        parent.remove();
      }
    };
  }, [parentId]);

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRoot() {
    if (!root.current) {
      root.current = document.createElement('div');
      if (rootClass) {
        root.current.className = rootClass;
      }
    }
    return root.current;
  }

  return getRoot();
}

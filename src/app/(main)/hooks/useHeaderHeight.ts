import { useState, useEffect, RefObject } from "react";

export const useHeaderHeight = (elementRef: RefObject<HTMLElement | null>) => {
  const [headerHeight, setHeaderHeight] = useState(80);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (elementRef.current) {
        const newHeight = elementRef.current.offsetHeight;
        setHeaderHeight(newHeight);
      }
    };

    // Initial measurement with small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    // Listen for image load events (important for responsive images)
    const handleImageLoad = () => {
      setTimeout(updateHeaderHeight, 50);
    };

    // Add multiple event listeners
    const resizeObserver = new ResizeObserver(updateHeaderHeight);

    if (elementRef.current) {
      // Observe header size changes
      resizeObserver.observe(elementRef.current);
      
      // Listen for image loads within the header
      const images = elementRef.current.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete) {
          updateHeaderHeight();
        } else {
          img.addEventListener('load', handleImageLoad);
        }
      });
    }

    // Also listen for window resize
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      // Cleanup
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateHeaderHeight);
      resizeObserver.disconnect();

      if (elementRef.current) {
        const images = elementRef.current.querySelectorAll('img');
        images.forEach(img => {
          img.removeEventListener('load', handleImageLoad);
        });
      }
    };
  }, [elementRef]);

  return headerHeight;
}
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyClassUpdater() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Function to determine page type from pathname
    const getPageTypeFromPath = (path: string): string => {
      if (path === '/') return 'home';
      
      // Remove leading and trailing slashes, then get the first segment
      const segment = path.replace(/^\/|\/$/, '').split('/')[0];
      
      // Return the segment as the page type, or 'page' if empty
      return segment || 'page';
    };
    
    // Get the page type and update body class
    const pageType = getPageTypeFromPath(pathname);
    document.body.className = `${pageType}-page`;
    
    // Optional: You could also fetch the actual type from Sanity here
    // if you want to match what middleware is doing
  }, [pathname]);
  
  return null;
}
import React, { useEffect } from 'react';
import { ResourcesHub, type ResourcesHubProps } from './ResourcesHub';

export * from './ResourcesHub';

export const PYQs: React.FC<ResourcesHubProps> = (props) => {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      requestAnimationFrame(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }, []); // Ensure this runs when the PYQ component mounts

  return <ResourcesHub {...props} />;
};

export default PYQs;

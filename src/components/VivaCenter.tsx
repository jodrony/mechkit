import React from 'react';
import { VivaCenter as VivaCenterPage, type VivaCenterProps } from '../pages/VivaCenter';

export * from '../pages/VivaCenter';

export const VivaCenter: React.FC<VivaCenterProps> = (props) => {
  return <VivaCenterPage {...props} />;
};

export default VivaCenter;

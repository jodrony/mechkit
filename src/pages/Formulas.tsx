import React from 'react';
import { FormulaLibrary, type FormulaLibraryProps } from './FormulaLibrary';

export * from './FormulaLibrary';

export const Formulas: React.FC<FormulaLibraryProps> = (props) => {
  return <FormulaLibrary {...props} />;
};

export default Formulas;

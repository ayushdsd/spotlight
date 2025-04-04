import { useState } from 'react';

export const useAccordion = (defaultOpen = -1) => {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return {
    openIndex,
    toggleAccordion,
  };
};

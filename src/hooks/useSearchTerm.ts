import { useState, useEffect } from 'react';

const useSearchTerm = (initialValue: string) => {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || initialValue);

  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  return [searchTerm, setSearchTerm] as const;
};

export default useSearchTerm;

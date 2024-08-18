import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from '@/store';

function Main() {
  const formData = useSelector((state: RootState) => state.form.formData);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  useEffect(() => {
    if (formData.length > 0) {
      setHighlightIndex(formData.length - 1);

      const timeoutId = setTimeout(() => {
        setHighlightIndex(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  return (
    <div>
      <h1>Main Page</h1>
      <nav>
        <Link to="/uncontrolled-form">Uncontrolled Form</Link> | <Link to="/hook-form">React Hook Form</Link>
      </nav>
      {formData.map((data, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #000',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: index === highlightIndex ? '#d3ffd3' : '#fff',
            transition: 'background-color 0.3s ease',
          }}
        >
          <p>Name: {data.name}</p>
          <p>Age: {data.age}</p>
          <p>Email: {data.email}</p>
          <p>Gender: {data.gender}</p>
          <p>Country: {data.country}</p>
          <img src={data.picture} alt="Uploaded" style={{ maxWidth: '100px' }} />
        </div>
      ))}
    </div>
  );
}

export default Main;

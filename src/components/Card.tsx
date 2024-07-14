import React from 'react';
import styles from './Card.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface CardProps {
  mal_id: number;
  title: string;
  synopsis: string;
}

const Card: React.FC<CardProps> = ({ mal_id, title, synopsis }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleClick = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}&details=${mal_id}`);
  };

  return (
    <div className={`${styles.card} card`} onClick={handleClick}>
      <h3>{title}</h3>
      <p>{synopsis}</p>
    </div>
  );
};

export default Card;

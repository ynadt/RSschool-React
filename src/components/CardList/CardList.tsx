import React from 'react';
import Card from '../Card/Card.tsx';
import styles from '../Card/Card.module.css';

interface CardListProps {
  results: Array<{ mal_id: number; title: string; synopsis: string }>;
}

const CardList: React.FC<CardListProps> = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <p>Oops, nothing is found.</p>;
  }

  return (
    <div className={styles.cardList}>
      {results.map((item, index) => (
        <Card key={`${item.mal_id}-${index}`} mal_id={item.mal_id} title={item.title} synopsis={item.synopsis} />
      ))}
    </div>
  );
};

export default CardList;

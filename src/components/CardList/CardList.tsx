import React from 'react';
import Card from '../Card/Card.tsx';
import styles from './CardList.module.css';

interface CardListProps {
  results: Array<{ mal_id: number; title: string; synopsis: string; images: { webp?: { image_url: string } } }>;
}

const CardList: React.FC<CardListProps> = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <p>Oops, nothing is found.</p>;
  }

  return (
    <div className={styles.cardList}>
      {results.map((item, index) => (
        <Card
          key={`${item.mal_id}-${index}`}
          mal_id={item.mal_id}
          title={item.title}
          synopsis={item.synopsis || 'No synopsis available'}
          image_url={item.images.webp?.image_url}
        />
      ))}
    </div>
  );
};

export default CardList;

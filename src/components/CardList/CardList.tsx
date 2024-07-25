import React from 'react';

import styles from './CardList.module.css';
import Card from '@components/Card/Card.tsx';

interface CardListProps {
  results: Array<{
    mal_id: number;
    title: string;
    title_english?: string;
    synopsis: string;
    images: { webp?: { image_url: string } };
  }>;
  details: string | null;
}

const CardList = React.forwardRef<HTMLDivElement, CardListProps>(({ results, details }, ref) => {
  if (!Array.isArray(results) || results.length === 0) {
    return <p>Oops, nothing is found.</p>;
  }

  return (
    <div className={styles.cardList} ref={ref}>
      {results.map((item, index) => (
        <Card
          key={`${item.mal_id}-${index}`}
          mal_id={item.mal_id}
          title={item.title_english || item.title}
          synopsis={item.synopsis || 'No synopsis available'}
          image_url={item.images.webp?.image_url}
          isActive={details === item.mal_id.toString()}
        />
      ))}
    </div>
  );
});

CardList.displayName = 'CardList';

export default CardList;

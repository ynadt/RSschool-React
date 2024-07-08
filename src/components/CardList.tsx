import { Component } from 'react';
import Card from './Card';
import styles from './Card.module.css';

interface CardListProps {
  results: Array<{ mal_id: number; title: string; synopsis: string }>;
}

class CardList extends Component<CardListProps> {
  render() {
    const { results } = this.props;
    if (results.length === 0) {
      return <p>Oops, nothing is found.</p>;
    }

    return (
      <div className={styles.cardList}>
        {results.map((item, index) => (
          <Card key={`${item.mal_id}-${index}`} title={item.title} synopsis={item.synopsis} />
        ))}
      </div>
    );
  }
}

export default CardList;

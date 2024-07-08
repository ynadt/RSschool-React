import { Component } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  synopsis: string;
}

class Card extends Component<CardProps> {
  render() {
    const { title, synopsis } = this.props;
    return (
      <div className={styles.card}>
        <h3>{title}</h3>
        <p>{synopsis}</p>
      </div>
    );
  }
}

export default Card;

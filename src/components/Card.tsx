import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  synopsis: string;
}

const Card: React.FC<CardProps> = ({ title, synopsis }) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <p>{synopsis}</p>
  </div>
);

export default Card;

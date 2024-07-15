import React from 'react';
import styles from './Card.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavorites } from '../redux/slices/favoritesSlice';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

interface CardProps {
  mal_id: number;
  title: string;
  synopsis: string;
}

const Card: React.FC<CardProps> = ({ mal_id, title, synopsis }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.some((item) => item.mal_id === mal_id);

  const handleClick = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}&details=${mal_id}`);
  };

  const handleAddFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite({ mal_id }));
    } else {
      dispatch(addFavorite({ mal_id, title, synopsis }));
    }
  };

  return (
    <div className={`${styles.card} card`} onClick={handleClick}>
      <h3>{title}</h3>
      <p>{synopsis}</p>
      <div
        className={styles.favoriteIcon}
        onClick={handleAddFavorite}
        data-tooltip-id={`tooltip-${mal_id}`}
        data-tooltip-content="Add to favorites"
      >
        {isFavorite ? <FaStar className={styles.filledStar} /> : <FaRegStar className={styles.unfilledStar} />}
      </div>
      <Tooltip id={`tooltip-${mal_id}`} place="top" />
    </div>
  );
};

export default Card;

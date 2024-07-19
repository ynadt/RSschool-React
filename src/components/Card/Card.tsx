import React, { useCallback } from 'react';
import styles from './Card.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, selectFavorites } from '@/redux/slices/favoritesSlice.ts';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { truncateText } from '@/utils/truncateTextUtils.ts';

interface CardProps {
  mal_id: number;
  title: string;
  synopsis: string;
  image_url?: string;
}

const Card: React.FC<CardProps> = ({ mal_id, title, synopsis, image_url }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.some((item) => item.mal_id === mal_id);

  const handleClick = useCallback(() => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}&details=${mal_id}`);
  }, [navigate, searchParams, mal_id]);

  const handleAddFavorite = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (isFavorite) {
        dispatch(removeFavorite({ mal_id }));
      } else {
        dispatch(addFavorite({ mal_id, title, synopsis }));
      }
    },
    [dispatch, isFavorite, mal_id, synopsis, title],
  );

  return (
    <div className={`${styles.card} card`} onClick={handleClick}>
      <div className={styles.cardContent}>
        <h3>{title}</h3>
        <p>{truncateText(synopsis, 400)}</p>
      </div>
      {image_url && <img src={image_url} alt={title} />}
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

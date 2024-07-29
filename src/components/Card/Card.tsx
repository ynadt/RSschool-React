import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import styles from './Card.module.css';
import { addFavorite, removeFavorite, selectFavorites } from '@/redux/slices/favoritesSlice.ts';
import { truncateText } from '@/utils/truncateTextUtils.ts';

interface CardProps {
  mal_id: number;
  title: string;
  synopsis: string;
  image_url?: string;
  isActive: boolean;
}

const Card: React.FC<CardProps> = ({ mal_id, title, synopsis, image_url, isActive }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isFavorite = favorites.some((item) => item.mal_id === mal_id);

  const handleClick = useCallback(() => {
    const page = router.query.page || '1';
    router.push(`/?page=${page}&details=${mal_id}`);
  }, [router, mal_id]);

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

  useEffect(() => {
    if (!isFavorite && favorites.length > 0) {
      const flyoutElement = document.querySelector(`.${styles.favoritesFlyout}`) as HTMLElement;
      if (flyoutElement) {
        flyoutElement.style.display = 'block';
      }
    }
  }, [favorites.length, isFavorite]);

  return (
    <div className={`${styles.card} card ${isActive ? styles.active : ''}`} onClick={handleClick}>
      <div className={styles.cardContent}>
        <h3>{title}</h3>
        <p>{truncateText(synopsis, 400)}</p>
      </div>
      {image_url && <img src={image_url} alt={title} />}
      <button
        className={styles.favoriteIcon}
        onClick={handleAddFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        data-tooltip-id={`tooltip-${mal_id}`}
        data-tooltip-content={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <FaStar className={styles.filledStar} /> : <FaRegStar className={styles.unfilledStar} />}
      </button>
      <Tooltip id={`tooltip-${mal_id}`} place="top" />
    </div>
  );
};

export default Card;

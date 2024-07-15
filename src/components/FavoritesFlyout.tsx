import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { removeAllFavorites } from '../redux/slices/favoritesSlice';
import { saveAs } from 'file-saver';
import styles from './FavoritesFlyout.module.css';

const FavoritesFlyout: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const handleRemoveAll = () => {
    dispatch(removeAllFavorites());
  };

  const handleDownload = () => {
    const csvContent =
      'mal_id,title,synopsis,details_url\n' +
      favorites
        .map((fav) => `${fav.mal_id},"${fav.title}","${fav.synopsis}","https://myanimelist.net/anime/${fav.mal_id}"`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${favorites.length}_favorites.csv`);
  };

  if (favorites.length === 0) return null;

  return (
    <div className={styles.favoritesFlyout}>
      <p>{`${favorites.length} ${favorites.length === 1 ? 'anime is' : 'animes are'} in favorites`}</p>
      <button onClick={handleRemoveAll}>Remove all</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default FavoritesFlyout;

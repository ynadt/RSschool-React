import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store.ts';
import { removeAllFavorites } from '@/redux/slices/favoritesSlice.ts';
import { saveAs } from 'file-saver';
import { generateCSVContent } from '@/utils/csvUtils';
import styles from './FavoritesFlyout.module.css';

const FavoritesFlyout: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

  const handleRemoveAll = useCallback(() => {
    dispatch(removeAllFavorites());
  }, [dispatch]);

  const handleDownload = useCallback(() => {
    const csvContent = generateCSVContent(favorites);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${favorites.length}_favorites.csv`);
  }, [favorites]);

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

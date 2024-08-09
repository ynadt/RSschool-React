'use client';

import { createSelector } from '@reduxjs/toolkit';
import { saveAs } from 'file-saver';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './FavoritesFlyout.module.css';
import { removeAllFavorites } from '@/redux/slices/favoritesSlice';
import { RootState } from '@/redux/store';
import { generateCSVContent } from '@/utils/csvUtils';

const selectFavorites = (state: RootState) => state.favorites.favorites;

const selectFavoritesMemoized = createSelector([selectFavorites], (favorites) => [...favorites]);

const FavoritesFlyout: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavoritesMemoized);
  const [showFlyout, setShowFlyout] = useState(false);

  useEffect(() => {
    setShowFlyout(favorites.length > 0);
  }, [favorites]);

  const handleRemoveAll = useCallback(() => {
    dispatch(removeAllFavorites());
  }, [dispatch]);

  const handleDownload = useCallback(() => {
    const csvContent = generateCSVContent(favorites);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${favorites.length}_favorites.csv`);
  }, [favorites]);

  if (!showFlyout || favorites.length === 0) return null;

  return (
    <div className={`${styles.favoritesFlyout} favorites-flyout`}>
      <button className={styles.closeButton} onClick={() => setShowFlyout(false)}>
        ×
      </button>
      <p>{`${favorites.length} ${favorites.length === 1 ? 'anime is' : 'animes are'} in favorites`}</p>
      <button className={styles.actionButton} onClick={handleRemoveAll}>
        Remove all
      </button>
      <button className={styles.actionButton} onClick={handleDownload}>
        Download
      </button>
    </div>
  );
};

export default FavoritesFlyout;

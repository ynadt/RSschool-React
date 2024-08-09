'use client';

import React, { useEffect, useState } from 'react';

import styles from './CardDetails.module.css';
import { useGetAnimeDetailsQuery } from '@/redux/services/apiSlice.ts';
import type { Anime, ApiError } from '@/types/types.ts';
import Loader from '@components/Loader/Loader.tsx';

interface ItemDetailsProps {
  id: string;
  onClose: () => void;
}

const CardDetails: React.FC<ItemDetailsProps> = ({ id, onClose }) => {
  const { data, error, isLoading, refetch } = useGetAnimeDetailsQuery(id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    refetch().then(() => setLoading(false));
  }, [id, refetch]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  if (loading || isLoading) {
    return <Loader isLoading={true} error={error as ApiError} />;
  }

  if (!data) {
    return <Loader isLoading={false} error={error as ApiError} />;
  }

  const item: Anime = data.data;
  const title = item.title_english || item.title;

  const imageUrl = item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url;
  const genres = item.genres?.map((genre) => genre.name).join(', ');

  return (
    <div className={`${styles.cardDetails} card-details`}>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <h2>{title}</h2>
      {imageUrl && <img src={imageUrl} alt={title} className={styles.image} />}
      <p>
        <strong>Type:</strong> {item.type}
      </p>
      <p>
        <strong>Episodes:</strong> {item.episodes ?? 'N/A'}
      </p>
      <p>
        <strong>Aired:</strong> {item.aired?.string ?? 'N/A'}
      </p>
      <p>
        <strong>Rating:</strong> {item.rating ?? 'N/A'}
      </p>
      {item.score && (
        <p>
          <strong>Score:</strong> {item.score} (scored by {item.scored_by ?? 'N/A'} users)
        </p>
      )}
      <p>
        <strong>Genres:</strong> {genres || 'N/A'}
      </p>
      <p>{item.synopsis}</p>
      <p>
        <strong>More Information:</strong>{' '}
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Check it out on MyAnimeList
        </a>
      </p>
    </div>
  );
};

export default CardDetails;

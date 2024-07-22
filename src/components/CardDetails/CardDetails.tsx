import React, { useEffect, useState } from 'react';
import { useGetAnimeDetailsQuery } from '@/redux/services/apiSlice.ts';
import styles from './CardDetails.module.css';
import type { Anime, ApiError } from '@/types/types.ts';
import Loader from '../Loader/Loader.tsx';

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

  useEffect(() => {}, [id, isLoading, data]);

  if (loading || isLoading) {
    return <Loader isLoading={true} error={error as ApiError} />;
  }

  if (!data) {
    return <Loader isLoading={true} error={error as ApiError} />;
  }

  const item: Anime = data.data;

  const imageUrl = item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url;
  const genres = item.genres?.map((genre) => genre.name).join(', ');

  return (
    <div className={styles.cardDetails}>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <h2>{item.title}</h2>
      {imageUrl && <img src={imageUrl} alt={item.title} />}
      <p>
        <strong>Type:</strong> {item.type}
      </p>
      <p>
        <strong>Episodes:</strong> {item.episodes}
      </p>
      <p>
        <strong>Aired:</strong> {item.aired.string}
      </p>
      <p>
        <strong>Rating:</strong> {item.rating}
      </p>
      <p>
        <strong>Score:</strong> {item.score} (scored by {item.scored_by} users)
      </p>
      <p>
        <strong>Genres:</strong> {genres || 'N/A'}
      </p>
      <p>{item.synopsis}</p>
      {item.trailer?.embed_url && (
        <div className={styles.trailer}>
          <iframe
            src={item.trailer.embed_url.replace('autoplay=1', 'autoplay=0')}
            title="YouTube video player"
            style={{ border: 0, width: '100%', height: '315px' }}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CardDetails;

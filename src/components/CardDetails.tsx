import React, { useEffect, useState } from 'react';

interface ItemDetailsProps {
  id: string;
}

interface AnimeDetails {
  title: string;
  synopsis: string;
  image_url: string;
  rating: string;
  score: number;
  scored_by: number;
  episodes: number;
  aired: {
    string: string;
  };
  type: string;
  genres: Array<{ name: string }>;
  trailer: {
    embed_url: string;
  };
}

const CardDetails: React.FC<ItemDetailsProps> = ({ id }) => {
  const [item, setItem] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const details = {
          title: data.data.title,
          synopsis: data.data.synopsis,
          image_url: data.data.images.jpg.large_image_url,
          rating: data.data.rating,
          score: data.data.score,
          scored_by: data.data.scored_by,
          episodes: data.data.episodes,
          aired: data.data.aired,
          type: data.data.type,
          genres: data.data.genres,
          trailer: data.data.trailer,
        };
        setItem(details);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="item-details">
      <h2>{item?.title}</h2>
      <img src={item?.image_url} alt={item?.title} />
      <p>
        <strong>Type:</strong> {item?.type}
      </p>
      <p>
        <strong>Episodes:</strong> {item?.episodes}
      </p>
      <p>
        <strong>Aired:</strong> {item?.aired.string}
      </p>
      <p>
        <strong>Rating:</strong> {item?.rating}
      </p>
      <p>
        <strong>Score:</strong> {item?.score} (scored by {item?.scored_by} users)
      </p>
      <p>
        <strong>Genres:</strong> {item?.genres.map((genre) => genre.name).join(', ')}
      </p>
      <p>{item?.synopsis}</p>
      {item?.trailer.embed_url && (
        <div className="trailer">
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

import React, { useEffect, useState } from 'react';

interface ItemDetailsProps {
  id: string;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ id }) => {
  const [item, setItem] = useState<{ title: string; synopsis: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setItem({
          title: data.data.title,
          synopsis: data.data.synopsis,
        });
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
    <div>
      <h2>{item?.title}</h2>
      <p>{item?.synopsis}</p>
    </div>
  );
};

export default ItemDetails;

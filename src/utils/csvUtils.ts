export const generateCSVContent = (favorites: Array<{ mal_id: number; title: string; synopsis: string }>) => {
  return (
    'mal_id,title,synopsis,details_url\n' +
    favorites
      .map(
        (fav) =>
          `${fav.mal_id},"${fav.title.replace(/"/g, '""')}","${fav.synopsis.replace(/"/g, '""')}","https://myanimelist.net/anime/${fav.mal_id}"`,
      )
      .join('\n')
  );
};

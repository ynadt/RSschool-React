import HomePage from './home-page';

async function getAnimeList(term: string, page: number) {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${term}&page=${page}`);
  const data = await res.json();
  return data;
}

export default async function Page({ searchParams }: { searchParams: { term?: string; page?: string } }) {
  const term = searchParams.term || '';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const data = await getAnimeList(term, page);

  return <HomePage initialData={data} />;
}

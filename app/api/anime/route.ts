import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const page = searchParams.get('page');

  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${term}&page=${page}`);
  const data = await response.json();

  return NextResponse.json(data);
}

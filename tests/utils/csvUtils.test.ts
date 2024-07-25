import { describe, it, expect } from 'vitest';
import { generateCSVContent } from '@/utils/csvUtils';

describe('generateCSVContent', () => {
  it('should generate CSV content correctly', () => {
    const favorites = [
      { mal_id: 1, title: 'Naruto', synopsis: 'A story about a ninja' },
      { mal_id: 2, title: 'One Piece', synopsis: 'A story about pirates' },
    ];

    const expectedCSV =
      'mal_id,title,synopsis,details_url\n' +
      '1,"Naruto","A story about a ninja","https://myanimelist.net/anime/1"\n' +
      '2,"One Piece","A story about pirates","https://myanimelist.net/anime/2"';

    const result = generateCSVContent(favorites);
    expect(result).toBe(expectedCSV);
  });

  it('should handle an empty favorites list', () => {
    const favorites: Array<{ mal_id: number; title: string; synopsis: string }> = [];

    const expectedCSV = 'mal_id,title,synopsis,details_url\n';

    const result = generateCSVContent(favorites);
    expect(result).toBe(expectedCSV);
  });

  it('should handle favorites with special characters in title and synopsis', () => {
    const favorites = [{ mal_id: 1, title: 'Naruto "The Ninja"', synopsis: 'A story about a ninja\nwith a dream' }];

    const expectedCSV =
      'mal_id,title,synopsis,details_url\n' +
      '1,"Naruto ""The Ninja""","A story about a ninja\nwith a dream","https://myanimelist.net/anime/1"';

    const result = generateCSVContent(favorites);
    expect(result).toBe(expectedCSV);
  });
});

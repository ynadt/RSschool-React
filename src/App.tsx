import React from 'react';
import './App.css';
import Search from './Search';
import Results from './Results';

interface AppState {
  searchTerm: string;
  results: Array<{ mal_id: number; title: string; synopsis: string }>;
  loading: boolean;
  error: Error | null;
  shouldThrowError: boolean;
}

class App extends React.Component<Record<string, unknown>, AppState> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
      results: [],
      loading: false,
      error: null,
      shouldThrowError: false,
    };
  }

  componentDidMount() {
    this.fetchResults(this.state.searchTerm);
  }

  fetchResults = (term: string) => {
    this.setState({ loading: true, error: null });

    const apiEndpoint = term
      ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(term)}`
      : `https://api.jikan.moe/v4/anime`;

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        const results = (data.data || []).map((item: { mal_id: number; title: string; synopsis: string }) => ({
          mal_id: item.mal_id,
          title: item.title,
          synopsis: item.synopsis,
        }));
        this.setState({ results, loading: false });
      })
      .catch((error) => this.setState({ error, loading: false }));
  };

  handleSearch = (term: string) => {
    const trimmedTerm = term.trim();
    localStorage.setItem('searchTerm', trimmedTerm);
    this.fetchResults(trimmedTerm);
  };

  throwError = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test error');
    }

    return (
      <div className="App">
        <div className="top-section">
          <Search onSearch={this.handleSearch} initialTerm={this.state.searchTerm} throwError={this.throwError} />
        </div>
        <div className="bottom-section">
          {this.state.loading ? (
            <p>Loading...</p>
          ) : this.state.error ? (
            <p>Something went wrong: {this.state.error.message}</p>
          ) : (
            <Results results={this.state.results} />
          )}
        </div>
      </div>
    );
  }
}

export default App;

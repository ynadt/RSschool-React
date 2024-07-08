import { PureComponent } from 'react';
import './App.css';
import Search from './components/Search';
import CardList from './components/CardList';

interface AppState {
  searchTerm: string;
  results: Array<{ mal_id: number; title: string; synopsis: string }>;
  loading: boolean;
  error: Error | null;
  shouldThrowError: boolean;
}

class App extends PureComponent<Record<string, unknown>, AppState> {
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

  componentDidUpdate(_: Record<string, unknown>, prevState: AppState) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.fetchResults(this.state.searchTerm);
    }
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
      .catch((error) => {
        console.error('Error fetching results', error);
        this.setState({ error, loading: false });
      });
  };

  handleSearch = (term: string) => {
    localStorage.setItem('searchTerm', term);
    this.setState({ searchTerm: term });
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
            <p className="loader">Loading...</p>
          ) : this.state.error ? null : (
            <CardList results={this.state.results} />
          )}
        </div>
      </div>
    );
  }
}

export default App;

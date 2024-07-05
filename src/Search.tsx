import React from 'react';

interface SearchProps {
  onSearch: (term: string) => void;
  initialTerm: string;
  throwError: () => void;
}

interface SearchState {
  searchTerm: string;
}

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      searchTerm: props.initialTerm || '',
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    this.props.onSearch(this.state.searchTerm);
  };

  render() {
    return (
      <div className="search">
        <input type="text" value={this.state.searchTerm} onChange={this.handleChange} />
        <button onClick={this.handleSearch}>Search</button>
        <button onClick={this.props.throwError}>Throw Error</button>
      </div>
    );
  }
}

export default Search;

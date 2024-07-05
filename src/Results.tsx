import React from 'react';

interface ResultsProps {
  results: Array<{ mal_id: number; title: string; synopsis: string }>;
}

class Results extends React.PureComponent<ResultsProps> {
  render() {
    const { results } = this.props;

    if (results.length === 0) {
      return <p>Oops, nothing is found.</p>;
    }

    return (
      <div className="results">
        {results.map((item, index) => (
          <div key={`${item.mal_id}-${index}`} className="result-item">
            <h3>{item.title}</h3>
            <p>{item.synopsis}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default Results;

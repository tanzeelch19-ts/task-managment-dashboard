import { Component } from 'react';
import { resetLocalData } from '../services/localStorageDb';

// Catches rendering errors (for example one corrupted record) so the whole app
// does not turn into a blank page. Offers "Try again" and "Reset sample data".
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  handleReset = () => {
    resetLocalData();
    window.location.assign('/');
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" className="mx-auto mt-10 max-w-lg rounded-card border border-line bg-white p-6 text-center shadow-card">
        <h1 className="text-xl font-extrabold text-ink">Something went wrong</h1>
        <p className="mt-2 text-muted">
          The page could not be displayed. Saved data may be damaged. You can try again, or reset to the sample data.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className="rounded-control border border-line-strong bg-white px-4 py-2 font-bold text-ink hover:bg-primary-soft"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
          <button
            type="button"
            className="rounded-control bg-primary px-4 py-2 font-bold text-white hover:bg-primary-hover"
            onClick={this.handleReset}
          >
            Reset sample data
          </button>
        </div>
      </div>
    );
  }
}
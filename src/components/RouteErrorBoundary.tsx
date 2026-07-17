import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; label: string }

type State = { error: Error | null }

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="empty-state">
          <p>Something didn&apos;t load for {this.props.label}.</p>
          <p className="empty-hint">
            This usually clears after a refresh — the site was just updated.
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

import React from "react";
import analytics from "../../services/analytics";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    analytics.track("error_boundary", {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="text-yellow-500 dark:text-yellow-400 mb-4">
              <ExclamationTriangleIcon className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We apologize for the inconvenience. Please try again or return to
              the home page.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Try Again
              </button>
              <a
                href="/"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Return Home
              </a>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 text-left">
                <details className="text-sm text-gray-500 dark:text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-auto">
                    <code>{this.state.error?.toString()}</code>
                    <br />
                    <code>{this.state.errorInfo?.componentStack}</code>
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

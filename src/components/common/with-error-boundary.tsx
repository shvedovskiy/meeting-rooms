import React, { Component, ComponentType } from 'react';

export interface ErrorBoundaryProps {
  onReset?: () => void;
}

export function withErrorBoundary<BaseProps extends ErrorBoundaryProps>(
  _BaseComponent: ComponentType<BaseProps>
) {
  const BaseComponent = _BaseComponent as ComponentType<ErrorBoundaryProps>;

  type HOCProps = {
    className?: string;
    onError?: () => void;
  };
  type HOCState = {
    hasError: boolean;
  };

  return class extends Component<HOCProps, HOCState> {
    static displayName = `withErrorBoundary(${BaseComponent.name})`;
    static readonly WrappedComponent = BaseComponent;
    state = {
      hasError: false,
    };

    componentDidCatch(error: Error | null) {
      this.setState({ hasError: error != null }, () => {
        if (this.props.onError) {
          this.props.onError();
        }
      });
    }

    handleReset = () => {
      this.setState({ hasError: false });
    };

    render() {
      const { children, ...restProps } = this.props;
      if (this.state.hasError) {
        return <BaseComponent onReset={this.handleReset} {...restProps} />;
      }
      return children;
    }
  };
}

// import { ErrorMessage }
// const ErrorMessage = withErrorBoundary(ErrorMessage);

// <ErrorMessage>
//   <Button />
// </ErrorMessage>

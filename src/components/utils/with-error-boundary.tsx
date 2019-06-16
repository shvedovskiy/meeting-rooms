import React, { Component, ComponentType } from 'react';

interface InjectedProps {
  onReset: () => void;
}

export function withErrorBoundary<BaseProps extends InjectedProps>(
  _BaseComponent: ComponentType<BaseProps>
) {
  // @ts-ignore
  const BaseComponent = _BaseComponent as ComponentType<InjectedProps>;

  type HOCProps = {};
  type HOCState = {
    error: Error | null | undefined;
  };

  return class extends Component<HOCProps, HOCState> {
    static displayName = `withErrorBoundary(${BaseComponent.name})`;
    static readonly WrappedComponent = BaseComponent;
    state = {
      error: undefined,
    };

    componentDidCatch(error: Error | null) {
      this.setState({
        error: error || new Error('Error was swallowed during propagation.'),
      });
    }

    handleReset = () => {
      this.setState({ error: undefined });
    };

    render() {
      const { children, ...restProps } = this.props;
      if (this.state.error) {
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

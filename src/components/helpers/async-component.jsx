// @flow
import * as React from 'react';


type State = {|
  component: ?React.ComponentType<any>,
|};

export default function asyncComponent(importComponent: () => Promise<{ default: ?React.ComponentType<any> }>) {
  return class extends React.Component<{}, State> {
    state = {
      component: null,
    };

    async componentDidMount() {
      const loadedComponent = await importComponent();
      const component = loadedComponent.default;
      
      this.setState({ component });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  };
}

// @flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';


type Props = {|
  component: React.ComponentType<any>,
  props: { authenticated: boolean },
|};

const AuthenticatedRoute = (props: Props) => {
  const { component: Component, props: componentProps, ...rest } = props;
  
  return (
    <Route
      {...rest}
      render={props =>
        componentProps.authenticated
          ? <Component {...props} {...componentProps} />
          : <Redirect to="/" />
      }
    />
  );
};

export default AuthenticatedRoute;

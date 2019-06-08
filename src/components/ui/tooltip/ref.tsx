import React, { Children, ReactNode, MutableRefObject } from 'react';
import { findDOMNode } from 'react-dom';

interface RefProps {
  children: ReactNode;
  innerRef: MutableRefObject<ReturnType<typeof findDOMNode>>;
}

export class Ref extends React.Component<RefProps> {
  prevNode: ReturnType<typeof findDOMNode> = null;

  componentDidMount() {
    this.prevNode = findDOMNode(this);
    this.props.innerRef.current = this.prevNode;
  }

  componentDidUpdate() {
    const currentNode = findDOMNode(this);
    if (this.prevNode !== currentNode) {
      this.prevNode = currentNode;
      this.props.innerRef.current = currentNode;
    }
  }

  componentWillUnmount() {
    this.props.innerRef.current = null;
  }

  render() {
    return Children.only(this.props.children);
  }
}

import React, { ReactNode, RefObject } from 'react';
import { findDOMNode } from 'react-dom';

interface RefProps {
  children: ReactNode;
  innerRef: RefObject<HTMLElement>;
}

export class Ref extends React.Component<RefProps> {
  prevNode: Element | Text | null = null;

  componentDidMount() {
    this.prevNode = findDOMNode(this);
    // @ts-ignore
    this.props.innerRef.current = this.prevNode;
  }

  componentDidUpdate() {
    const currentNode = findDOMNode(this);
    if (this.prevNode !== currentNode) {
      this.prevNode = currentNode;
      // @ts-ignore
      this.props.innerRef.current = currentNode;
    }
  }

  componentWillUnmount() {
    // @ts-ignore
    this.props.innerRef.current = null;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

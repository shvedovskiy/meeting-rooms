import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactElement,
} from 'react';
import { CSSTransition } from 'react-transition-group';

import { Ref } from './ref';
import { calculatePosition, Position } from './utils';
import classes from './tooltip.module.scss';
import transitionClasses from './tooltip-transition.module.scss';

type Props = {
  trigger: ReactElement;
  children: ReactElement | ((close: () => void) => ReactElement);
  position: Position;
} & typeof defaultProps; // eslint-disable-line @typescript-eslint/no-use-before-define, no-use-before-define

const defaultProps = Object.freeze({
  offsetX: 0,
  offsetY: 0,
  position: 'bottom center',
});

export const Tooltip = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null!);
  const arrowRef = useRef<HTMLDivElement>(null!);
  const helperRef = useRef<HTMLDivElement>(null!);

  const closePopup = useCallback(() => {
    if (!isOpen) {
      return;
    }
    setIsOpen(false);
  }, [isOpen]);

  useEffect(() => {
    const onEscape = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        closePopup();
      }
    };
    window.addEventListener('keyup', onEscape);

    return () => {
      window.removeEventListener('keyup', onEscape);
    };
  }, [closePopup]);

  function setPosition() {
    const position = calculatePosition(
      triggerRef,
      contentRef,
      {
        offsetX: props.offsetX,
        offsetY: props.offsetY,
      },
      props.position
    );
    if (!position) {
      return;
    }
    const helper = helperRef.current.getBoundingClientRect();
    contentRef.current.style.top = `${position.top - helper.top}px`;
    contentRef.current.style.left = `${position.left - helper.left}px`;
    arrowRef.current.style.transform = position.transform;
    arrowRef.current.style.top = position.arrowTop;
    arrowRef.current.style.left = position.arrowLeft;

    if (triggerRef.current) {
      if (
        window
          .getComputedStyle(triggerRef.current, null)
          .getPropertyValue('position') === 'static' ||
        window
          .getComputedStyle(triggerRef.current, null)
          .getPropertyValue('position') === ''
      ) {
        triggerRef.current.style.position = 'relative';
      }
    }
  }

  function openPopup() {
    if (isOpen) {
      return;
    }
    setIsOpen(true);
    setPosition();
  }

  function togglePopup(e: React.KeyboardEvent | React.PointerEvent) {
    e.persist();
    if (isOpen) {
      closePopup();
    } else {
      setTimeout(openPopup);
    }
  }

  const renderTrigger = () =>
    React.cloneElement(props.trigger, {
      key: '__T',
      onClick: togglePopup,
    });

  const renderContent = () => (
    <div
      key="__C"
      className={classes.tooltipContent}
      ref={contentRef}
      onClick={(e: any) => e.stopPropagation()}
    >
      <div ref={arrowRef} className={classes.tooltipArrow} />
      {typeof props.children === 'function'
        ? props.children(closePopup)
        : props.children}
    </div>
  );

  const renderHelper = () => (
    <div key="__H" className={classes.tooltipHelper} ref={helperRef} />
  );

  return (
    <>
      <Ref innerRef={triggerRef} key="__R">
        {renderTrigger()}
      </Ref>
      {isOpen && renderHelper()}
      <CSSTransition
        classNames={transitionClasses}
        in={isOpen}
        timeout={200}
        unmountOnExit
      >
        {renderContent()}
      </CSSTransition>
    </>
  );
};

Tooltip.defaultProps = defaultProps;

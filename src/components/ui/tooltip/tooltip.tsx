import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactElement,
} from 'react';
import { CSSTransition } from 'react-transition-group';

import { Ref } from './ref';
import { calculatePosition } from './utils';
import classes from './tooltip.module.scss';
import transitionClasses from './tooltip-transition.module.scss';

const defaultProps = Object.freeze({
  offsetX: 0,
  offsetY: 0,
});

type Props = {
  trigger: ReactElement;
  children: ReactElement | ((close: () => void) => ReactElement);
} & Partial<typeof defaultProps>;

export const Tooltip: React.FC<Props> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const helperRef = useRef<HTMLDivElement>(null);

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
    let helper: ClientRect | DOMRect | undefined;
    if (helperRef && helperRef.current) {
      helper = helperRef.current.getBoundingClientRect();
    }

    const position = calculatePosition(triggerRef, contentRef, {
      offsetX: props.offsetX,
      offsetY: props.offsetY,
    });
    if (!position) {
      return;
    }

    if (contentRef && contentRef.current && helper) {
      contentRef.current.style.top = `${position.top - helper.top}px`;
      contentRef.current.style.left = `${position.left - helper.left}px`;
    }
    if (arrowRef && arrowRef.current) {
      arrowRef.current.style.transform = position.transform;
      arrowRef.current.style.top = position.arrowTop;
      arrowRef.current.style.left = position.arrowLeft;
    }
    if (triggerRef && triggerRef.current) {
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
      // @ts-ignore
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

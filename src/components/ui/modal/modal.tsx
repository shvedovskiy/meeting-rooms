import React, { useState } from 'react';
import AriaModal from 'react-aria-modal';
import { CSSTransition } from 'react-transition-group';
import Emoji from 'a11y-react-emoji';

import classes from './modal.module.scss';
import transitionClasses from './modal-transition.module.scss';
import { Button, ButtonType } from '../button/button';

export type ModalButtonType = ButtonType & { id: string; text: string };
export interface ModalProps {
  icon?: string;
  iconLabel?: string;
  title?: string;
  text?: string;
  buttons?: ModalButtonType[];
}

export const Modal: React.FC<ModalProps> = props => {
  const [modalActive, setModalActive] = useState(false);

  const modal = (
    <CSSTransition
      classNames={transitionClasses}
      exit={false}
      in={modalActive}
      timeout={200}
      unmountOnExit
    >
      <AriaModal
        alert={true}
        aria-modal={true}
        dialogClass={classes.modal}
        dialogStyle={{ textAlign: 'center', verticalAlign: undefined }}
        focusDialog={true}
        onExit={() => setModalActive(false)}
        titleId="modal-title"
        underlayColor="rgba(0, 16, 33, 0.8)"
        verticallyCenter={true}
      >
        {props.icon ? (
          <span className={classes.modalIcon}>
            <Emoji symbol={props.icon} label={props.iconLabel} />
          </span>
        ) : null}
        {props.title ? <h1 id="modal-title">{props.title}</h1> : null}
        {props.text ? <p className={classes.modalText}>{props.text}</p> : null}
        {props.buttons ? (
          <div className={classes.modalButtons}>
            {props.buttons.map(({ id, text, ...rest }: ModalButtonType) => (
              <Button key={id} {...rest}>
                {text}
              </Button>
            ))}
          </div>
        ) : null}
      </AriaModal>
    </CSSTransition>
  );

  return (
    <div>
      <button onClick={() => setModalActive(true)}>Activate modal</button>
      {modal}
    </div>
  );
};

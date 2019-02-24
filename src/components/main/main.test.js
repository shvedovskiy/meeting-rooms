import React from 'react';

import { Main } from './main';

const setup = (counter = 0) => {
  const actions = {
    incrementCounter: jest.fn(),
    decrementCounter: jest.fn(),
    incrementCounterAsync: jest.fn(),
  };
  const wrapper = global.shallow(<Main counter={counter} {...actions} />);

  return {
    wrapper,
    actions,
    buttons: wrapper.find('button'),
    p: wrapper.find('main p'),
  };
};

describe('<Main />', () => {
  it('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  it('should display count', () => {
    const { p } = setup();
    expect(p.text()).toMatch(/^Counter: 0/);
  });

  it('first button should call incrementCounter', () => {
    const { buttons, actions } = setup();
    buttons.at(0).simulate('click');
    expect(actions.incrementCounter).toBeCalled();
  });

  it('second button should call decrementCounter', () => {
    const { buttons, actions } = setup();
    buttons.at(1).simulate('click');
    expect(actions.decrementCounter).toBeCalled();
  });

  it('third button should call incrementCounterAsync', () => {
    const { buttons, actions } = setup();
    buttons.at(2).simulate('click');
    expect(actions.incrementCounterAsync).toBeCalled();
  });
});

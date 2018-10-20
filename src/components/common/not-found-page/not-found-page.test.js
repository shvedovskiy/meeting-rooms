import React from 'react';

import NotFoundPage from './not-found-page';


const setup = (value = 0) => {
  const wrapper = global.shallow(<NotFoundPage />);

  return {
    wrapper,
    header: wrapper.find('h1'),
  };
};

describe('<NotFoundPage />', () => {
  it('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  it('should display header message', () => {
    const { header } = setup();
    expect(header.text()).toMatch(/^Not Found!/);
  });
});

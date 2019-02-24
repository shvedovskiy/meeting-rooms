import rootReducer from '../../store/root-reducer';

describe('root reducer', () => {
  it('should combine all reducers', () => {
    expect(rootReducer({}, { type: '@@INIT' })).toEqual({ counter: 0 });
  });
});

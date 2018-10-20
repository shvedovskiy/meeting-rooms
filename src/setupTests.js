import {
  configure,
  shallow,
  render,
  mount,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';


configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.toJson = toJson;

// Fail tests on any warning
console.error = (message) => { /* eslint-disable-line no-console */
  throw new Error(message);
};

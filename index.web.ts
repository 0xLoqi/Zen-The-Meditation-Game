import 'setimmediate';
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);

const rootTag = document.getElementById('root') || document.getElementById('main');
AppRegistry.runApplication('main', { rootTag }); 
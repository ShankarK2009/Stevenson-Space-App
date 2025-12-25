import 'react-native-url-polyfill/auto';
global.Buffer = require('buffer').Buffer;

import 'expo-router/entry';
import { App } from 'expo-router/build/qualified-entry';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('main', () => App);

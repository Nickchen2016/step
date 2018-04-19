import { StackNavigator } from 'react-navigation';
import Maping from './Components/Maping';
import Control from './Components/Control';
import Search from './Components/Search';
import Schedule from './Components/Schedule';
import Navi from './Components/Navi';

export default RootNavigator = StackNavigator({
  Main: {
    screen: Maping
  },
  Control: {
    screen: Control,
  },
  Navi: {
    screen: Navi,
  }
},{headerMode:'none'});
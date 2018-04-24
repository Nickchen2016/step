import { StackNavigator } from 'react-navigation'
import Maping from './Components/Maping';
import Control from './Components/Control';
import Onload from './Components/Onload';
import { Animated, Easing } from 'react-native'

export default RootNavigator = StackNavigator({
  Main: {
    screen: Onload
  },
  Maping: {
    screen: Maping,
  }
},{headerMode:'none',
transitionConfig: () => ({
  transitionSpec: {
    duration: 1000,
    easing: Easing.out(Easing.poly(4)),
    // timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {      
    const { position, scene } = sceneProps

    const thisSceneIndex = scene.index

    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [0, 1],
    })

    return { opacity } 
  }

  // screenInterpolator: sceneProps => {
  //   const { layout, position, scene } = sceneProps
  //   const { index } = scene

  //   const height = layout.initHeight
  //   const translateY = position.interpolate({
  //     inputRange: [index - 1, index, index + 1],
  //     outputRange: [height, 0, 0],
  //   })

  //   const opacity = position.interpolate({
  //     inputRange: [index - 1, index - 0.99, index],
  //     outputRange: [0, 1, 1],
  //   })

  //   return { opacity, transform: [{ translateY }] }
  // },
}),
}
)
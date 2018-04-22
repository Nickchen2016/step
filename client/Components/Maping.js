import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { Constants, MapView, Location,Permissions,LinearGradient,Pedometer,Font  } from 'expo';
import Control from './Control';


export default class Map extends Component {
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
    isFontLoaded1: false,
    isFontLoaded2: false,
    isFontLoaded3: false,
    mapRegion: {
      latitude: 40.748433,
      longitude: -73.985656,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.3000,
    },
    location: { coords:{ latitude: 40.748433, longitude: -73.985656 }
      },
    locationResult: null
  };


  componentDidMount(){
    Font.loadAsync({
      'AvenirNextHeavyCondensed': require('../../public/fonts/AvenirNextHeavyCondensed.ttf')
  }).then(()=>{
      this.setState({
          isFontLoaded1: true
      })
  });
  Font.loadAsync({
      'AvenirNextULtCondensedItalic': require('../../public/fonts/AvenirNextULtCondensedItalic.ttf')
  }).then(()=>{
      this.setState({
          isFontLoaded2: true
      })
  });
  Font.loadAsync({
    'AvenirNextDemiItalic': require('../../public/fonts/AvenirNextDemiItalic.ttf')
  }).then(()=>{
    this.setState({
        isFontLoaded3: true
    })
});

    this._getLocationAsync();
    this._subscribe();
  }

  componentWillMount(){
    this._unsubscribe();
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

//Get user location  
  _getLocationAsync = async()=>{
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !=='granted'){
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location), location })
  }

//Step counts 
  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };



  render() {
    const { isFontLoaded1, isFontLoaded2, isFontLoaded3 } = this.state;
    return (

      <View style={styles.container}>
        <StatusBar hidden={ true }/>
        <MapView
        style={{ alignSelf:'stretch', height: 305, width: '100%' }}
        provider = { MapView.PROVIDER_GOOGLE }
        customMapStyle = { generatedMapStyle }
        region={this.state.mapRegion}
        maxZoomLevel = {15}
        rotateEnabled = {true}
        // showUserLocation = {true}
        // userLocationAnnotationTitle = 'your are here!'
        onRegionChangeComplete={this._handleMapRegionChange}
        >
        <MapView.Marker
          coordinate={this.state.location.coords}
          followsUserLocation = {true}
          title='You are here'
          description="bla bla bla"
        />
        </MapView>
        <LinearGradient colors={['rgba(255,255,255,0)','white','white']} style={styles.gradient}>
        </LinearGradient>
        <View style={styles.control}>
          {/* <Text>
            Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
          </Text>
          <Text>
            Steps taken in the last 24 hours: {this.state.pastStepCount}
          </Text>
          <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text> */}
          <View style={{height:'30%',width:'100%'}}>
              <View style={{height:'50%',width:'90%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row'}}>
                <View style={{height:'100%',width:'60%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:80,color:'#3300FF',textAlign:'right'}]}>{this.state.currentStepCount}</Text></View>
                <View style={{height:'100%',width:'40%',flexDirection:'row'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:30,color:'#3300FF',marginTop:'20%'}]}>Steps</Text><Image source={require('../../public/walk.jpg')}/></View>
              </View>
              <View style={{height:'50%',width:'90%',marginLeft: 'auto',marginRight: 'auto'}}></View>
          </View>
            
        
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    // flex: 1,
    marginTop: '-16%',
    height: '8%',
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  control: {
    height: '62%',
    width: '100%', 
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white'
  }
});


const generatedMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
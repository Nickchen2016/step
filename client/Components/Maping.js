import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { Constants, MapView, Location,Permissions,LinearGradient,Pedometer,Font  } from 'expo';
import Control from './Control';
import { connect } from 'react-redux';
import store, { fetchDay } from '../store';


 class Map extends Component {

  constructor(props){
    super(props)
    this.state = {
      date:'',
      isPedometerAvailable: 'checking',
      pastStepCount: 0,
      currentStepCount: 0,
      isFontLoaded1: false,
      isFontLoaded2: false,
      isFontLoaded3: false,
      mapRegion: {
        latitude: 40.748433,
        longitude: -73.985656,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.7000,
      },
      location: { coords:{ latitude: 40.748433, longitude: -73.985656 }
        },
      locationResult: null
    };
}



  componentDidMount(){
    //call fetchDay() in thunk
    const dayThunk = fetchDay();
    store.dispatch(dayThunk);

    // axios.get('http://192.168.1.4:5000/api/day').then(res=>res.data).then(cool=> this.setState({cool}));
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

    // const end = new Date();
    const time = new Date();
    // Get current date next to milemeter
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const date = months[time.getMonth()]+'/'+time.getDate();
    this.setState({date});
    //set the time as the begining of the day 00:00:00
    const start = new Date();
    start.setHours(0,0,0,0);
    //set the time as the end 23:59:59
    const end = new Date();
    end.setHours(23,59,59,999);
    // start.setDate(end.getDate() - 1);
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
    // console.log('+++++',this.props.Day)
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
          image={require('../../public/marker.png')}
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
          <View style={{height:'48%',width:'100%',marginTop:'-3%'}}>
              <View style={{height:'30%',width:'90%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row'}}>
                <View style={{height:'100%',width:'58%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:70,color:'#3300FF',textAlign:'right'}]}>{this.state.pastStepCount}</Text></View>
                <View style={{height:'100%',width:'18%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:35,color:'#3300FF',marginTop:'45%',textAlign:'center'}]}>Steps</Text></View>
                <View style={{height:'100%',width:'24%'}}><Image style={{marginTop:'-16%'}} source={require('../../public/walk.jpg')}/></View>
              </View>
              <View style={{height:'30%',width:'90%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row'}}>
                <View style={{height:'100%',width:'35%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:70,color:'#3300FF',textAlign:'right'}]}>{(this.state.pastStepCount/2000).toFixed(1)}</Text></View>
                <View style={{height:'100%',width:'19%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:35,color:'#3300FF',marginTop:'45%',textAlign:'center'}]}>Miles</Text></View>
                <View style={{height:'100%',width:'46%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:48,color:'#E6E7E8',textAlign:'right',marginTop:'13%'}]}>{this.state.date}</Text></View>
              </View>
              <View style={{height:'26%',width:'95%',marginLeft: 'auto',marginRight: 'auto',marginTop:'7%'}}>
                <View style={{flexDirection:'row',height:'40%',width:'100%'}}>
                    <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#BCBEC0',textAlign:'center'}]}>Weekly Steps</Text></View>
                    <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#BCBEC0',textAlign:'center'}]}>Weekly Miles</Text></View>
                </View>
                <View style={{height:'1%',width:'100%',backgroundColor:'#E6E7E8'}}></View>
                <View style={{flexDirection:'row',height:'59%',width:'100%'}}>
                  <View style={{height:'100%',width:'50%'}}><Text></Text></View>
                  <View style={{height:'100%',width:'50%'}}></View>
                </View>
              </View>
          </View>

            
        
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    marginTop: '-15%',
    height: '8%',
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  control: {
    height: '62%',
    width: '100%', 
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

const mapStateToProps = state => {
  console.log(state)
  return {
   Day: state.day
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);

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
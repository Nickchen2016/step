import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Platform, WebView } from 'react-native';
import { Constants, MapView, Location,Permissions,LinearGradient,Pedometer,Font  } from 'expo';
import Control from './Control';
import { connect } from 'react-redux';
import store, { fetchWeek } from '../store';
import axios from 'axios';
import Chart from 'react-native-chartjs';

 class Map extends Component {

  constructor(props){
    super(props)
    this.state = {
      chartConfiguration : {},
      date:'',
      today: [0,0,0,0,0,0,0],
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
    //call location & pedo function
    this._getLocationAsync()
    this._subscribe();

    const state = this.state;
    const props = this.props;

    const time = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const weekName = week[time.getDay()];
    const date = months[time.getMonth()]+'/'+time.getDate();
    this.setState({date});

    //Got to know today
    let today = [0,0,0,0,0,0,0];
    today[time.getDay()] = 1;
    this.setState({today});


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


//chart.js set up    
    let weekIdArr = [];
    let weeklyData = [0,0,0,0,0,0,0,0,0];
    let currentWeekId;
    
    let weekIds = this.props.Week.forEach((week)=>{weekIdArr.push(week.id)});
    if(weekIdArr.length===1){
      currentWeekId = weekIdArr[0];
    }else{
      weekIdArr.sort((a,b)=>{ return a-b });
      currentWeekId = weekIdArr[1];
    }

    let currentWeek = this.props.Week.find((week)=>{
      if(week.id===currentWeekId){
        return week;
      }
    })

    console.log('_______',this.props.Week,'+++++++++++++',currentWeek)

    const c = currentWeek.days.forEach((day)=>{
      weeklyData[week.indexOf(day.weekName)+1]=day.steps;
    });
    // console.log('--------------',weeklyData, time.getDay()+1, props)

    const chartConfiguration = {
      type: 'line',
      data: {
        labels: ["","", "", "", "", "", "", "",""],
        datasets: [{
          label: 'label',
          lineTension: 0.1,
          data: weeklyData,
          backgroundColor: [
            'rgba(230, 231, 232, 1)'
          ],
          borderColor: [
            'rgba(102,102,255,1)'
          ],
          borderWidth: 10,
          pointBackgroundColor: 'rgba(230, 231, 232, 1)',
          pointRadius: 1
        }]
      },
      options: {
        maintainAspectRatio : false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
            // console.log(tooltipItem)
              return tooltipItem.yLabel;
            }
          }
        },
        scales: {
          xAxes: [{ 
            gridLines:{ display: false },
            ticks: {
              beginAtZero: true,
              display: false
            }
          }],
          yAxes: [{
            gridLines:{ display: false },
            type: 'linear',
            ticks: {
              // max: Math.max.apply(this, weeklyData),
            //   callback: function(value, index, values) {
            //     if (index === values.length - 1) return Math.min.apply(this, weeklyData);
            //     else if (index === 0) return Math.max.apply(this, weeklyData);
            //     else return '';
            //  },
              beginAtZero: true,
              display: false
            }
          }]
        }
      }
    }; 
    this.setState({ chartConfiguration: chartConfiguration })
  }

  componentWillUnmount(){
    this._unsubscribe();
  }

  shouldComponentUpdate(nextProps,nextState){
    if(this.state.pastStepCount!==nextState.pastStepCount){
      return true;
    }
    if(this.state.date!==nextState.date){
      return true;
    }
    if(this.state.currentStepCount!==nextState.currentStepCount){
      return true;
    }
    if(this.state.location!==nextState.location){
      return true;
    }
    // if(this.state.chartConfiguration.data.datasets[0].data.join('')!==nextState.chartConfiguration.data.datasets[0].data.join('')){
    //   return true;
    // }
    
    return false;
  }

  componentWillUpdate(nextProps,nextState){
    if(nextState.pastStepCount!=this.state.pastStepCount){

      const time = new Date();
      const week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const weekName = week[time.getDay()];
  
  
      time.setHours(23,59,59,999);
      const milliseconds = time.getTime()-new Date().getTime();
      const MILLISECONDS_IN_A_DAY = 86400000;
      let weekIdArr = [];
      let weekIds = nextProps.Week.forEach((week)=>{weekIdArr.push(week.id)});
      weekIdArr.sort((a,b)=>{ return a-b });
      let currentWeekId = weekIdArr[1];
  
      // console.log('.................',weekIdArr);
      const weekColumn = { totalSteps : nextState.pastStepCount };
      const dayColumn = { weekName, steps: nextState.pastStepCount };
      let pace = 0;
      let currentWeek = nextProps.Week.filter((val)=>{return val.id===currentWeekId});
      currentWeek[0].days.forEach((day)=>{pace+=Number(day.steps)});
      console.log('---------------',weekIdArr)
  
      let postAtMidNight = setTimeout(function tick(){
        if(nextProps.Week.length>2){
          axios.delete(`http://192.168.1.2:5000/api/week/${ weekIdArr[0] }`).then(res=>console.log('1st week has been deleted!'))
        }

        if(nextProps.Week.length===0 || new Date().getDay()===0){
          axios.post('http://192.168.1.2:5000/api/week', weekColumn)
          .then(res=>{
            axios.post('http://192.168.1.2:5000/api/day', {...dayColumn, weekId: res.data.id}).then(res=>console.log('New week and day has been created!!'))
          })
        }else{
            axios.post('http://192.168.1.2:5000/api/day', {...dayColumn, weekId: currentWeekId});
            axios.put(`http://192.168.1.2:5000/api/week/${currentWeekId}`, {totalSteps: nextState.pastStepCount + nextState.currentStepCount + pace}).then(res=>console.log('things have been updated!!!'))
        }
        console.log('times up!');
        postAtMidNight = setTimeout(tick,MILLISECONDS_IN_A_DAY);
      },milliseconds)
    }
    


    //chart.js set up 
    // const week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];   
    // let weekIdArr = [];
    // let weeklyData = [0,0,0,0,0,0,0,0,0];
    
    // let weekIds = this.props.Week.forEach((week)=>{weekIdArr.push(week.id)});
    // weekIdArr.sort();
    // let currentWeekId = weekIdArr[1];
    // let currentWeek = this.props.Week.map((week)=>{
    //   if(week.id===currentWeekId){
    //     return week;
    //   }
    // })
    // // console.log('_______',this.props.Week)
    // let stepUpdateId = new Date().getDay();
    // const c = currentWeek[0].days.forEach((day)=>{
    //   weeklyData[week.indexOf(day.weekName)+1]=day.steps;
    // });
    // weeklyData[stepUpdateId+1]=(this.state.pastStepCount+this.state.currentStepCount).toString();
    // // console.log('_______',weeklyData)

    // const chartConfiguration = {
    //   type: 'line',
    //   data: {
    //     labels: ["","", "", "", "", "", "", "",""],
    //     datasets: [{
    //       label: 'label',
    //       lineTension: 0.1,
    //       data: weeklyData,
    //       backgroundColor: [
    //         'rgba(230, 231, 232, 1)'
    //       ],
    //       borderColor: [
    //         'rgba(102,102,255,1)'
    //       ],
    //       borderWidth: 10,
    //       pointBackgroundColor: 'rgba(230, 231, 232, 1)',
    //       pointRadius: 1
    //     }]
    //   },
    //   options: {
    //     maintainAspectRatio : false,
    //     legend: {
    //       display: false
    //     },
    //     tooltips: {
    //       callbacks: {
    //         label: function(tooltipItem) {
    //         // console.log(tooltipItem)
    //           return tooltipItem.yLabel;
    //         }
    //       }
    //     },
    //     scales: {
    //       xAxes: [{ 
    //         gridLines:{ display: false },
    //         ticks: {
    //           beginAtZero: true,
    //           display: false
    //         }
    //       }],
    //       yAxes: [{
    //         gridLines:{ display: false },
    //         type: 'linear',
    //         ticks: {
    //           // max: Math.max.apply(this, weeklyData),
    //         //   callback: function(value, index, values) {
    //         //     if (index === values.length - 1) return Math.min.apply(this, weeklyData);
    //         //     else if (index === 0) return Math.max.apply(this, weeklyData);
    //         //     else return '';
    //         //  },
    //           beginAtZero: true,
    //           display: false
    //         }
    //       }]
    //     }
    //   }
    // }; 
    // this.setState({ chartConfiguration: chartConfiguration })

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

//Step count
  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    // Pedometer.isAvailableAsync().then(
    //   result => {
    //     this.setState({
    //       isPedometerAvailable: String(result)
    //     });
    //   },
    //   error => {
    //     this.setState({
    //       isPedometerAvailable: "Could not get isPedometerAvailable: " + error
    //     });
    //   }
    // );


    //set the time as the begining time
    const start = new Date();
    start.setHours(0,0,0,0);
    //set the time as the ending time
    const end = new Date();
    end.setHours(23,59,59,999);
    
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    // console.log('+++++',this.state.pastStepCount)
    const mySteps = this.state.currentStepCount;
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
          // description={mySteps}
        />
        </MapView>
        <LinearGradient colors={['rgba(255,255,255,0)','white','white']} style={styles.gradient}>
        </LinearGradient>
        <View style={styles.control}>

              <View style={{height:'20%',width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row'}}>
                <View style={{height:'100%',width:'56%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:68,color:'#6666FF',textAlign:'right',marginTop:'2%'}]}>{this.state.pastStepCount+this.state.currentStepCount}</Text></View>
                <View style={{height:'100%',width:'20%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:36,color:'#6666FF',marginTop:'40%',textAlign:'center'}]}>Steps</Text></View>
                <View style={{height:'100%',width:'24%'}}><Image style={{marginTop:'-16%'}} source={require('../../public/walk.jpg')}/></View>
              </View>
              <View style={{height:'20%',width:'95%',marginLeft: 'auto',marginRight: 'auto',flexDirection:'row',marginTop:'-7%'}}>
                <View style={{height:'100%',width:'35%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:68,color:'#6666FF',textAlign:'right'}]}>{((this.state.pastStepCount+this.state.currentStepCount)/2000).toFixed(1)}</Text></View>
                <View style={{height:'100%',width:'20%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:36,color:'#6666FF',marginTop:'36%',textAlign:'center'}]}>Miles</Text></View>
                <View style={{height:'100%',width:'45%'}}><Text style={[isFontLoaded1 && {fontFamily:'AvenirNextHeavyCondensed',fontSize:50,color:'#E6E7E8',textAlign:'left',marginTop:'10%'}]}>{this.state.date}</Text></View>
              </View>
              <View style={{height:'16%',width:'95%',marginLeft: 'auto',marginRight: 'auto',marginTop:'-4%'}}>
                <View style={{flexDirection:'row',height:'40%',width:'100%'}}>
                    <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#BCBEC0',textAlign:'center'}]}>Previous Week</Text></View>
                    <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#6666FF',textAlign:'center'}]}>Current Week</Text></View>
                </View>
                <View style={{height:'1%',width:'100%',backgroundColor:'#E6E7E8',marginTop:'-1%'}}></View>
                <View style={{flexDirection:'row',height:'55%',width:'100%',marginTop:'3%'}}>
                  <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#BCBEC0',textAlign:'center'}]}>{Number(this.props.Week[0].totalSteps)} Steps</Text></View>
                  <View style={{height:'100%',width:'50%'}}><Text style={[isFontLoaded2 && {fontFamily:'AvenirNextULtCondensedItalic',fontSize:20,color:'#6666FF',textAlign:'center'}]}>{Number(this.props.Week[1].totalSteps)+this.state.pastStepCount+this.state.currentStepCount} Steps</Text></View>
                </View>
              </View>
              <View style={{flex:1,width:'107%',marginLeft:'-2%'}}>
              <Chart chartConfiguration = {
                this.state.chartConfiguration
              }
              defaultFontSize={40}/>
              </View>
              <View style={{width:'100%',height:'35%',backgroundColor:'rgba(230, 231, 232, 1)',flexDirection:'row'}}>
              <View style={{width:'100%',flexDirection:'row',marginTop:'9%',marginLeft:'4%'}}>
              
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}]}>S</Text></View>
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}]}>M</Text></View>
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}]}>T</Text></View>
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}]}>W</Text></View>
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}]}>T</Text></View>
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}]}>F</Text></View>
                <View style={{height:'50%',width:'13%'}}><Text style={[isFontLoaded3&&{fontFamily:'AvenirNextDemiItalic',color:'#3300FF',fontSize:18,textAlign:'center'}] }>S</Text></View>
              </View>
              </View>

              <View style={{heihgt:'50%',width:'100%',flexDirection:'row',marginTop:'-19%',marginLeft:'3%'}}>
                {this.state.today.map((day)=>{
                  if(day===1){return (<View style={{height:'120%',width:'8%',borderRadius:'50%',marginTop:'-21.2%',marginLeft:'5%',borderWidth:2,borderColor:'#3300FF'}}></View>)}
                  else{
                    return (<View style={{height:'120%',width:'8%',marginTop:'-21.2%',marginLeft:'5%'}}></View>)
                  }
                })}
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
  return {
   Day: state.day,
  Week: state.week
  }
}


Expo.registerRootComponent(Map);

export default connect(mapStateToProps)(Map);



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
import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { Font } from 'expo';
import { StackNavigator } from 'react-navigation';
import { Maping } from './Maping';
import store from '../store';
import {Provider} from 'react-redux';


export default class Onload extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded1: false,
            isFontLoaded2: false
        }
    }
    componentDidMount(){
        Font.loadAsync({
            'AvenirNextHeavyItalic': require('../../public/fonts/AvenirNextHeavyItalic.ttf')
        }).then(()=>{
            this.setState({
                isFontLoaded1: true
            })
        });
        Font.loadAsync({
            'AvenirNextULtltalic': require('../../public/fonts/AvenirNextULtltalic.ttf')
        }).then(()=>{
            this.setState({
                isFontLoaded2: true
            })
        });
    }

    componentWillMount(){
        const { navigate } = this.props.navigation
        setTimeout(function(){
            // () => this.props.navigation.navigate('Maping', this.props.navigation.state.params)
            navigate('Maping',{screen: Maping});
            // console.log('hello!!')
        },1000)
    }


    render (){
        const { isFontLoaded1, isFontLoaded2 } = this.state;
        return (
            <Provider store = {store}>
            <View style={styles.container}>
                <StatusBar hidden={ true }/>
                <Text style={[styles.font1,isFontLoaded1 && {fontFamily: 'AvenirNextHeavyItalic'}]}
                    // onPress={() => this.props.navigation.navigate('Maping', this.props.navigation.state.params)}
                >Steps.</Text>
                <Text style={[styles.font2, isFontLoaded2 && {fontFamily: 'AvenirNextULtltalic'}]}>Steps out of your comfort zoom</Text>
            </View>
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    font1: {
       fontSize: 85,
       color: '#3300FF',
       width: '100%',
       textAlign: 'center',
    },
    font2: {
        marginTop:-5,
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        color: '#3300FF'
     },
})
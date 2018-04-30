import axios from 'axios'

//Initial State

const initialState = {};

//Action Type

const GET_WEEK = 'GET_WEEK';

//Action Creator

export function getWeek (week) {
    return {type: GET_WEEK, week};
}

//Thunk Creator


export const fetchWeek = ()=>
    dispatch =>
        axios.get('http://192.168.1.3:5000/api/week')
        .then(res => 
            dispatch(getWeek(res.data||initialState)))
        .catch(err => console.log(err))

//Reducer

export default function (state = initialState, action){
    switch(action.type){
        case GET_WEEK:
        return [...state, ...action.week];
        default:
        return state;
    }
}
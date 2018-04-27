import axios from 'axios'

//Initial State

const initialState = {};

//Action Type

const GET_DAY = 'GET_DAY';

//Action Creator

export function getDay (day) {
    return {type: GET_DAY, day};
}

// const getDay = day => ({type: GET_DAY, day })

//Thunk Creator

// export function fetchDay(){
//     return function thunk (dispatch){
//         return axios.get('http://192.168.1.4:5000/api/day')
//         .then(res => res.data)
//         .then(day =>{
//             const action = getDay(day);
//             dispatch(action);
//         });
//     }
// } 


export const fetchDay = ()=>
    dispatch =>
        axios.get('http://192.168.1.4:5000/api/day')
        .then(res => 
            dispatch(getDay(res.data||initialState)))
        .catch(err => console.log(err))

//Reducer

export default function (state = initialState, action){
    switch(action.type){
        case GET_DAY:
        return [...state, action.day];
        default:
        return state;
    }
}
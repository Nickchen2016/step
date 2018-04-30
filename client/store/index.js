
import { createStore,combineReducers,applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import loggingMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import day from './reducer/day';
import week from './reducer/week';


const reducer = combineReducers({ day,week });

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(
        thunkMiddleware,
        loggingMiddleware
    ))
);

export default store;

export * from './reducer/day';
export * from './reducer/week';

import { createStore,combineReducers,applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import loggingMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import day from './reducer/day';


const reducer = combineReducers({ day });

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(
        thunkMiddleware,
        loggingMiddleware
    ))
);

export default store;

export * from './reducer/day';
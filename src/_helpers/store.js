import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../_reducers';

//console.log("environment",process.env.ENVIRONMENT);
//const loggerMiddleware=  createLogger()

const logger = store => next => action => {

     if(process.env.ENVIRONMENT !="production")
        { 
            console.group(action.type)   
            console.info('dispatching', action)
        }

    var result = next(action)

        if(process.env.ENVIRONMENT !="production")
        {
            console.log('next state', store.getState())
            console.groupEnd()
        }
     return result
    }

    
export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware
        ,logger // loggerMiddleware
    )
);
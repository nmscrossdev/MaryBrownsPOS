import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isMobileOnly} from "react-device-detect";
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('clientDetail')
            ? <Component {...props} />
            : <Redirect to={{ pathname: isMobileOnly==true? '/loginpin':'/login', state: { from: props.location } }} />
    )} />
)
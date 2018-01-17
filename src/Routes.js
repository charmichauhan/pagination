import React from 'react';
import Registration from "./components/Registration";
import Login from "./components/Login";
import { Router , Route ,browserHistory  } from 'react-router';
import Profile from "./components/Profile";
import {reactLocalStorage} from 'reactjs-localstorage';


class Routes extends React.Component {
    render() {
        const user = reactLocalStorage.getObject('user');
        return(
        <div>
            <Router history={browserHistory}>
                <Route path="/" component={Registration}/>
                <Route path="/login" component={Login} />
                <Route path="/profile" component={Profile} />
            </Router>
        </div>
)}
}
export default Routes
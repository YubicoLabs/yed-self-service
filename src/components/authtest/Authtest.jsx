import React from "react";
import { Auth, API } from 'aws-amplify';
import axios from 'axios';

class Authtest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: null
        }
    }

    componentDidMount() {
        const fetchAuth = async () => {
            Auth.currentAuthenticatedUser().then((auth) => {
                this.setState({
                    auth: auth
                })
                this.forceUpdate();
            })
        }
        fetchAuth();
    }

    authRequest() {
        console.log("In auth request");
        console.log(this.state);
        
        const token = this.state.auth.signInUserSession.accessToken.jwtToken;
        console.log(token);
        
        const API_URL = "https://dv22emh10a.execute-api.us-west-2.amazonaws.com/dev/authtest"
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
        axios.get(
            `${API_URL}`, 
            {
                headers: headers
            }
        ).then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error);
        });
        
    }

    render() {
        let button;
        if(this.state.auth != null)
            button = <button onClick={this.authRequest.bind(this)}>Send request</button>
        else
            <h2>loading</h2>
        return (
            <div>
                {button}
            </div>
        );
    }
}

export default Authtest;
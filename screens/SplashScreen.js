import React, { Component } from 'react';
import { AppLoading, SecureStore } from 'expo';
import Login from './Login';
import MyPhotos from './MyPhotos';

const ip = '192.168.0.40';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      isLoggedIn: false
    };
    this.result = false;
    this.userId = '';
    this.userName = '';
    this.token = '';
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._checkLoginStatus.bind(this)}
          onFinish={() => {
            this.setState({ 
              isReady: true,
              isLoggedIn: this.result
            });
          }}
          onError={console.warn}
        />
      );
    } else {
      return (this.state.isLoggedIn ? 
        <MyPhotos 
          userId={this.userId} 
          userName={this.userName} 
        /> 
        : <Login 
          token={this.token}
          userId={this.userId} 
          userName={this.userName} 
        />
      );
    }
  }

  async _checkLoginStatus() {
    try {
      const token = await SecureStore.getItemAsync('ACCESS_TOKEN');
      this.token = token;

      if (token) {
        const response = await fetch(`http://${ip}:3000/api/auth/check`, {
          method: 'get',
          headers: {'Authorization': `Bearer ${token}`}
        });
        const json = await response.json();
        const { _id, userName } = json;

        if (json.success) {
          this.result = true;
          this.userId = _id;
          this.userName = userName;
        } else {
          this.result = false;
        }
      } else {
        this.result = false;
      }
    } catch(err) {
      console.error(err);
    }
  }
}

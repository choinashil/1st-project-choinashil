import React, { Component } from 'react';
import { AppLoading, SecureStore } from 'expo';

const ip = '192.168.0.40';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = false;
  }

  _changeState() {
    const { navigation } = this.props;
    navigation.navigate(this.isLoggedIn ? 'MainScreen' : 'LoginScreen');
  }

  async _checkLoginStatus() {
    const { setUserInfo } = this.props.screenProps;

    try {
      const token = await SecureStore.getItemAsync('ACCESS_TOKEN');

      if (token) {
        const response = await fetch(`http://${ip}:3000/api/auth/check`, {
          method: 'get',
          headers: {'Authorization': `Bearer ${token}`}
        });
        const json = await response.json();
        const { success, userId, userName } = json;

        if (success) {
          setUserInfo(userId, userName);
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      } else {
        this.isLoggedIn = false;
      }
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
      <AppLoading
        startAsync={this._checkLoginStatus.bind(this)}
        onFinish={this._changeState.bind(this)}
        onError={console.warn}
      />
    );
  }
}

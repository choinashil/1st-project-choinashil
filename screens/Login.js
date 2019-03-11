import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Facebook, SecureStore } from 'expo';
import MyPhotos from './MyPhotos';

const facebookAppId = '585670038566373';
const ip = '192.168.0.40';
 
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      isLoggedIn: false
    };
    this.userId = '',
    this.userName = ''
  } 

  componentDidUpdate(prevProps, prevState) {
    if (prevState.token !== this.state.token) {
      this.setState({ isLoggedIn: true });
    }
  }

  async login() {
    try {
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync(facebookAppId, {
        permissions: ['public_profile']
      });

      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const userInfo = await response.json();
        const { id, name } = userInfo;

        fetch(`http://${ip}:3000/api/auth/login`, {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            facebookId: id,
            userName: name
          })
        })
        .then(res => res.json())
        .then(res => {
          const { access_token, userId, userName } = res;
          try {
            if (access_token) {
              SecureStore.setItemAsync('ACCESS_TOKEN', access_token);
              this.userId = userId;
              this.userName = userName;
              this.setState({ token: access_token });
            }
          } catch ({ message }) {
            throw `Expo Secure Error: ${message}`;
          }
        })
        .catch(err => console.error(err));
      } else {
        throw 'Facebook Login Failed';
      }
    } catch ({ message }) {
      console.error(`Facebook Login Error: ${message}`);
    }
  }

  get button() {
    return (
      <TouchableOpacity onPress={() => this.login()}>
        <View style={styles.button}>
          <Text style={{color: 'white'}}>Login to Facebook</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { isLoggedIn } = this.state;
    return (!isLoggedIn ?
        <View style={styles.container}>
          <Text style={styles.paragraph}>Welcome!</Text>
          {this.button}
        </View>
      : <MyPhotos userId={this.userId} userName={this.userName} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e'
  },
  button: {
    width: '50%',
    padding: 20,
    backgroundColor: '#3b5998',
    borderRadius: 6,
  }
});

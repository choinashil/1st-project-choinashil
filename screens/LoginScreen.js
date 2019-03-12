import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Facebook, SecureStore } from 'expo';
import { Entypo } from '@expo/vector-icons';

const facebookAppId = '585670038566373';
const ip = '192.168.0.40';
 
export default class Login extends Component {
  async _login() {
    const { navigation } = this.props;
    const { setUserInfo } = this.props.screenProps;

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

        const res = await fetch(`http://${ip}:3000/api/auth/login`, {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            facebookId: id,
            userName: name
          })
        });
        const json = await res.json();
        const { access_token, userId, userName } = json;

        try {
          if (access_token) {
            SecureStore.setItemAsync('ACCESS_TOKEN', access_token);
            setUserInfo(userId, userName);
            navigation.navigate('MainScreen');
          } 
        } catch ({ message }) {
          throw `Expo Secure Error: ${message}`;
        }
      } else {
        throw new Error('Facebook Login Failed');
      }
    } catch ({ message }) {
      console.error(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <TouchableOpacity style={styles.button} onPress={this._login.bind(this)}>
          <Entypo name="facebook" size={17} color="#fff" />
          <Text style={styles.buttonText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    margin: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e'
  },
  button: {
    justifyContent: 'center',
    flexDirection:'row',
    width: '55%',
    padding: 20,
    backgroundColor: '#3b5998',
    borderRadius: 5
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  }
});

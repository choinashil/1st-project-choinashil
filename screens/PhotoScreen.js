import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SecureStore, GestureHandler } from 'expo';
import { AntDesign } from '@expo/vector-icons';
import Map from '../components/Map';
const { TapGestureHandler, State } = GestureHandler;

export default class PhotoScreen extends Component {
  async _onPressLogoutOkBtn() {
    const { setUserInfo, navigation } = this.props;
    setUserInfo('', '');
    await SecureStore.deleteItemAsync('ACCESS_TOKEN'); 
    Alert.alert('Logout', '로그아웃 되었습니다');
    navigation.navigate('LoginScreen');
  }
  
  _onPressLogoutBtn() {
    Alert.alert('Logout', '로그아웃 하시겠습니까?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'OK', onPress: this._onPressLogoutOkBtn.bind(this)},
    ]);
  }

  _onSingleTap(index, event) {
    const { onSingleTap } = this.props;
    if (event.nativeEvent.state === State.ACTIVE) {
      onSingleTap(index);
    }
  };

  render() {
    const { userName, photoList } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text>LOGO</Text>
          </View>
          <TouchableOpacity style={styles.userTab} onPress={this._onPressLogoutBtn.bind(this)}>
            <Text style={styles.userName}>{userName.split(' ')[0]}</Text>
            <AntDesign name="logout" size={17} color="#34495e" />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {
            photoList.map((list, index) => {
              return (
                <TapGestureHandler
                  key={index}
                  onHandlerStateChange={this._onSingleTap.bind(this, index)}
                >
                  <View style={styles.photoWrapper}>
                    {
                      list.showPhoto ? 
                      <Image
                        style={styles.photo}
                        source={{uri: `${list.photoUrl}`}} 
                      /> 
                      : <Map position={{lat: list.lat, lon: list.lon}} />
                    }
                  </View>
                </TapGestureHandler>
              );
            }) 
          }
        </ScrollView> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  header: {
    flexDirection:'row', 
    justifyContent: 'space-between', 
    width: '100%',
    paddingTop: 30,
    paddingBottom: 15
  },
  logo: {
    marginLeft: 10
  },
  userTab: {
    flexDirection:'row',
    marginRight: 10
  },
  userName: {
    fontSize: 15,
    color: '#34495e',
    marginRight: 8
  },
  photoWrapper: {
    marginTop: 10,
    marginBottom: 20
  }, 
  photo: {
    width: 320,
    height: 320,
    borderRadius: 160,
    resizeMode: 'cover'
  }
});

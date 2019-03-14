import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Platform, ViewPagerAndroid, TouchableOpacity } from 'react-native';
import { SecureStore } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import PhotoScreen from './PhotoScreen';

const ip = '192.168.0.40';

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myPhotoList: [],
      receivedPhotoList: []
    };
  }

  componentDidMount() {
    this._getPhotos();
  }

  async _getPhotos() {
    try {
      const token = await SecureStore.getItemAsync('ACCESS_TOKEN');
      const { userId } = this.props.screenProps;

      const myPhotoResponse = await fetch(`http://${ip}:3000/api/users/${userId}/my-photos`, {
        method: 'get',
        headers: {'Authorization': `Bearer ${token}`}
      });
      const myPhotoJson = await myPhotoResponse.json();
      const myPhotoList = myPhotoJson.myPhotoList;

      const receivedPhotoResponse = await fetch(`http://${ip}:3000/api/users/${userId}/received-photos`, {
        method: 'get',
        headers: {'Authorization': `Bearer ${token}`}
      });
      const receivedJson = await receivedPhotoResponse.json();
      const receivedPhotoList = receivedJson.receivedPhotoList;

      this.setState({ myPhotoList, receivedPhotoList });
    } catch(err) {
      console.error(err);
    }
  }

  _onCameraBtnClick() {
    const { navigation } = this.props;
    navigation.navigate('CameraScreen');
  }

  _onMyPhotoSingleTap(index) {
    this.setState(prevState => {
      prevState.myPhotoList[index].showPhoto = !prevState.myPhotoList[index].showPhoto;
      return { myPhotoList: prevState.myPhotoList };
    });
  }

  _onReceivedPhotoSingleTap(index) {
    this.setState(prevState => {
      prevState.receivedPhotoList[index].showPhoto = !prevState.receivedPhotoList[index].showPhoto;
      return { receivedPhotoList: prevState.receivedPhotoList };
    });
  }

  render() {
    if (Platform.OS !== 'android') {
      return (
        <View style={styles.container}>
          <Text>Sorry, this is a demo of android-only native components</Text>
        </View>
      );
    }

    const { navigation } = this.props;
    const { userName, setUserInfo } = this.props.screenProps;
    const { myPhotoList, receivedPhotoList } = this.state;

    return (
      <Fragment>
        <ViewPagerAndroid style={styles.container}>
          <View>
            <PhotoScreen 
              userName={userName} 
              photoList={myPhotoList} 
              onSingleTap={this._onMyPhotoSingleTap.bind(this)} 
              navigation={navigation}
              setUserInfo={setUserInfo.bind(this)}
            />
          </View>
          <View>
            <PhotoScreen 
              userName={userName} 
              photoList={receivedPhotoList} 
              onSingleTap={this._onReceivedPhotoSingleTap.bind(this)} 
            />
          </View>
        </ViewPagerAndroid>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={this._onCameraBtnClick.bind(this)}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="#dd2745" />
        </TouchableOpacity>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20
  }
});

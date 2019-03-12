import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SecureStore, GestureHandler } from 'expo';
import Map from '../components/Map';
import { AntDesign } from '@expo/vector-icons';
const { TapGestureHandler, State } = GestureHandler;
const ip = '192.168.0.40';

export default class MyPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myPhotoList: []
    };
  }

  componentDidMount() {
    this._getMyPhotos();
  }

  async _getMyPhotos() {
    try {
      const token = await SecureStore.getItemAsync('ACCESS_TOKEN');
      const { userId } = this.props;
      const response = await fetch(`http://${ip}:3000/api/users/${userId}/my-photos`, {
        method: 'get',
        headers: {'Authorization': `Bearer ${token}`}
      });
      const json = await response.json();
      const myPhotoList = json.myPhotoList;
      this.setState({ myPhotoList });
    } catch(err) {
      console.error(err);
    }
  }

  _onPressLogoutBtn() {
    Alert.alert('Logout', '로그아웃 하시겠습니까?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  }

  _onSingleTap(index, event) {
    if (event.nativeEvent.state === State.ACTIVE) {
      this.setState(prevState => {
        prevState.myPhotoList[index].showPhoto = !prevState.myPhotoList[index].showPhoto;
        return { myPhotoList: prevState.myPhotoList };
      });
    }
  };

  render() {
    const { myPhotoList } = this.state; 
    const { userName } = this.props;
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
            myPhotoList.map((list, index) => {
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
        <TouchableOpacity style={styles.cameraBtnWrapper}>
          <View style={styles.cameraBtnOuterCircle}>
            <View style={styles.cameraBtnInnerCircle} />
          </View>
        </TouchableOpacity>
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
  },
  cameraBtnWrapper: {
    position: 'absolute', 
    bottom: 20
  },
  cameraBtnOuterCircle: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 60, 
    height: 60, 
    borderColor: '#dd2745', 
    borderWidth: 6, 
    borderRadius: 30
  },
  cameraBtnInnerCircle: {
    width: 36, 
    height: 36, 
    backgroundColor: '#dd2745', 
    borderRadius: 18
  }
});

import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SecureStore, GestureHandler } from 'expo';
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

  _onSingleTap = (index, event) => {
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
        <View style={{backgroundColor: 'transparent'}}>
          <Text style={styles.paragraph}>Welcome {userName.split(' ')[0]}!</Text>
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
                  <View style={styles.wrapper}>
                    <Image
                      style={styles.image}
                      source={{uri: `${list.photoUrl}`}} 
                    /> 
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paragraph: {
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
    backgroundColor: 'transparent'
  },
  wrapper: {
    borderBottomWidth: 30,
    borderColor: 'transparent'
  }, 
  mapWrapper: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden'
  }, 
  image: {
    width: 300,
    height: 300,
    borderRadius: 150,
    resizeMode: 'cover'
  }
});

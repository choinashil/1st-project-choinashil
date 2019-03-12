import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SecureStore } from 'expo';

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

  render() {
    const { myPhotoList } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Welcome {this.props.userName.split(' ')[0]}!</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {
            myPhotoList.map((list, index) => {
              return (
                <View key={index} style={styles.wrapper}>
                  <Image
                    style={styles.image}
                    source={{uri: `${list.photoUrl}`}} 
                  />
                </View>
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
    justifyContent: 'center',
  },
  paragraph: {
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e'
  },
  wrapper: {
    borderBottomWidth: 30,
    borderColor: '#fff'
  }, 
  image: {
    width: 300,
    height: 300,
    borderRadius: 150
  }
});

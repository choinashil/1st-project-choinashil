import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ViewPagerAndroid } from 'react-native';
import MyPhotos from './MyPhotos';
import ReceivedPhotos from './ReceivedPhotos';

export default class Example extends Component {
  render() {
    if (Platform.OS !== 'android') {
      return (
        <Text>Sorry, this is a demo of android-only native components</Text>
      );
    }

    const { userId, userName } = this.props.screenProps;

    return (
      <ViewPagerAndroid style={styles.container}>
        <View>
          <MyPhotos userId={userId} userName={userName} />
        </View>
        <View>
          <ReceivedPhotos userId={userId} />
        </View>
      </ViewPagerAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageText: {
    fontSize: 21,
    color: 'white',
  },
});

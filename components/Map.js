import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapView } from 'expo';
const { Marker } = MapView;

export default class Map extends Component {
  render() {
    const { lat, lon } = this.props.position;
    return (
      <View style={styles.mapWrapper} pointerEvents="none">
        <MapView
          style={styles.map}
          region={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.2,
          }}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lon }}
            pinColor={'linen'}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapWrapper: {
    width: 320,
    height: 320,
    borderRadius: 160,
    overflow: 'hidden'
  }, 
  map: {
    width: 320,
    height: 320,
    position: 'absolute'
  }
});

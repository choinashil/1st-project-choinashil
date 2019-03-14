import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Permissions, Camera, FileSystem, Constants, Location, SecureStore } from 'expo';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ip = '192.168.0.40';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      hasLocationPermission: null,
      photoUrl: null,
      type: 'back',
      ratio: '4:3',
      autoFocus: 'on',
    };
    this.lat = '',
    this.lon = ''
  }

  componentDidMount() {
    this._getPermissions();
    this._getLocation();
  }

  _cameraButton() {
    return (
      <TouchableOpacity
        style={styles.mainButton}
        onPress={this._takePicture.bind(this)}
      >
        <Ionicons name="ios-radio-button-on" size={70} color="#dd2745" />
      </TouchableOpacity>
    );
  }

  _cancelButton() {
    return (
      <View style={styles.cancelBar}>
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={this._onCancelBtnPress.bind(this)}
        >
          <AntDesign name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  async _getLocation() {
    const location = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;
    this.lat = latitude;
    this.lon = longitude;
  }

  async _getPermissions() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA, Permissions.LOCATION);
    this.setState({
      hasCameraPermission: status === 'granted',
      hasLocationPermission: status === 'granted'
    });
  }

  _navigateToMainScreen() {
    const { navigation } = this.props;
    navigation.navigate('MainScreen');
  }

  _onCancelBtnPress() {
    this.setState({photoUrl: null});
  }

  _renderCamera() {
    return (
      <View style={styles.container}>
        {this._topBar()}
        <View style={styles.frame}>
          <Camera
            style={styles.camera}
            ref={ref => { this.camera = ref; }}
            type={this.state.type}
            ratio={this.state.ratio}
            autoFocus={this.state.autoFocus}
          />
        </View>
        {this._cameraButton()}
      </View>
    );
  }

  _renderLoadingPage() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  _renderNoPermissions() {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="camera-off" size={40} color="#fff" />
        <Text style={styles.whiteText}>
          Camera permissions not granted
        </Text>
        <Text style={styles.whiteText}>
          - cannot open camera preview.
        </Text>
      </View>
    );
  }

  _renderPreview() {
    const { photoUrl } = this.state;
    return (
      <View style={styles.container}>
        {this._cancelButton()}
        <View style={styles.frame}>
          <Image source={{uri: photoUrl}} style={styles.camera} />
        </View>
        {this._saveButton()}
      </View>
    );
  }

  _saveButton() {
    return (
      <TouchableOpacity
        style={styles.mainButton}
        onPress={this._takePicture.bind(this)}
      >
        <Ionicons name="ios-checkmark-circle" size={70} color="#69ae51" />
      </TouchableOpacity>
    );
  }

  async _takePicture() {
    if (this.camera) {
      const photoInfo = await this.camera.takePictureAsync();
      this.setState({ photoUrl: photoInfo.uri });
    }
  }

  _toggleFacing() {
    this.setState({ type: this.state.type === 'back' ? 'front' : 'back' });
  }

  _topBar() {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={this._navigateToMainScreen.bind(this)}
        >
          <Ionicons name="ios-arrow-back" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={this._toggleFacing.bind(this)}
        >
          <Ionicons name="ios-reverse-camera" size={34} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, photoUrl } = this.state;

    if (hasCameraPermission === null) {
      return this._renderLoadingPage();
    } else if (hasCameraPermission === false) {
      return this._renderNoPermissions();
    } else if (!photoUrl) {
      return this._renderCamera();
    } else {
      return this._renderPreview();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#000'
  },
  frame: {
    width: 320, 
    height: 320, 
    borderRadius: 160, 
    overflow: 'hidden'
  }, 
  camera: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingTop: Constants.statusBarHeight / 2,
    position: 'absolute',
    top: 0
  },
  cancelBar: {
    justifyContent: 'flex-start',
    width: '90%',
    paddingTop: Constants.statusBarHeight / 2,
    position: 'absolute',
    top: 0
  },
  toggleButton: {
    marginTop: 20,
    marginBottom: 10,
    padding: 5
  },
  mainButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20
  },
  whiteText: {
    color: '#fff'
  }
});

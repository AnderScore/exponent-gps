import Expo from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class App extends React.Component {

  constructor(props) {
    super(props);
     this.state = {
      longitude: 0, 
      latitude: 0,
      accuracy: 0,
      altitude: 0
    }
  }

  async getLocationAsync() {
    const { Location, Permissions } = Expo;

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    
    if (status === 'granted') {
      var locObj = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      return locObj['coords']
    } else {
      throw new Error('Location permission not granted');
    }
  }

  async watchPositionAsync() {
    const { Location, Permissions } = Expo;
    const that = this;

    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      Location.watchPositionAsync({enableHighAccuracy: true}, (pos) => {
        let coords = pos.coords;
        that.setState({
          longitude: coords.longitude, 
          latitude: coords.latitude,
          accuracy: coords.accuracy,
          altitude: coords.altitude.toFixed(1)
        });
      });
    } else {
      throw new Error('Location permission not granted');
    }
  }
  
  componentDidMount(){
    const that = this;

    this.getLocationAsync().then(function(coords) {
      that.setState({
        longitude: coords.longitude, 
        latitude: coords.latitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude.toFixed(1)
      });
    });
    this.watchPositionAsync();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>Your current GPS position.</Text>
        <Text>longitude: {this.state.longitude}</Text>
        <Text>latitude: {this.state.latitude}</Text>
        <Text>accuracy: {this.state.accuracy} m</Text>
        <Text>altitude: {this.state.altitude} m</Text>
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
  headline: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

Expo.registerRootComponent(App);

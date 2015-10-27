/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MapboxGLMap = require('react-native-mapbox-gl');
var RNGeocoder = require('react-native-geocoder');

var Dimensions = require('Dimensions');
var SCREENW = Dimensions.get('window').width;
var SCREENH = Dimensions.get('window').height;

var mapRef = 'mapRef';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput
} = React;

var margin = 16;
var navHeight = 60;
var searchBoxInitialHeight = 60;

var MapTest = React.createClass({
  mixins: [MapboxGLMap.Mixin],
  getInitialState() {
    return {
      searchBox: new Animated.Value(0),
      searchBoxIsFocused: false,
      locationString: '', 
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 11
    };
  },
  componentDidMount() {
    
  },
  onRegionChange(location) {
    var _this = this;
    RNGeocoder.reverseGeocodeLocation({latitude: location.latitude, longitude: location.longitude}).then((data) => {
      if (data[0]) {
        let obj = data[0];
        _this.setState({locationString: obj.subAdministrativeArea + ", " + obj.administrativeArea});
      }
    });
  },
  onRegionWillChange(location) {
    console.log(location);
  },
  onUpdateUserLocation(location) {
    console.log(location);
  },
  toggleSearchBox() {
    if (this.state.searchBoxIsFocused) {
      this.setState({searchBoxIsFocused: false});
      Animated.timing(          // Uses easing functions
        this.state.searchBox,    // The value to drive
        {toValue: 0, duration: 250},           // Configuration
      ).start();
    } else {
      this.setState({searchBoxIsFocused: true});
      Animated.timing(          // Uses easing functions
        this.state.searchBox,    // The value to drive
        {toValue: 1, duration: 250},           // Configuration
      ).start();
    }
  },
  render: function() {
    var _this = this;
    StatusBarIOS.setHidden(true);
    console.log(_this.state.searchBox);
    return (
      <View style={styles.container}>
        <MapboxGLMap
          style={styles.map}
          direction={0}
          rotateEnabled={true}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          ref={mapRef}
          accessToken={'pk.eyJ1Ijoibmlja3N0YW1hcyIsImEiOiI5MjE5OTQzNzExMDJiOTAyZmYyOGFmZWUxN2NjNGJjYSJ9.kA1isiQO5pquVtmLZ81rMw'}
          styleURL={'asset://styles/streets-v8.json'}
          centerCoordinate={this.state.center}
          userLocationVisible={true}
          zoomLevel={this.state.zoom}
          onRegionChange={this.onRegionChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation} />
        
        <Image 
          style={{backgroundColor: 'transparent', width: 93, height: 93, position: 'absolute', top: (SCREENH/2)-(93/2), left: (SCREENW/2)-(93/2)}}
          source={require('image!locationCircle')}/>
        
        <Animated.View 
          style={{flex: 1, 
                  borderRadius: 5, 
                  shadowColor: 'black', 
                  shadowOpacity: 0.15, 
                  shadowRadius: 3, 
                  shadowOffset: {width: 0, height: 3}, 
                  backgroundColor: 'rgba(255,255,255,0.98)', 
                  position: 'absolute', 
                  top: _this.state.searchBox.interpolate({inputRange: [0,1], outputRange: [navHeight + margin, navHeight]}),
                  left: _this.state.searchBox.interpolate({inputRange: [0,1], outputRange: [margin, 0]}),
                  right: _this.state.searchBox.interpolate({inputRange: [0,1], outputRange: [margin, 0]}),
                  height: _this.state.searchBox.interpolate({inputRange: [0,1], outputRange: [searchBoxInitialHeight, SCREENH - navHeight]})
        }}>
          <TouchableOpacity onPress={_this.toggleSearchBox}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{position: 'absolute', top: 21, left: 16}}>
                <Image
                  style={{backgroundColor: 'transparent', width: 18, height: 18}}
                  source={require('image!search')}/>
              </View>
              <View style={{flex: 1, height: 60, flexDirection: 'column', justifyContent: 'flex-start'}}>
                {!_this.state.searchBoxIsFocused && 
                  <Animated.View style={{
                    flex: 1, 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    opacity: _this.state.searchBox.interpolate({inputRange: [0,1], outputRange: [1,0]})
                  }}>
                    <Text style={{color: 'black', textAlign: 'center', alignSelf: 'center', fontSize: 16}}>{_this.state.locationString}</Text>
                  </Animated.View>
                }
                {_this.state.searchBoxIsFocused && 
                  <Animated.View style={{
                    flex: 1, 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    opacity: _this.state.searchBox.interpolate({inputRange: [0,1], outputRange: [0,1]})
                  }}>
                    <TextInput 
                      style={{color: 'black', textAlign: 'center', alignSelf: 'center', fontSize: 16}}
                      value={_this.state.locationString}
                    />
                  </Animated.View>
                }
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={{flex: 1, backgroundColor: '#333', position: 'absolute', top: 0, left: 0, right: 0, height: 60, flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>Choose your location</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREENW,
    height: SCREENH
  },
  map: {
    flex: 1,
    width: SCREENW,
    height: SCREENH
  },
  text: {
    padding: 3
  }
});

AppRegistry.registerComponent('MapTest', () => MapTest);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image
} from 'react-native';

import {
    Text,
    Button,
    List,
    ListItem,
    Divider,
    Icon,
    Avatar,
} from 'react-native-elements';
import ships from '../../assets/ships';
import colorScheme from '../../config/colors';
import consts from '../../config/constants';
import { changeUser, logoutKeycloak, initiatePortCall, fetchVesselFromIMO  } from '../../actions';

class SideMenu extends Component {

  constructor(props) {
    super(props);

    this._logout = this._logout.bind(this);
  }
  async componentWillMount() {
    console.log("TJATJA");
    await this.props.fetchVesselFromIMO(this.props.favoriteVessels[0].split('IMO:')[1])
      .then(res => console.log(res));
    console.log(this.props);
  }


  _logout() {
      const { navigation, connection, changeUser, logoutKeycloak, fetchVesselFromIMO } = this.props;
      if(!!connection.username) {
        changeUser('', '', false);
        console.log('Logging out legacy user...');
        navigation.navigate('LoginView');
      } else {
        console.log('Logging out keycloak user...');
        logoutKeycloak().then(() => navigation.navigate('LoginView'));
      }
  }


  render() {

    const { navigate, state } = this.props.navigation;
    const { selectedPortCall, activeItemKey } = this.props;
    const vessel = this.props.extendedVessel;

    //console.log(this.props);
    //const vessel2 = fetchVesselFromIMO(this.props.favoriteVessels[0].split(":").slice(-1)[0]);
    //console.log(vessel2);
      const haveSelectedPortCall = !!selectedPortCall;
      const containerStyle = haveSelectedPortCall ? styles.menuContainer : [styles.menuContainer, styles.unavailableContainer];
    const textStyle = haveSelectedPortCall && activeItemKey !== 'Login' ? styles.menuText : [styles.menuText, styles.unavailableMenuText];
    const canBeAccessedEverywhereExceptOnLogin = activeItemKey === 'Login' ? [styles.menuText, styles.unavailableMenuText] : styles.menuText;
    return(
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                {!! vessel &&
                <Image
                    style={{
                        width: 3*Dimensions.get('window').width/4-20,
                        height: Dimensions.get('window').height/4,
                        borderRadius: 5,
                        }}

                source={{uri:vessel.photoURL }}
                />}
                {!!vessel &&
                    <Text style={styles.headerText}>{vessel.name}</Text>}
                {!vessel &&
                <Text style={styles.headerText}>Select a Portcall</Text>}
            </View>


            <Divider style={{backgroundColor: colorScheme.secondaryContainerColor, height: 0.7,}}/>

            <View style={styles.listContainer}>
                <List style={{paddingTop: 0, backgroundColor: colorScheme.sidebarColor}}>
                    {/* Menu */}
      <ListItem
      containerStyle={activeItemKey === 'TimeLine' ? [containerStyle, styles.selectedContainer] : containerStyle}
      leftIcon={{
        name:'timeline',
        color: 'white'}}
      hideChevron
      underlayColor={colorScheme.secondaryColor}
      title={
        <View style={styles.textContainer}>
        <Text style={textStyle}>Port Call Timeline</Text>
        </View>
      }
      onPress={() => {
        if (haveSelectedPortCall && activeItemKey !== 'TimeLine')
          navigate('TimeLine');
      }}
      />
      

      <ListItem
      containerStyle={activeItemKey === 'PortCalls' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{
                          name:'home',
                          color: 'white',
                          }}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={canBeAccessedEverywhereExceptOnLogin}>Select PortCall</Text>
                            </View>
                        }
                        onPress={() => {
                            if(activeItemKey !== 'Login') navigate('PortCalls')}
                        }
      />

      <ListItem
      containerStyle={activeItemKey === 'Berths' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
      leftIcon={{
        name: 'home',
        color: 'white'
      }}
      hideChevron
      underlayColor={colorScheme.secondaryColor}
      title={
        <View style={styles.textContainer}>
        <Text style={canBeAccessedEverywhereExceptOnLogin}>Select Berth</Text>
        </View>
      }
      onPress={() => {
        if(activeItemKey !== 'Login') navigate('Berths');
      }}
      />



      <ListItem
      containerStyle={activeItemKey === 'FavoriteOverview' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
      leftIcon={{
        name: 'home',
        color: 'white'
      }}
      hideChevron
      underlayColor={colorScheme.secondaryColor}
      title={
        <View style={styles.textContainer}>
        <Text style={canBeAccessedEverywhereExceptOnLogin}>Favorite Overview</Text>
        </View>
      }
      onPress={() => {
        if(activeItemKey !== 'Login') navigate('FavoriteOverview');
      }}
      />

      <ListItem
      containerStyle={activeItemKey === 'EtaView' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
      leftIcon={{
        name: 'home',
        color: 'white'
      }}
      hideChevron
      underlayColor={colorScheme.secondaryColor}
      title={
        <View style={styles.textContainer}>
        <Text style={canBeAccessedEverywhereExceptOnLogin}>ETA view</Text>
        </View>
      }
      onPress={() => {
        if(activeItemKey !== 'Login') navigate('EtaView');
      }}
      />


      <ListItem
      containerStyle={activeItemKey === 'VesselInfo' ? [containerStyle, styles.selectedContainer] : containerStyle}
                        leftIcon={{
                          name:'directions-boat',
                          color: 'white'}}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={textStyle}>Vessel Info</Text>
                            </View>
                        }
                        onPress={() => {
                            if (haveSelectedPortCall && activeItemKey !== 'VesselInfo')
                                navigate('VesselInfo');
                        }}
      />

      <ListItem
      containerStyle={activeItemKey === 'Settings' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}







      leftIcon={{
        name:'settings',
        color: 'white',
      }}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}pp
                        title={
                            <View style={styles.textContainer}>
                                <Text style={canBeAccessedEverywhereExceptOnLogin} >Settings</Text>
                            </View>
                        }
                        onPress={() => {
                            if(activeItemKey !== 'Settings' && activeItemKey != 'Login')
                                navigate('Settings');
                        }}
                    />

                    <ListItem
                        containerStyle={activeItemKey === 'About' ? [styles.menuContainer, styles.selectedContainer] : styles.menuContainer}
                        leftIcon={{name:'info',
                        color: 'white'
                        }}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={canBeAccessedEverywhereExceptOnLogin}>About</Text>
                            </View>
                        }
                        onPress={() => {
                            if (activeItemKey !== 'About' && activeItemKey != 'Login')
                                navigate('About');
                        }}
                    />

                    <ListItem
                        containerStyle={[styles.menuContainer]}
                        leftIcon={{
                          name:'exit-to-app',
                          color: 'white'
                          }}
                        hideChevron
                        underlayColor={colorScheme.secondaryColor}
                        title={
                            <View style={styles.textContainer}>
                                <Text style={[canBeAccessedEverywhereExceptOnLogin]} >Logout</Text>
                            </View>
                        }
                        onPress={() => {
                                if(activeItemKey !== 'Login') this._logout();
                            }
                        }
                    />
                </List>
            </View>

            <View style={{height: 25, backgroundColor: colorScheme.sidebarColor}} />
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  //  flex: 1,
    backgroundColor: colorScheme.sidebarColor,
    paddingTop: 25,
  },
  headerContainer: {
    backgroundColor: colorScheme.sidebarColor,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  headerText: {
    textAlign: 'center',
    color: colorScheme.primaryTextColor,
    paddingTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    backgroundColor: colorScheme.sidebarColor,
 //   paddingTop: 10,
    marginTop: 0,
  },
  menuContainer: {
    backgroundColor: colorScheme.sidebarColor,
    paddingLeft: 10,
  },
  menuText: {
    color: colorScheme.primaryTextColor,
  },
  unavailableMenuText: {
      color: colorScheme.tertiaryTextColor,
  },
  textContainer: {
    marginLeft: 10,
  },
  selectedContainer: {
    backgroundColor: colorScheme.primaryColor,
  },
  unavailableContainer: {
    backgroundColor: colorScheme.sidebarColor,
  },
  // Not being used at the moment...It is now hard coded.
  underlayColorStyle: {
      color: colorScheme.tertiaryTextColor
  },

})



function mapStateToProps(state) {
    return {
      selectedPortCall: state.portCalls.selectedPortCall,
      vessel: state.portCalls.vessel,
      connection: state.settings.connection,
      favoriteVessels: state.favorites.vessels,
      extendedVessel: state.vessel.vessel,
    }
}

export default connect(mapStateToProps, {
  initiatePortCall,
  changeUser,
  logoutKeycloak,
  fetchVesselFromIMO
})(SideMenu);

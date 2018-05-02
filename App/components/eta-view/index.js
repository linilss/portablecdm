import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    ListView,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native'

import { 
    List, 
    ListItem, 
    Icon,
    Text
} from 'react-native-elements';

import TopHeader from '../top-header-view';


import { 
    fetchPortCallEvents, 
    changeFetchReliability, 
    removeError, 
    toggleFavoritePortCall,
    toggleFavoriteVessel,
} from '../../actions';
import { getTimeDifferenceString } from '../../util/timeservices';
import colorScheme from '../../config/colors';

const timer = null;
const portCallId = null;

class EtaView extends Component {
    constructor(props) {
        super(props);
    }

  componentWillMount() {
        portCallId = this.props.portCallId;
    //timer = setInterval(() => this.loadOperations, 60000);


    //if (!!portCallId)
    //this.loadOperations();
    }

    componentWillUnmount() {
        clearInterval(timer);
    }
  goToStateList = () => {
    this.props.navigation.navigate('EtaPopup');
  }

    render() {
        return(
            <View style={{flex: 1, backgroundColor: colorScheme.primaryContainerColor}}>
            <TopHeader 
          title = 'ETA view' 
          firstPage
          navigation={this.props.navigation} 
          rightIconFunction={this.goToStateList}
            />
            <View 
          style={styles.headerContainer}
            >
            <Text style={styles.headerText}>HEJ</Text>
            </View>
            </View>
        );
    }

    
}


const styles = StyleSheet.create ({

    headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',

    },
    headerText: {
        textAlign: 'center',
        fontSize: 20,
        color: colorScheme.primaryTextColor,
    },
    headerTitleText: {
        textAlign: 'center',
        color: colorScheme.secondaryContainerColor,
        fontSize: 12,
   },
});



function mapStateToProps(state) {
  return {
    loading: state.portCalls.selectedPortCallIsLoading,
    operations: state.portCalls.selectedPortCallOperations,
    vesselName: state.portCalls.vessel.name,
    imo: state.portCalls.vessel.imo,
    portCallId: state.portCalls.selectedPortCall.portCallId,
    favoritePortCalls: state.favorites.portCalls,
    favoriteVessels: state.favorites.vessels,
    error: state.error,
    fetchReliability: state.settings.fetchReliability,
  };
}

export default connect(mapStateToProps, {
  changeFetchReliability, 
  fetchPortCallEvents, 
  removeError,
  toggleFavoritePortCall,
  toggleFavoriteVessel,
})(EtaView);







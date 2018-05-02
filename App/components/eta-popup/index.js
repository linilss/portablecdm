import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  List,
  ListItem,
  Icon,
  CheckBox
} from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import { removeFavoriteState, addFavoriteState, } from '../../actions'
import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

class EtaPopup extends Component {
  state = {
    time: "",
    date: "",
    isDatePickerVisible: false,
    isTimePickerVisible: false,
  };
  
  _showDatePicker = () => this.setState({ isDatePickerVisible: true });
  
  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });
  
  _handleDatePicked = (date) => {
    console.log(typeof(date));
    console.log(date.getFullYear() + ':' + (date.getMonth()+1) + ':' + date.getDate());
    this.setState({ date: (date.getFullYear() + ":" + (date.getMonth()+1) + ':' + date.getDate()) });
    this._hideDatePicker();
  };

  _showTimePicker = () => this.setState({ isTimePickerVisible: true });
  
  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });
  
  _handleTimePicked = (date) => {
    console.log('A Time has been picked: ', date.getHours() + " : " + date.getMinutes());
    this.setState({ time: (date.getHours() + ":" + date.getMinutes()) });
    this._hideTimePicker();
  };


  render() {
    return(
      <View style={styles.container}>
        <TopHeader title={'Create port call'}
        />
        <View style={styles.headerContainer} >
        <Text style={styles.headerSubText}>Select HEJ</Text>
        <TouchableOpacity onPress={this._showDatePicker}>
        <Text>Show DatePicker</Text>
        </TouchableOpacity>
        <Text>{ this.state.date }</Text>
        <TouchableOpacity onPress={this._showTimePicker}>
        <Text>Show TimePicker</Text>
        </TouchableOpacity>
        <Text>{ this.state.time }</Text>



        <DateTimePicker
      mode={'date'}
      isVisible={this.state.isDatePickerVisible}
      onConfirm={this._handleDatePicked}
      onCancel={this._hideDatePicker}
        />
        <DateTimePicker
      mode={'time'}
      is24Hour={true}
      isVisible={this.state.isTimePickerVisible}
      onConfirm={this._handleTimePicked}
      onCancel={this._hideTimePicker}
        />
        
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: colorScheme.primaryColor,
    alignItems: 'center',
    flexDirection: 'column',
    },
    headerSubText: {
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        fontSize: 18,
        fontWeight: 'bold',
     },
});

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {removeFavoriteState, addFavoriteState})(EtaPopup);

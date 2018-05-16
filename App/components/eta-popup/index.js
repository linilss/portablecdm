import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  Button
} from 'react-native-elements';
import styles from '../../config/styles';

//https://github.com/mmazzarolo/react-native-modal-datetime-picker
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
    this.props.navigation;
    return(
      <View style={styles.container}>

      <TopHeader title={'Leave ETA to traffic area'}
      navigation={this.props.navigation}      />
      <View style={styles.headerContainer} >
      </View>

      <Button
      title="Select arrival date"
      onPress={this._showDatePicker}
      buttonStyle={locStyles.buttonStyle}
      backgroundColor={colorScheme.primaryColor}
      color={colorScheme.primaryTextColor}
      />

      <Text style={styles.texts.headerText} h3>
      {this.state.date}
      </Text>

      <Button
      title="Select arrival time"
      onPress={this._showTimePicker}
      buttonStyle={locStyles.buttonStyle}
      backgroundColor={colorScheme.primaryColor}
      color={colorScheme.primaryTextColor}
        />

      <Text style={styles.texts.headerText} h3>
      {this.state.time}
      </Text>

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
      <View style={{ backgroundColor: colorScheme.primaryColor, marginTop: 10, paddingVertical: 5, }}>
      <Button
      title="Confirm"
      textStyle={{ color: colorScheme.primaryTextColor }}
      buttonStyle={{ backgroundColor: colorScheme.primaryColor }}
      onPress={() => alert('hello')}
      />
      </View>

      </View>
    );
  }
}
const locStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
  },
  scrollContainer: {
    backgroundColor: colorScheme.backgroundColor,
    //   paddingTop: 20,
  },
  formContainerStyle: {
    backgroundColor: colorScheme.primaryContainerColor,
    margin: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderColor: colorScheme.tertiaryTextColor,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonStyle: {
    //backgroundColor: colorScheme.primaryColor,
    marginBottom: 10,
    marginTop: 10,
    borderColor: colorScheme.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
  },
  titleStyle: {
    color: colorScheme.quaternaryTextColor,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  badgeText: {
    color: colorScheme.secondaryColor,
  },
  sliderStyle: {
    marginLeft: 20,
    marginRight: 20,
  }
});



function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {removeFavoriteState, addFavoriteState})(EtaPopup);

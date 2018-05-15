import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';

import {
  List,
  ListItem,
  Icon,
  Badge
} from 'react-native-elements';

import WarningView from './warning-view';

import Collapsible from 'react-native-collapsible';

import StatementView from './statementview';

import {getTimeDifferenceString, getDateTimeString, getTimeString, getDateString, getTimeDifferenceTwoString} from '../../../util/timeservices'
import { cleanURN } from '../../../util/stringUtils';
import colorScheme from '../../../config/colors';

function getWarningText(warning) {
    let result;
    if(warning.warningType) { // New version
        let noUnderscore = warning.warningType.replace(/_/g, ' ');
        result = noUnderscore.charAt(0).toUpperCase() + noUnderscore.slice(1).toLowerCase();
    } else {
        result = warning.message;
    }

    return result;
}

class OperationView extends Component {

  constructor(props) {
    super(props);

    const { operation } = this.props;
    const { reportedStates } = operation;
  
    this.state = {
      operation: operation,
      reportedStates: reportedStates,
        isCollapsed: false,
      dimensions: {
          operation: undefined,
          timeContainer: undefined,
      },
      selectedWarning: undefined,
    }

    this._toggleCollapsed = this._toggleCollapsed.bind(this);
    this.renderStateRow = this.renderStateRow.bind(this);
    this.addStatement = this.addStatement.bind(this);
  }

  _toggleCollapsed() {
    this.setState({isCollapsed: this.state.isCollapsed})
  }

  render() {
    const { operation, reportedStates, isCollapsed } = this.state;
    const { rowNumber, navigation, getStateDefinition } = this.props;

    // Decide what dot to display
    let dotStyle = [styles.innerDot, styles.innerFutureDot];
    if(operation.endTimeType === 'ACTUAL') dotStyle = [styles.innerDot, styles.innerCompleteDot];

    let startTimeDisplayStyle;
    if (operation.startTimeType === 'ACTUAL'){
      startTimeDisplayStyle = styles.timeDisplayActual;
    }
    else if (operation.startTimeType === 'ESTIMATED'){
      startTimeDisplayStyle = styles.timeDisplayEstimate;
    }
    // This is not working as it should... Can make 13.00 become orange
    else if (!operation.startTimeType) {
      startTimeDisplayStyle = styles.timeDisplayWarning;
    }
    else {
      startTimeDisplayStyle = styles.timeDisplay;
    }

    let endTimeDisplayStyle;
    if (operation.endTimeType === 'ACTUAL'){
      endTimeDisplayStyle = styles.timeDisplayActual;
    }
    else if (operation.endTimeType === 'ESTIMATED'){
      endTimeDisplayStyle = styles.timeDisplayEstimate;
    }
    else if (!operation.endTimeType) {
      endTimeDisplayStyle = styles.timeDisplayWarning;
    }
    else {
      endTimeDisplayStyle = styles.timeDisplay;
    }

    /* THIS IS A DEVIATION FROM BACKEND */
    let firstStatement = Object.keys(reportedStates)
    .map(stateDef => this.findMostRelevantStatement(reportedStates[stateDef]))
    .sort((a,b) => a.time < b.time ? -1 : 1)[0];

    let lastStatement = Object.keys(reportedStates)
    .map(stateDef => this.findMostRelevantStatement(reportedStates[stateDef]))
    .sort((a, b) => a.time > b.time ? -1 : 1)[0];


    let startTime = new Date(!!operation.startTime ? firstStatement.time : null);
    let endTime = new Date(!!operation.endTime ? lastStatement.time : null);


    let currentTime = new Date();
    let renderRedLine = startTime > 0 && currentTime >= startTime && currentTime <= endTime;
    let redlineStyle = this._calculateRedline(startTime, endTime);
    
     /* Fixa data för pluset */
    let selectedStates = Object.keys(reportedStates)
    .map((stateDef) => this.findMostRelevantStatement(reportedStates[stateDef]))
    .sort((a, b) => a.time > b.time ? -1 : 1)
    .slice(0,1)
        .filter((mostRelevantStatement) => {
            return (mostRelevantStatement.stateDefinition == 'Arrival_Vessel_TrafficArea')
        });
    /* Väldigt ful kod! Finns flera "ställen" så stämmer inte detta då den utgår från att det bara finns en Operation View */
    let selectedState = selectedStates[0];

    return (

      <View style={styles.container} onLayout={(event) => {
            if(renderRedLine) {
                this.setState({dimensions: {...this.state.dimensions, operation: event.nativeEvent.layout}});
            }
          }}>

        {/* Time Display */}
        <View style={styles.timeContainer}>
          {/*Start Time*/}
          <View style={styles.timeDisplayContainer} onLayout={(event) => {
            if(renderRedLine)
                this.setState({dimensions: {...this.state.dimensions, timeContainer: event.nativeEvent.layout}});
        }}>
          </View>
        </View>
        
        {/* Line and dots */}
        <View style={styles.timeline}>
          <View style={styles.line}>
            <View style={styles.bottomLine} />
          </View>
          <View style={styles.outerDot}>
            <View style={dotStyle} />
          </View>

        </View>

        {/*Everything to the right of the line*/}
        <View
          style={{flex: 1, flexDirection: 'column', marginTop: 0, paddingTop: 0, paddingLeft: 15}}>

          {/*Clickable header to expand information*/}
          <TouchableWithoutFeedback
            onPress={this._toggleCollapsed}>
            <View>
              <View style={{flexDirection: 'row'}}>
                {operation.atLocation && <Text style={styles.operationHeader}><Text style={{fontWeight: 'bold'}}></Text>{operation.atLocation.name}</Text>}
                {operation.warnings.length > 0 &&
                <Icon name='warning' color={colorScheme.warningColor}/>
                }
                
                { <Icon
                  color = {colorScheme.primaryColor}
                  name='add-circle'
                  size={35}
                  onPress={() => this.addStatement(selectedState.stateDefinition, selectedState)}
                  />
              }
              </View>
            </View>
          </TouchableWithoutFeedback>

          {/*The information, displayed in a list*/}
          <Collapsible
            collapsed = {isCollapsed}
          >
            {/* Render warnings */}
            {operation.warnings.map((warning, index) => {
              return (
                <TouchableWithoutFeedback
                onPress={() => this.setState({selectedWarning: warning})}
                key={index}
                >
                    <View
                        style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10,}}
                        >
                        <Icon name='warning' color={colorScheme.warningColor} size={14} paddingRight={10} />
                        <Text style={{fontSize: 8, paddingLeft: 0, maxWidth: Dimensions.get('window').width/1.4 }}>{getWarningText(warning)}</Text>
                    </View>
                </TouchableWithoutFeedback>
              );
            })}

            <List style={{borderTopWidth: 0}}>
              {
                Object.keys(reportedStates)
                  .map((stateDef) => this.findMostRelevantStatement(reportedStates[stateDef]))
                  .sort((a, b) => a.time > b.time ? -1 : 1)
                  .slice(0,1)
                      .filter((mostRelevantStatement) => {
                          return (mostRelevantStatement.stateDefinition == 'Arrival_Vessel_TrafficArea')
                      })
                      .map((mostRelevantStatement) => this.renderStateRow(operation,
                                                                          mostRelevantStatement,
                                                                          reportedStates[mostRelevantStatement.stateDefinition],
                                                                          this.props.navigation.navigate,
                                                                          getStateDefinition(mostRelevantStatement.stateDefinition)
                                                                         ))

              }
            </List>
          </Collapsible>
        </View>
        <WarningView
            operation={operation}
            warning={this.state.selectedWarning}
            onClose={() => this.setState({selectedWarning: undefined})}
            addStatement={(stateId, mostRelevantStatement) => this.addStatement(stateId, mostRelevantStatement)}
        />
      </View>
    );
  }

  _calculateRedline(startTime, endTime) {
        if(!this.state.dimensions.operation || !this.state.dimensions.timeContainer) return null;

        //console.log(JSON.stringify(this.state.dimensions));
        let { operation, timeContainer } = this.state.dimensions;
        let currentTime = new Date();
        let top = 100;
        if(this.state.isCollapsed) {
            top = operation.height / 2;
        } else {
            let passedTime = currentTime - startTime;
            let totalTime = endTime - startTime;
            let allowedOpHeight = operation.height - timeContainer.height * 2;
            top = (passedTime/totalTime) * allowedOpHeight + timeContainer.height;
            // TODO: Adjustments according to user input
        }
        return {
            position: 'absolute',
            top: top,
            left: 0,
            width: 85,
            borderBottomColor: 'red',
            borderBottomWidth: 3,
        }
  }

  renderStateRow(operation, mostRelevantStatement, allOfTheseStatements, navigate, stateDef) {
    const { warnings } = allOfTheseStatements;
    const stateToDisplay = mostRelevantStatement;
      const { displayOnTimeProbabilityTreshold } = this.props;

   // const stateCount = allOfTheseStatements.length;
    let stateCount = 0;
    if (stateToDisplay.timeType === 'ACTUAL') {
      stateCount = allOfTheseStatements.filter((statement)=> statement.timeType === 'ACTUAL').length;
    }
    else if (stateToDisplay.timeType === 'ESTIMATED') {
      stateCount = allOfTheseStatements.filter((statement)=> statement.timeType === 'ESTIMATED').length;
    }
    else {
      stateCount = allOfTheseStatements.length;
    }


    return (
      <View>
        {allOfTheseStatements.map( stateToDisplay => {
            return <ListItem
                    containerStyle = {{
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                    }}
                    key={stateToDisplay.messageId}
                    title = {
                          <View>
                              <View style={{flexDirection: 'row'}}>            
                                {!!warnings && <Icon name='warning' color={colorScheme.warningColor} size={16} />}
                              </View>
                              <View style= {{flexDirection: 'row'}} >
                                  <Text style = {{color: colorScheme.tertiaryColor, fontWeight: 'bold'}} >{getTimeDifferenceTwoString(new Date(stateToDisplay.reportedAt), new Date(stateToDisplay.time))} </Text>
                                  <Text style = {{fontWeight: 'bold'}} > left </Text>
                              </View>
                          </View>
                    }
            
                    subtitle = {
                        <View style={{flexDirection: 'column'}} >
                            {stateToDisplay.fromLocation && <Text style={{fontSize: 9}}>
                              <Text style = {styles.stateDisplaySubTitle} >FROM: </Text>{stateToDisplay.fromLocation.name}</Text>}
                            {stateToDisplay.toLocation && <Text style={{fontSize: 9}}>
                              <Text style = {styles.stateDisplaySubTitle}>TO: </Text>{stateToDisplay.toLocation.name}</Text>}
                            
                            <Text style={{fontSize: 9}}>
                              <Text style= {styles.stateDisplaySubTitle}>ETA: </Text>{getDateTimeString(new Date(stateToDisplay.time))}
                            </Text>
                            <Text style={{fontSize: 9}}>
                              <Text style= {styles.stateDisplaySubTitle}>REPORTED AT: </Text>{getDateTimeString(new Date(stateToDisplay.reportedAt))}
                              <Text style= {{color: colorScheme.tertiaryColor}} > {getTimeDifferenceString(new Date(stateToDisplay.reportedAt))} ago</Text>
                            </Text>
                            <Text style={{fontSize: 9}}>
                              <Text style= {styles.stateDisplaySubTitle}>REPORTED BY: </Text>{cleanURN(stateToDisplay.reportedBy)}
                            </Text>
                            
                            {(stateToDisplay.reliability >= 0) && <Text style={{fontSize: 9}}>
                              <Text style = {styles.stateDisplaySubTitle}>RELIABILITY: </Text>{stateToDisplay.reliability}%</Text> }
          
                        </View>
                    }
                  />
                } )} 
      </View>
    );
  }

  renderStatus(status) {
      const formattedStatus = status.charAt(0) + status.substring(1).toLowerCase();
      return (
          <Text style={{color: (status === 'OK' ? 'green' : 'red')}}>{formattedStatus}</Text>
      )
  }

  addStatement(stateDef, mostRelevantStatement) {
    const { operation } = this.state;
    this.props.navigation.navigate('SendPortCall', {
        stateId: stateDef,
        fromLocation: operation.fromLocation,
        toLocation: operation.toLocation,
        atLocation: operation.atLocation,
        mostRelevantStatement: mostRelevantStatement
    });
  }

  /**
   * Finds the most relevant statement, i.e the latest Estimate or the latest Actual.
   * Actuals always overwrites estimates
   *
   * @param {[Statement]} statements
   *   an array of statements, all with the same statedefinition
   */
  findMostRelevantStatement(statements) {
      // sort statements based on reportedAt, latest reported first
      // TODO(johan) Kolla upp om listan av statements redan är sorterad efter reportedAt
      statements.sort((a, b) => {
          let aTime = new Date(a.reportedAt);
          let bTime = new Date(b.reportedAt);

          if(aTime > bTime) return -1;
          if(aTime < bTime) return 1;
          else return 0;
      });

      // find the first actual
      for(let i = 0; i < statements.length; i++) {
          if(statements[i].timeType === 'ACTUAL') {
              return statements[i];
          }
      }

      let statementsCopy = [...statements]
      // if no actuals exist, sort again, this time for reliability
      statementsCopy.sort((a, b) => a.reliability - b.reliability);
      for(let j = 0; j < statementsCopy.length; j++) {
        if(statements[j].timeType !== 'ACTUALL') {
          return statements[j];
        }
      }
  }
}

function mapStateToProps(state) {
  return {
    getStateDefinition: state.states.stateById,
    displayOnTimeProbabilityTreshold: state.settings.displayOnTimeProbabilityTreshold
  }
}

export default connect(mapStateToProps)(OperationView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryContainerColor,
    paddingTop: 5,
  },
  timeContainer: {
    width: 70,
    paddingRight: 5,
    justifyContent: 'space-between',
  },
  timeDisplayContainer: {
    // backgroundColor: colorScheme.secondaryContainerColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colorScheme.quaternaryTextColor, // Snyggare med EmeraldBlue(queaternaryColor)
  },
  operationInfo: {
    fontSize: 10,
    color: colorScheme.quaternaryTextColor
  },
  stateDisplayTitle: {
    fontWeight: 'bold',
    color: colorScheme.quaternaryTextColor,
  },
  stateDisplaySubTitle: {
    fontWeight: 'bold',
    color: colorScheme.quaternaryTextColor,
    fontSize: 9,
  },
  timeline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 60,
    width: 16,
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 6,
    width: 4,
    bottom: 0,
  },
  topLine: {
    flex: 1,
    width: 4,
    backgroundColor: colorScheme.primaryColor,
  },
  bottomLine: {
    flex: 1,
    width: 4,
    backgroundColor: colorScheme.primaryColor,
  },
  hiddenLine: {
    width: 0,
  },
  outerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colorScheme.primaryColor,
    marginTop: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
  },
  innerCompleteDot: {
    backgroundColor: colorScheme.primaryColor,
  },
  innerActiveDot: {
    backgroundColor: colorScheme.secondaryColor,
  },
  innerFutureDot: {
    backgroundColor: colorScheme.primaryContainerColor,
  },
  dateDisplay: {
    fontSize: Platform.OS === 'ios' ? 8 : 9,
    color: colorScheme.quaternaryTextColor
  },
  timeDisplay: {
    color: colorScheme.tertiaryColor,
  //  fontSize: 12,
  },
  timeDisplayActual: {
    color: colorScheme.actualColor,
  //  fontSize: 12,
  },
  timeDisplayEstimate: {
    color: colorScheme.estimateColor,
  //  fontSize: 12,
  },
  timeDisplayWarning: {
    color: colorScheme.warningColor,
    fontSize: 9,
  },
  actualText: {
    color: colorScheme.primaryTextColor,
    textAlign: 'center',
    fontWeight: 'bold',
  },
    actualContainer: {
    backgroundColor: colorScheme.actualColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  estimateText: {
    color: colorScheme.primaryTextColor,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  estimateContainer: {
    backgroundColor: colorScheme.estimateColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  targetContainer: {
    backgroundColor: colorScheme.targetColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  recommendedContainer: {
    backgroundColor: colorScheme.recommendedColor,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
});




{/*<Icon
  name='font-download'
  color={colorScheme.tertiaryColor
  } />*/}

  // <Icon
  //     name='access-time'
  //     color={colorScheme.tertiaryColor
  //   } />

import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Switch, Button,Modal } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import { Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
// import * as Notifications from 'expo-notifications';
import {  Notifications } from 'expo';
import * as Calendar from 'expo-calendar';


class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            showModal:false,
            show:false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    // obtainCalendarPermission = async () => {

    //     let calenderPermission = await Permissions.getAsync(Permissions.CALENDAR);

    //     if (calenderPermission.status !== 'granted') {
    //         calenderPermission = await Permissions.askAsync(Permissions.CALENDAR);
    //         if (calenderPermission.status !== 'granted') {
    //             Alert.alert('Permission not granted to show Calender');

    //         }

    //     }

    // }
    // async getDefaultCalendarId() {
	// 	const calendars = await Calendar.getCalendarsAsync();
	// 	const defaultCalendars = calendars.filter(each => each.allowsModifications === true);
	// 	return defaultCalendars[0].id;
    // }
    
    // async addReservationToCalendar(date){
         
    //     const defaultCalendarId = await this.getDefaultCalendarId();
    //     console.log("Date: ", date, "defaultCalendarId: ", defaultCalendarId, "endDate: ", Date(Date.parse(date) + (2*60*60*1000) ));

    //       await Calendar.createCalendarAsync(defaultCalendarId,{
    //           title:'Con Fusion Table Reservation',
    //           timeZone: 'Asia/Hong_Kong',
    //           location:'121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
    //           startDate :new Date(Date.parse(date)),
    //           endDate:new Date(Date.parse(date)+2*60*60*1000)

    //       })
          

    // }
    obtainCalendarPermission = async () => {
        const calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
        if (calendarPermission.status !== 'granted') {
            calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
            if (calendarPermission.status !== 'granted') {
                Alert.alert('Permission not granted for calendar');
            }
        }
        return calendarPermission;
    } 
    getDefaultCalendarSource = async () => {
        const calendars = await Calendar.getCalendarsAsync()
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default')
        return defaultCalendars[0].source
    }
    addReservationToCalendar = async (date) => {
        await this.obtainCalendarPermission();
        const defaultCalendarSource = Platform.OS === 'ios' ?
        await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
        let dateMs = Date.parse(date);
        let startDate = new Date(dateMs);
        let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);

        const calendarID = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        })

        await Calendar.createEventAsync(calendarID, {
            title: 'Con Fusion Table Reservation',
            startDate: startDate,
            endDate: endDate,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        });
    }
    async presentLocalNotification(date) {
        let a=await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        })
    }


    //
    


    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            showModal: false,
            show:false
        });
    }
    

    handleReservation() {
        // console.log(JSON.stringify(this.state));
        this.addReservationToCalendar(this.state.date)
        // this.toggleModal();
    }
    
    render() {
        return(
            <ScrollView>
                  <Animatable.View animation="zoomIn" duration={2000} delay={1000}>

                            <View style={styles.formRow}>
                                        <Text style={styles.formLabel}>Number of Guests</Text>
                                        <Picker
                                            style={styles.formItem}
                                            selectedValue={this.state.guests}
                                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                                            <Picker.Item label="1" value="1" />
                                            <Picker.Item label="2" value="2" />
                                            <Picker.Item label="3" value="3" />
                                            <Picker.Item label="4" value="4" />
                                            <Picker.Item label="5" value="5" />
                                            <Picker.Item label="6" value="6" />
                                        </Picker>
                            </View>

                            <View style={styles.formRow}>
                                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                                        <Switch
                                            style={styles.formItem}
                                            value={this.state.smoking}
                                            onTintColor='#512DA8'
                                            onValueChange={(value) => this.setState({smoking: value})}>
                                        </Switch>
                            </View>
                            <View style={styles.formRow}>
                                        <Text style={styles.formLabel}>Date and Time</Text>
                                        

                                        
                                        <Icon
                                        name='calendar-o'
                                        type='font-awesome'            
                                        size={24}
                                        onPress={()=>{this.setState({show:true})}}
                                        />
                                        {this.state.show && <DateTimePicker
                                            testID="dateTimePicker"
                                            style={{flex: 2, marginRight: 20}}
                                            value={this.state.date}
                                            mode="datetime"
                                            is24Hour={true}
                                            onChange={(event, selectedDate) => {this.setState({show:false});this.setState({date: selectedDate?selectedDate:new Date()})}}
                                        />}
                                        <Text
                                        style={styles.textin}
                                        >{this.state.date?this.state.date.toString():""}</Text>
                            </View>
                            <View style={styles.formRow}>
                                <View style={{flex:1}}>

                                        <Button
                                            onPress={() => Alert.alert(

                                                'Your Reservation OK',
                                                'Number of Guests: '+this.state.guests + '\n'+'Smoking? '+ this.state.smoking+'\n'+'Date and Time: '+ this.state.date,
                                                [

                                                    {
                                                        text:"Cancel", onPress: () => {this.resetForm()}, style: 'cancel'

                                                    },
                                                    {
                                                        text:"OK",onPress:()=>{this.presentLocalNotification(this.state.date);this.handleReservation();this.resetForm()}
                                                    }
                                                ],
                                                {cancelable:false}
                                            )}
                                            title="Reserve"
                                            color="#512DA8"
                                            accessibilityLabel="Learn more about this purple button"
                                            />
                                </View>
                            </View>
                  </Animatable.View>

                <Modal
                    animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }
                >


                    <View style = {styles.modal}>
                        <Text style = {styles.modalTitle}>Your Reservation</Text>
                        <Text style = {styles.modalText}>Number of Guests: {this.state.guests}</Text>
                        <Text style = {styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
                        <Text style = {styles.modalText}>Date and Time: {this.state.date.toString()}</Text>
                        
                        <Button 
                            onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            color="#512DA8"
                            title="Close" 
                            />
                    </View>
                </Modal>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20,
      
    },
    formLabel: {
        fontSize: 18,
        flex: 1,
        
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     },
     textin:{
      flex:3,
      borderWidth:0.5,
      borderColor:"black",
      marginLeft:5

     }
});

export default Reservation;
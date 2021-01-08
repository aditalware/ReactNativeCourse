import React ,{Component} from 'react';
import {View,Text } from 'react-native';
import {Card,Icon,Button} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as  MailComposer from 'expo-mail-composer';

class Contact extends Component {
    static navigationOptions = {
        title: 'Contact us'
    };
    sendMail() {
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        })
    }
    render() {
        return (
            <View>
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>

                    <Card style={{backgroundColor:"white"}}>
                        <Card.Title>Contact Information</Card.Title>

                        <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginBottom:15,
                            opacity:0.3
                        }}
                        />


                        <Text>
                        121, Clear Water Bay Road                
                        </Text>

                        <Text>
                        Clear Water Bay, Kowloon
                        </Text>
                        
                        <Text>
                        HONG KONG

                        </Text>
                        <Text>
                        Tel: +852 1234 5678
                        </Text>
                    
                    <Text>
                    Fax: +852 8765 4321

                    </Text>
                    <Text>
                    Email:confusion@food.net
                    </Text>
                            <Button
                            title="Send Email"
                            icon={<Icon name="envelope-o" type="font-awesome" color="white"/>}
                            onPress={()=>this.sendMail()}
                            buttonStyle={{backgroundColor:"#512DA8"}}
                            />
                    </Card>
                </Animatable.View>
            </View>
        )
    }
}

export default Contact;

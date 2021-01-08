import React ,{Component} from 'react';
import {View,Text ,FlatList,ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import { ListItem,Avatar } from 'react-native-elements';
import { Loading } from './LoadingComponent';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
      leaders: state.leaders
    }
  }

function History(props){
    return(<Card style={{backgroundColor:"white"}}>
    <Card.Title>Our History</Card.Title>

    <View
    style={{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginBottom:15,
        opacity:0.3
    }}
    />


    <Text>
    Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.

     </Text>

    <Text style={{marginTop:10}}>
    The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.          
    </Text>
    
    
</Card>);
}
class About extends Component {

    constructor(props){
        super(props);
        this.state={
        }
    }
    static navigationOptions = {
        title: 'About us'
    };

    render() {

        const renderItem = ({item, index}) => {
    
            return (
                    
                
                    <View>
                       
                         <ListItem key={index} bottomDivider >
                         <Avatar rounded source={{uri:baseUrl+item.image}}/>  
                         {/* source={{uri:"./images/uthappizza.png"} */}
    
                                <ListItem.Content>
                                <ListItem.Title>{item.name}</ListItem.Title>
                                <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                                </ListItem.Content>
                       </ListItem>
                    </View>
            );
        };

        if (this.props.leaders.isLoading) {
            return(
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>


                            <History />
                            <Card
                                >
                            <Card.Title>Corporate Leadership</Card.Title>
                                <Loading />
                            </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
        else if (this.props.leaders.errMess) {
            return(
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>

                        <History />
                        <Card
                            >
                                <Card.Title>Corporate Leadership</Card.Title>
                            <Text>{this.props.leaders.errMess}</Text>
                        </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
        else {

        return (
            <ScrollView>
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>

                    <History/>

                    <Card>
                    <Card.Title>Corporate Leadership</Card.Title>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginBottom:15,
                            opacity:0.3
                        }}
                        />
                    <FlatList 
                        data={this.props.leaders.leaders}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        />
                    </Card>
                </Animatable.View>
            </ScrollView>
        )}
    }
}

export default connect(mapStateToProps)(About);
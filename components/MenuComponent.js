import React,{Component} from 'react';
import { View, FlatList ,Text, ScrollView} from 'react-native';
import { ListItem,Avatar,Tile } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
      dishes: state.dishes
    }
  }

class Menu extends Component {

    constructor(props){
        super(props);
        this.state={
        }
    }
    static navigationOptions = {
        title: 'Menu'
    };


    render(){
        const { navigate } = this.props.navigation;
        const renderMenuItem = ({item, index}) => {
    
            return (
                    
                    <View>
                                        <Animatable.View animation="fadeInRightBig" duration={2000}> 
                                        
                                                            <Tile
                                                            key={index}
                                                            title={item.name}
                                                            caption={item.description}
                                                            featured
                                                            onPress={() => navigate('Dishdetail', { dishId: item.id })}
                                                            imageSrc={{ uri: baseUrl + item.image}}
                                                            />
                                        </Animatable.View>               

                         
                    </View>
            );
        };
    
        if (this.props.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return(
                <View>            
                    <Text>{props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
            return (

                <ScrollView>

                <FlatList 
                    data={this.props.dishes.dishes}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                    />
                </ScrollView>
            );
        }
    }
}


export default connect(mapStateToProps)(Menu);
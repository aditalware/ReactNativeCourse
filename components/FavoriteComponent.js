import React, { Component } from 'react';
import { FlatList, View, Text ,Alert} from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from 'react-native-swipeout';
import { removeFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      favorites: state.favorites
    }
  }

  const mapDispatchToProps = dispatch => ({
    removeFavorite: (dishId) => dispatch(removeFavorite(dishId))
})

class Favorites extends Component {

    static navigationOptions = {
        title: 'My Favorites'
    };

    render() {

        const { navigate } = this.props.navigation;
        
        const renderMenuItem = ({item, index}) => {
            
            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress:  () => {
                        Alert.alert(
                            'Delete Favorite?',
                            'Are you sure you wish to delete the favorite dish ' + item.name + '?',
                            [
                                { 
                                    text: 'Cancel',
                                    onPress: () => console.log(item.name + 'Not Deleted'),
                                    style: ' cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => this.props.removeFavorite(item.id)
                                }
                            ],
                            { cancelable: false }
                        );
                        
                    },
                    
                    backgroundColor:"green"
                }
            ];
    
            return (

                <Swipeout right={rightButton} autoClose={true}>
                                    <Animatable.View animation="fadeInRightBig" duration={2000}>  
                                                <ListItem
                                                    key={index}
                                                    title={item.name}
                                                    subtitle={item.description}
                                                    hideChevron={true}
                                                    onPress={() => navigate('Dishdetail', { dishId: item.id })}
                                                    leftAvatar={{ source: {uri: baseUrl + item.image}}}
                                                    >

                                                        <Avatar source= {{uri: baseUrl + item.image}}/>
                                                            <ListItem.Content>
                                                                    <ListItem.Title>{item.name}</ListItem.Title>
                                                                    <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                                                            </ListItem.Content>
                                                    </ListItem>
                                    </Animatable.View>              


                </Swipeout>
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
                    <Text>{this.props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
            return (
                <FlatList 
                    data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(el => el === dish.id))}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                    />
            );
        }
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Favorites);
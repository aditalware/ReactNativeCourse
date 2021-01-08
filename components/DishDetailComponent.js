import React,{Component} from 'react';
import { Text, View,ScrollView, FlatList,Modal, TextInput ,Button,StyleSheet,Alert,PanResponder,Share} from 'react-native';
import { Card ,Icon,Rating} from 'react-native-elements';

import { postFavorite,depostFavorite ,postComment} from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites

    }
  }


  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    depostFavorite: (dishId) => dispatch(depostFavorite(dishId)),
    postComment:(comment)=> dispatch(postComment(comment))

})


function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <View style={{marginRight:"auto"}}>
                 <Rating imageSize={15} readonly startingValue={item.rating} />
                </View>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>

        <Card >
            <Card.Title>Comments</Card.Title>
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>

    );
}
function RenderDish(props) {

    const dish = props.dish;



    const favorite= props.favorite?'remove':'add';

    handleViewRef = ref => this.view = ref;


    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return 1;
        else if ( dx > 200 )
            return 2;
        else
            return false;
    }
    

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

    const panResponder= PanResponder.create({

        onStartShouldSetPanResponder:(event,gestureState)=>{
           return true;
        },
      
            onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },

    
        onPanResponderEnd:(event,gestureState)=>{

            if(recognizeDrag(gestureState)==1){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to '+favorite+' '+ dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.onPress()}},
                    ],
                    { cancelable: false }
                );
            
            }

            else if(recognizeDrag(gestureState)==2){
                props.toggleCommentModal()
            }
            return true;
        }
    });
        if (dish != null) {
            return(<>

            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} ref={this.handleViewRef} {...panResponder.panHandlers}>

                <Card
                >

                 <Card.Image source={{uri: baseUrl + dish.image}}>

                 <Card.Title
                 style={{padding:40,color:"white"}}
                 >{dish.name}
                 </Card.Title>

                 </Card.Image>

                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>

                    <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                <Icon
                                raised
                                reverse
                                name={ props.favorite ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#f50'
                                onPress={() => props.onPress()}

                                />
                                  <Icon
                                raised
                                reverse
                                name="pencil"
                                type='font-awesome'
                                color='#512DA8'
                                onPress={() => {props.toggleCommentModal()}}
                                
                                />
                                <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                    </View>
                </Card>
                        </Animatable.View>

                </>
            );
        }
        else {
            return(<View></View>);
        }
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
          
                 showCommentModal:false,
                 rating:1,
                 author:"",
                 comment:""
        };
        this.toggleCommentModal=this.toggleCommentModal.bind(this);
    }    

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    demarkFavorite(dishId) {
        this.props.depostFavorite(dishId);
    }

    toggleCommentModal(){
        this.setState({showCommentModal:!this.state.showCommentModal})
    }


    onSubmitDetail(dishId){

        this.props.postComment(
            {
            id:this.props.comments.comments.length+1,
            dishId:dishId,
            rating:this.state.rating,
            comment:this.state.comment,
            author:this.state.author,
            date:new Date().toString()
        }
        );

        this.setState(
            {rating:1,
            author:"",
           comment:""});
    }


    render(){

        const dishId = this.props.navigation.getParam('dishId','');
        var fav=this.props.favorites.some(el => el === dishId);
        return(
            <ScrollView>
            <RenderDish 
            dish={this.props.dishes.dishes[+dishId]}
            favorite={fav}
            onPress={() => fav?this.demarkFavorite(dishId):this.markFavorite(dishId)}
            toggleCommentModal={this.toggleCommentModal}
            
                />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

            <Modal
                    animationType = {"slide"} transparent = {false}
                    visible = {this.state.showCommentModal}
                    onDismiss = {() => this.toggleCommentModal() }
                    onRequestClose = {() => this.toggleCommentModal() }>


                    <View>
                         <Rating showRating fractions={0.5} startingValue={1} onFinishRating={(count)=>{this.setState({rating:count})}}/>
                    </View>
                    <View style={{marginTop:20}}>


                                     <View style={styles.textin}>
                                        <Icon 
                                        name='user-o'
                                        type='font-awesome'            
                                        size={24}
                                        />
                                        <TextInput style={{marginLeft:10}} onChangeText={(e)=>this.setState({author:e})} value={this.state.author} placeholder="Author"/>
                                     </View>

                                     <View style={styles.textin}>
                                       <Icon 
                                        name='comment-o'
                                        type='font-awesome'            
                                        size={24}
                                        />
                                        <TextInput style={{marginLeft:10}} onChangeText={(e)=>this.setState({comment:e})} value={this.state.comment} placeholder="Comment"/>
                                     </View>


                          <View style={styles.container}>

                                    <View style={styles.buttons}>

                                        <Button title="Submit" color="#512DA8"
                                        onPress={() =>{this.onSubmitDetail(dishId);this.toggleCommentModal();}}

                                        />

                                    </View>

                                    <View style={styles.buttons}>

                                        <Button title="Cancel" style={{}}
                                        onPress={() =>{this.toggleCommentModal();}}
                                        />

                                    </View>

                          </View>


                    </View>
                
            </Modal>
           </ScrollView>
        );    
    
    }
}


const styles = StyleSheet.create({
    container:{
      justifyContent:'center',
      alignItems:'center'
    },
   buttons:{

       width:"95%",
       margin:'auto',
       marginBottom:10,
       marginTop:20,
      
   },
   textin:{
       marginBottom:10,
       borderBottomWidth:0.5,
       borderBottomColor:"black",
       flexDirection:'row',
       paddingLeft:10
   }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
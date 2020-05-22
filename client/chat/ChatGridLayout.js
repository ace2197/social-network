import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ContactList from './ContactList.js';
import ChatRoomLayout from './ChatRoomLayout.js';
import { Grid } from '@material-ui/core';
import axios from 'axios';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class ChatGridLayout extends React.Component{
  constructor(props) {
    super(props);
    this.state = ({
      username: "",
      icon: "",
      friendname: "Chat room bot",
      friendicon: "./assets/bot.png",
      subheader: "Please select who you want to chat with",
      messageList: [],
      friendList: [],
      pickFriendBoolean: false
    });
    
  }
  componentDidMount(){
    var retrievedObject = sessionStorage.getItem('jwt');
    if(retrievedObject == null) {
      window.alert('Invalid login, please log in again!');
      window.location = '/';
    } else {
      retrievedObject = JSON.parse(retrievedObject);
      retrievedObject = retrievedObject['user'];
      var myicon = '';
      axios.get('/user/myicon', {
        params: {
          username: retrievedObject.name
        }
      })
      .then((res) => {
        myicon = res['data']['icon'];
        this.setState({
          username: retrievedObject.name,
          icon: myicon
        });
        document.title = retrievedObject.name;
      })
      .catch(function (error) {
        console.log(error);
      });  

      axios.get('/api/users')
      .then( (res) => {
        //console.log(res['data']);
        for(var i = 0; i < res['data'].length; i++) {
          var friend = res['data'][i];
          if(JSON.parse(sessionStorage.getItem('jwt'))['user']['_id']!=friend['_id']){
          this.setState({
            friendList: this.state.friendList.concat(friend)
          });
        }
        }
        // this.forceUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });  

    }
  }
  addMsgCallback = (item) => {
    let tmp = this.state.friendList.slice(); 
    for(var i = 0; i < tmp.length; i++) {
      if(tmp[i].friendname === item.authorName) {
        tmp[i].lastMsg = item.msg + ' (' + item.time + ')';
        // tmp[i].notifNum += 1;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      } else if(tmp[i].friendname === item.toName) {
        tmp[i].lastMsg = 'I: ' + item.msg + ' (' + item.time + ')';
        // tmp[i].notifNum += 1;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      }
    }
    
    this.setState({
      messageList: this.state.messageList.concat(item)
    }, () => {
      // console.log(this.state.messageList);
    });
  }
  addNotifCallback = (item) => {
    let tmp = this.state.friendList.slice(); 
    for(var i = 0; i < tmp.length; i++) {
      if(tmp[i].friendname === item.otherFriendName) {
        tmp[i].lastMsg = item.msg + ' (' + item.time + ')';
        tmp[i].notifNum += 1;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      }
    }
  }

  clearNotifCallback = (friendname) => {
    let tmp = this.state.friendList.slice(); 
    for(var i = 0; i < tmp.length; i++) {
      if(tmp[i].friendname === friendname) {
        tmp[i].notifNum = 0;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      }
    }
  }

  pickFriendCallback = (e, name, icon) => {
    this.setState({
      friendname: name,
      friendicon: icon,
      messageList: [],
      pickFriendBoolean: true,
      subheader: "Online in Chat"
    }, () => {
      this.clearNotifCallback(name);

      axios.get('/api/chat/messages', {
        params: {
          username: this.state.username,
          friendname: this.state.friendname
        }
      })
      .then((res) => {
        console.log(res);
        res.data.sort((a, b) => a.timestamp - b.timestamp); // works!
        for(var i = 0; i < res.data.length; i++) {
          var msg = res.data[i];
          var item = {};
          if(msg.from === this.state.username && msg.to===this.state.friendname){
            item.avatarUrl = this.state.icon;
            item.authorName = this.state.username;
            item.isOwn = true;
          } else if (msg.from === this.state.friendname && msg.to===this.state.username){
            item.avatarUrl = this.state.friendicon;
            item.authorName = this.state.friendname;
            item.isOwn = false;
          } else {
            continue;
          }
          item.msg = msg.msg;
          item.time = msg.time;
          this.setState({
            messageList: this.state.messageList.concat(item)
          }, () => {
            console.log(this.state.messageList);
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      }); 
    }); 
  };

  render() {
    const { classes } = this.props;
    if(this.state.username === "" || this.state.icon === ""){
      // console.log('null!!');
      return null;
    }
    
    return (
      <div>
      <Grid container className={classes.root} spacing={24}>
      <Grid item xs={8} sm={3}>
      <ContactList username={this.state.username} friendList={this.state.friendList}
        pickFriendCallback={this.pickFriendCallback}></ContactList>
      </Grid>
      <Grid item xs={12} sm={9}>
      <ChatRoomLayout className={classes.paper} username={this.state.username}
        friendname={this.state.friendname} friendicon={this.state.friendicon} subheader={this.state.subheader}
        icon={this.state.icon} messageList={this.state.messageList}  pickFriendBoolean={this.state.pickFriendBoolean}
        addMsgCallback={this.addMsgCallback} addNotifCallback={this.addNotifCallback}
        />
      </Grid>
      </Grid>
      </div>
    );
  }
}
ChatGridLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatGridLayout);
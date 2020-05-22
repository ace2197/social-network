import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import InputBox from './InputBox.js';
import ChatRoomPaper from './ChatRoomPaper.js';
import io from 'socket.io-client';


const styles = () => ({
  card: {
    height: 750,
    margin: 10
  },
});

class ChatRoomLayout extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.socket.emit('username', this.props.username);
  }
  componentDidMount() {
    this.socket.on('message', (msg) => {
      var item = {};
      msg = JSON.parse(msg);
      item.msg = msg.msg;
      item.time = msg.time;
      item.toName = msg.to;
      if(msg.from === this.props.username){
        item.avatarUrl = this.props.icon;
        item.authorName = this.props.username;
        item.isOwn = true;
      } else if (msg.from === this.props.friendname ){
        item.avatarUrl = this.props.friendicon;
        item.authorName = this.props.friendname;
        item.isOwn = false;
      } else { // other friends send messages!
        item.otherFriendName = msg.from;
        this.addNotifCallback(item);
        return null;
      }
      this.addMsgCallback(item);
    });
  }
  addMsgCallback = (item) => {
    this.props.addMsgCallback(item);
  }
  addNotifCallback = (item) => {
    this.props.addNotifCallback(item);
  }

  sendMsgCallback = msg => {

    var myMsg = JSON.stringify({msg: msg, 
      from: this.props.username, to: this.props.friendname});
    this.socket.emit('message', myMsg, (ack) => {
      console.log(ack);
    });
  }

  render() {
    const { classes } = this.props;

    return (
        <Card className={classes.card}
        >
          <CardHeader
            avatar={
              <Avatar src={this.props.friendicon} />
            }
            title={this.props.friendname}
            subheader={this.props.subheader}
          />
          <CardContent>
            <ChatRoomPaper 
            username={this.props.username} icon={this.props.icon}
            friendname={this.props.friendname} friendicon={this.props.friendicon}
            messageList={this.props.messageList}
            />
          </CardContent>
          <CardActions>
            <InputBox sendMsgCallback={this.sendMsgCallback} pickFriendBoolean={this.props.pickFriendBoolean}/>
          </CardActions>
        </Card>
    );
  }
}

ChatRoomLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoomLayout);
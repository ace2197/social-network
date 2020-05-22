import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  msg: String,
  from : String,
  to : String,
  //sentBy: { type: mongoose.Schema.ObjectId, ref: 'User'},
  //sentTo: { type: mongoose.Schema.ObjectId, ref: 'User'},
  time: String,
  timestamp: String
});

export default mongoose.model('Message', messageSchema);

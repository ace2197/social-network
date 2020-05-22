import Message from './../models/message.model'
import errorHandler from './../helpers/dbErrorHandler'

const loadMessages = async (from,to,res)=>{
    try{
        const data= await Message.find();
        res.status(200).json(data);
    } catch (err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const storeMessage=(data) =>{
    console.log(data);
    var newMessage = new Message({
        from: data.from,
        to: data.to,
        msg: data.msg,
        time: data.time,
        timestamp: data.timestamp
    });
    
    newMessage.save(function(err, data){
        if(err){ 
            console.log(err); 
        }
        else{
            console.log('received msg: ' + data);
        } 
    });
}
export default{
    loadMessages,
    storeMessage
}

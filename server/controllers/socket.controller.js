import msgCtrl from './msg.controller'

export default (server)=>{
    const io=require('socket.io').listen(server)
    var name_id_dict={}
    io.on('connection',(socket)=>{
        console.log("IO connected");

        socket.on('username', (username, cb) => {
            console.log( "connect: " + socket.id + ', ' + username);
            name_id_dict[username] = socket.id;
        })
        socket.on('message', (myMsg, cb) => {
            myMsg = JSON.parse(myMsg);
    
            // time is the "server received time"
            var date = new Date();
            var localeSpecificTime = date.toLocaleTimeString();
            date = localeSpecificTime.replace(/:\d+ /, ' ');
    
            var obj = {from: myMsg.from, 
                msg: myMsg.msg, to: myMsg.to, time: date, 
                timestamp: new Date().getTime().toString()};
            
            msgCtrl.storeMessage(obj);
            
            var fullMsg = JSON.stringify(obj);
            // console.log('received msg:' + fullMsg);
            cb('[ack] server received: ' + fullMsg);
            io.to(name_id_dict[obj.from]).emit('message', fullMsg);
            io.to(name_id_dict[obj.to]).emit('message', fullMsg);
        });
    
    
        socket.on("disconnect", () => {
            var id = socket.id;
            var username = "";
            for (const key in name_id_dict) {
                const value = name_id_dict[key];
                if(value === id) {
                    username = key;
                    break;
                }
            }
            console.log("disconnect: " + id + ", " + username);
            name_id_dict[username] = null;
        });
        
    })
}
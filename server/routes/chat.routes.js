import express from 'express'
import msgCtrl from './../controllers/msg.controller'

const router=express.Router()

router.get('/api/chat/messages',(req,res)=>{
    console.log("we are at chat api to retrieve messages.period");
    const from=req.query.from;
    const to=req.query.to;
    msgCtrl.loadMessages(from,to,res);
})

export default router
import express from 'express'
import authCtrl from '../controllers/auth.controller'
import { isValidObjectId } from 'mongoose'

const router = express.Router()

router.route('/auth/signin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .get(authCtrl.signout)

export default router

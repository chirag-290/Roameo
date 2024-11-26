import express from 'express'
import { createBooking, getAllBooking, getBooking, getstripeasync } from '../Controllers/bookingController.js'
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/', createBooking)
router.post('/payment-intent', getstripeasync)
router.get('/:id', verifyUser, getBooking)
router.get('/', verifyAdmin, getAllBooking)

export default router
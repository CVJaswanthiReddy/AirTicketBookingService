const express= require('express');
const{BookingController}= require('../../controllers/index');

//const{createChannel}= require('../../utilis/errors/messageQueue')

// const channel= await createChannel();
const bookingController= new BookingController();

const router= express.Router();
router.get('/info', (req,res)=>{
    return res.json({message: 'Response from routes'})
})
router.post('/bookings', bookingController.create);
router.post('/publish', bookingController.sendMessageToQueue);
router.patch('/bookings/:id/cancel', bookingController.cancel);

module.exports= router;
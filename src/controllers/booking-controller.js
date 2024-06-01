const{StatusCodes}= require('http-status-codes');
const{BookingService}= require('../services/index');
const{createChannel,publishMessage}= require('../utilis/errors/messageQueue')
const{REMAINDER_BINDING_KEY}=require('../config/serverConfig');
const bookingService=new BookingService();

class BookingController{

    constructor()
    {
        
    }

    async sendMessageToQueue(req,res){
        const channel= await createChannel();
        const payload= {
            data:{
                subject:'this is a notification from queue',
                content: 'some queue will subscribe this',
                recepientEmail:'aak977656@gmail.com',
                notificationTime:' 2024-05-31 12:00:00'
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel,REMAINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            message:'Successfully published the event'
        })
    }
    async create (req,res){
        try {
            const response= await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message:'Siccessfully completed booking',
                success:true,
                err:{},
                data:response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message:error.message,
                success:false,
                err:error.explanation,
                data:{}
            });
        }
    }

    

    async cancel  (req, res) 
     {
    try {
       const response = await bookingService.cancelBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            message: 'Successfully cancelled booking',
            success: true,
            err: {},
            data: response
        });
    } catch (error) {
        return res.status(error.statusCode ).json({
            message: error.message,
            success: false,
            err: error.explanation 
        });
    }
}


}

module.exports= BookingController
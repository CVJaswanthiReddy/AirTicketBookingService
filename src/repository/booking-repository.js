const {StatusCodes }= require('http-status-codes')

const{ Booking }=require('../models/index');
const{AppError ,ValidationError}=require('../utilis/errors/index')
class BookingRepository{

    async create(data){
        try {
            const booking= await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name== 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError(
                'Repository Error',
                'cannot create Booking',
                'There was some issue creating the booking,please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    

    async update(bookingId, data) {
        try {
          const booking = await Booking.findByPk(bookingId);
          if (!booking) {
            throw new AppError(
              'Repository Error',
              'Booking Not Found',
              'The booking you are trying to update does not exist',
              StatusCodes.NOT_FOUND
            );
          }
          Object.assign(booking, data);
          await booking.save();
          return booking;
        } catch (error) {
          throw new AppError(
            'Repository Error',
            'Cannot update Booking',
            'There was an issue updating the booking, please try again later',
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      }
    }
    


module.exports=BookingRepository;
const axios= require('axios');

const {BookingRepository}= require('../repository/index');
const{FLIGHT_SERVICE_PATH}=require('../config/serverConfig');
const {ServiceError}  = require('../utilis/errors/index');
const {response}= require('express');
class BookingService{
    constructor()
    {
        this.bookingRepository= new BookingRepository();
    }
    async createBooking(data){
        try {
            const flightId= data.flightId;
            const getFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response= await axios.get(getFlightRequestURL);
            
            const flighData=response.data.data;
            let priceOfTheFlight=flighData.price;
            if(data.noOfSeats > flighData.totalSeats)
                {
                    throw new ServiceError(
                        'something went wrong in the booking process',
                        'Insufficient seats in the flight'
                    );
                }
                const totalCost= priceOfTheFlight * data.noOfSeats;
                const bookingPayload={...data, totalCost};
                const booking=await this.bookingRepository.create(bookingPayload)
                const updateFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`
                await axios.patch(updateFlightRequestURL,{totalSeats: flighData.totalSeats- booking.noOfSeats});
                const finalBooking= await this.bookingRepository.update(booking.id, {status:"Booked"});

                return finalBooking;
            } catch (error) { 
            if(error.name=='RepositoryError' || error.name== 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }

    
    
        async cancelBooking(bookingId) {
            try {
              const booking = await this.bookingRepository.update(bookingId, { status: 'Cancelled' });
              const flightId = booking.flightId;
              const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
              const response = await axios.get(getFlightRequestURL);
        
              const flightData = response.data.data;
              const updatedSeats = flightData.totalSeats + booking.noOfSeats;
              const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
              await axios.patch(updateFlightRequestURL, { totalSeats: updatedSeats });
        
              return booking;
            } catch (error) {
              throw new ServiceError('Error cancelling booking', error.message);
            }
          }
    
    }

module.exports=BookingService;
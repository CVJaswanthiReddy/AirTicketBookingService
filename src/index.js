const express= require('express');
const bodyParser=require('body-parser')

const app=express();
const {PORT}=require('./config/serverConfig');

const db= require('./models/index')

const apiRoutes= require('./routes/index')
const setupAndStartServer =() =>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    
//    app.get('/api/v1/home', (req, res) => {
//     return res.json({message:' Hitting the booking seervice'});
//    })

    app.use('/api', apiRoutes);
    app.listen(PORT, () =>{
        console.log(`server started on ${PORT}`);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true})
        }

    
    })
}

setupAndStartServer();
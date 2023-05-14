const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const userRouter = require('./routes/userRoutes');
const docRouter = require('./routes/docRoutes');
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
 
 credentials: true,
 origin: "http://127.0.0.1:5173"

}));


app.use('/api/user', userRouter);
app.use('/api/doc', docRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`listerning at port: ${PORT}`);
});
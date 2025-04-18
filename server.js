import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import userRouter from './routes/users.route.js';
import categoryRouter from './routes/category.route.js';
import authRouter from './routes/auth.route.js';
import { DB } from './connect.js';
import locationRouter from './routes/location.route.js';
import measurementRouter from './routes/measurement.route.js';
import supplierRouter from './routes/supplier.route.js';
import customerRouter from './routes/customer.route.js';
import stockRouter from './routes/stock.route.js';

const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    DB.run()
    res.status(200);
    res.send('Backend service is online');
  });

app.use('/api/v1/user/', userRouter);
app.use('/api/v1/category/', categoryRouter);
app.use('/api/v1/location/', locationRouter);
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/measurement/', measurementRouter);
app.use('/api/v1/supplier/', supplierRouter);
app.use('/api/v1/customer/', customerRouter);
app.use('/api/v1/stock/', stockRouter);

app.listen(8000,() =>{
    console.log('Started on http://localhost:8000')
})
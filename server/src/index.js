const express = require('express');
const cors = require('cors');
const path = require('path');
const { errors } = require('celebrate');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const routes = require('./routes')

const port = process.env.PORT || 3030;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload())
app.use(routes);
app.use(errors());
app.use('/images', express.static(path.join(__dirname, '../public/uploads')))

app.listen(port, ()=>{
    console.log('Api inicializada com sucesso');
});
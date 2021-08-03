const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${process.env.PORT}`);
});
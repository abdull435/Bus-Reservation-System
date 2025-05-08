const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

const port=3000;

const app=express();

app.listen(port,()=>{
    console.log("Server run on http://localhost:"+port);
    
})
require('dotenv').config();
const express = require('express');
const app = express();


const PORT = process.env.PORT || 5000;

app.get('', (req,res) => {
  res.json({
    name:'marvel pangondian'
  });
});


app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`)
});
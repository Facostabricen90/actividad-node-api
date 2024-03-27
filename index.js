import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try{
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
 };

const writeData = (data) => {
  try{
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
 };

app.get('/', (req, res) =>{
  res.send("welcome to my first API with Node Js!!");
})

app.get('/beers', (req, res) =>{
  const data = readData();
  res.json(data.beers);
})

app.get('/beers/:id', (req, res) =>{
  const data = readData();
  const id = parseInt(req.params.id);
  const beer = data.beers.find((beer) => beer.id === id);
  res.json(beer);
})

app.post('/beers', (req, res) =>{
  const data = readData();
  const body = req.body;
  const newBeer = {
    id: data.beers.length + 1,
    ...body,
  };
  data.beers.push(newBeer);
  writeData(data);
  res.json(newBeer);
});

app.put('/beers/:id', (req, res) =>{
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const beerIndex = data.beers.findIndex((beer) => beer.id === id);
  data.beers[beerIndex] = { 
    ...data.beers[beerIndex],
    ...body,
  };
  res.json({ message: "Beer update successfully" });
});

app.delete('/beers/:id', (req, res) =>{
  const data = readData();
  const id = parseInt(req.params.id);
  const beerIndex = data.beers.findIndex((beer) => beer.id === id);
  data.beers.splice(beerIndex, 1);
  writeData(data);
  res.json({ message: "Beer delete successfully" });
})

app.listen(3000, () => {
  console.log('server listening on port 3000');
})

import express from 'express';
import bodyParser from "body-parser";
import { readData, writeData } from './src/file.js';
import { buildPDF } from "./src/libs/pdfKit.js"

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) =>{
  res.send("welcome to my first API with Node Js!!");
})

app.get('/beers', (req, res) =>{
  const data = readData("./db.json");
  res.json(data.beers);
})

app.get('/beers/:id', (req, res) =>{
  const data = readData("./db.json");
  const id = parseInt(req.params.id);
  const beer = data.beers.find((beer) => beer.id === id);
  res.json(beer);
})

app.post('/beers', (req, res) =>{
  const data = readData("./db.json");
  const body = req.body;
  const newBeer = {
    id: data.beers.length + 1,
    ...body,
  };
  data.beers.push(newBeer);
  writeData(data, "./db.json");
  res.json(newBeer);
});

app.put('/beers/:id', (req, res) =>{
  const data = readData("./db.json");
  const body = req.body;
  const id = parseInt(req.params.id);
  const beerIndex = data.beers.findIndex((beer) => beer.id === id);
  data.beers[beerIndex] = { 
    ...data.beers[beerIndex],
    ...body,
  };
  writeData(data, "./db.json");
  res.json({ message: "Beer update successfully" });
});

app.delete('/beers/:id', (req, res) =>{
  const data = readData("./db.json");
  const id = parseInt(req.params.id);
  const beerIndex = data.beers.findIndex((beer) => beer.id === id);
  data.beers.splice(beerIndex, 1);
  writeData(data, "./db.json");
  res.json({ message: "Beer delete successfully" });
})

app.get('/beersPDF', (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=beersPDF.pdf"
  });

  buildPDF(
    "./db.json",
    (data) => res.write(data),
    () => res.end()
  );
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
})

import express from 'express';
import bodyParser from "body-parser";
import { readData, writeData } from './src/file.js';
import { buildPDF } from "./src/libs/pdfKit.js"
import Joi from 'joi';
import moment from 'moment';
import fs from 'fs';

const app = express();
app.use(bodyParser.json());

//4 punto
function addCreatedAt(req, res, next) {
  const fechaActual = moment().format('YYYY-MM-DD hh:mm');
  req.body.created_at = fechaActual;
  next();
}

//5 punto
function registrarSolicitud(req, res, next) {
  const fecha = moment().format('DD MM YYYY hh:mm:ss');
  const metodo = req.method;
  const url = req.url;
  const query = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);
  const ip = req.ip;

  const linea = `${fecha} [${metodo}] ${url} ${query} ${body} ${ip}\n`;

  fs.appendFile('access_log.txt', linea, (err) => {
    if (err) {
      console.error(err);
    }
  });

  next();
}

app.use(registrarSolicitud);

app.get('/', (req, res) =>{
  res.send("welcome to my first API with Node Js!!");
})

//2 punto
app.get('/beers', (req, res) =>{
  const data = readData("./db.json");

  const filtro = req.query.filtro;
  const valor = req.query.valor;

  if (filtro) {
    const beersFiltered = data.beers.filter(carro => carro[filtro] == valor);

    if (beersFiltered.length === 0) {
      res.send(data.beers);
    } else {
      res.send(beersFiltered);
    }
  } else {
    res.json(data.beers);
  }
})

app.get('/beers/:id', (req, res) =>{
  const data = readData("./db.json");
  const id = parseInt(req.params.id);
  const beer = data.beers.find((beer) => beer.id === id);
  res.json(beer);
})

//1. punto
app.post('/beers', addCreatedAt, (req, res) =>{

  const data = readData('./db.json');
  const body = req.body;
  // Definir esquema Joi para validar los datos de entrada
  const schema = Joi.object({
    name: Joi.string().required(),
    descripcion: Joi.string(),
    alcohol: Joi.number(),
    company: Joi.string(),
    category: Joi.string(),
    disponibility: Joi.boolean().required(),
    created_at: Joi.string().required(),
});

// Validar los datos de entrada
const { error, value } = schema.validate(body);

// Si hay un error en la validación, responder con un error 400
if (error) {
    res.status(400).send(error.details[0].message);
    return;
}

const completo = value; 

const newBeer = {
  id: data.beers.length + 1,
  ...completo,
};
data.beers.push(newBeer);
writeData(data, "./db.json");
res.json(newBeer);

});

//1 punto
app.put('/beers/:id', addCreatedAt, (req, res) =>{
  const data = readData("./db.json");
  const body = req.body;
  const id = parseInt(req.params.id);

  // Definir esquema Joi para validar los datos de entrada
  const schema = Joi.object({
      // Aquí defines las propiedades que esperas en el cuerpo de la solicitud y sus respectivas validaciones
      // Por ejemplo, si esperas una propiedad 'marca' en el cuerpo de la solicitud:
      id: Joi.number().required(),
    name: Joi.string().required(),
    disponibility: Joi.boolean().required(),
    created_at: Joi.string().required(),
      // Puedes agregar más validaciones según tus necesidades
  });

  // Validar los datos de entrada
  const { error, value } = schema.validate(body);

  // Si hay un error en la validación, responder con un error 400
  if (error) {
      res.status(400).send(error.details[0].message);
      return;
  }

  const beerIndex = data.beers.findIndex((beer) => beer.id === id);
  data.beers[beerIndex] = { 
    ...data.beers[beerIndex],
    ...value,
  };
  writeData(data, "./db.json");
  res.json({ message: "Beer update successfully" });
});

//3 punto
app.put('/beers/update', (req, res) => {
  const data = readData("./db.json");

  // Obtener la fecha y hora actual en formato YYYY-MM-DD hh:mm
  const fechaActual = moment().format('YYYY-MM-DD hh:mm');

  // Recorrer todos los registros y actualizar el campo 'updated_at' si está vacío
  const beersUpdate = data.beers.map(beer => {
    if (!beer.updated_at) {
      beer.updated_at = fechaActual;
    }
    return beer;
  });

  // Escribir en el archivo
  writeData(beersUpdate, "./db.json");

  res.send(beersUpdate);
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

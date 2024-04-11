import fs from 'fs';

export function readData(path) {
  try{
    const data = fs.readFileSync(path);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
 };

export function writeData(data, path) {
  try{
    return fs.writeFileSync(path, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
 };

export function readFileSync(path){    
  const data=fs.readFileSync(path);
  const carros=JSON.parse(data).carros;
  return carros;   }



export function escribirArchivo(path, info){ 
  const data=JSON.stringify({'carros':info});
  fs.writeFileSync(path, data);

}

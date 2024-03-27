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

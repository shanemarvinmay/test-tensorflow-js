const tf = require('@tensorflow/tfjs');
// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
require('@tensorflow/tfjs-node');
const fs = require('fs');


// cars_data.csv : 'highway-mpg','city-mpg','horsepower','price'
// cardataset.csv 'highway-mpg'("highway MPG"),("city mpg")'city-mpg','horsepower','year'("Year"),'price'("MSRP")
// car_sale_advertisements.csv 'mileage','make','year'

/**
 * IMPORTING DATA
 */
let createD1Json = () => {
    let d1 = fs.readFileSync('./datasets/numbers/cars_data.csv', { encoding: 'utf8', flag: 'r' });
    // seperating into rows 
    d1 = d1.split("\n");
    for (let i = 0; i < d1.length; i++) {
        d1[i] = d1[i].split(',');
    }
    // getting features
    let d1_obj = {
        "hwy": [],
        "cty": [],
        "hp": [],
        "price": []
    };
    let hwy = d1[0].indexOf('highway-mpg'); let cty = d1[0].indexOf('city-mpg');
    let hp = d1[0].indexOf('horsepower'); let price = d1[0].indexOf('price');

    // console.log(d1[0]);
    // console.log(d1[1]); 
    // console.log(d1[1].length); 
    // console.log(d1.length);

    for (let i = 1; i < d1.length; i++) {
        // console.log(i, "\n~~~~~~~~~~~~~~~~\n");
        for (let j = 0; j < d1[i].length; j++) {
            // console.log(j);
            if (d1[i][j] == '?') { d1[i][j] = 0; }
            if (j == hwy) {
                d1_obj["hwy"].push(d1[i][j]);
            }
            else if (j == cty) {
                d1_obj["cty"].push(d1[i][j]);
            }
            else if (j == hp) {
                d1_obj["hp"].push(d1[i][j]);
            }
            else if (j == price) {
                d1_obj["price"].push(d1[i][j]);
            }
        }
    }
    // console.log(d1_obj["hwy"].length);
    // console.log(d1_obj["cty"].length);
    // console.log(d1_obj["hp"].length);
    // console.log(d1_obj["price"].length);

    // write d1_obj to json file 
    d1_obj = JSON.stringify(d1_obj);
    fs.writeFileSync('datasets/json/d1.json', d1_obj);
};
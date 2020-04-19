const tf = require('@tensorflow/tfjs');
// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
require('@tensorflow/tfjs-node');
const fs = require('fs');
const csv=require("csvtojson/v2");

// cars_data.csv : 'highway-mpg','city-mpg','horsepower','price'
// cardataset.csv 'highway-mpg'("highway MPG"),("city mpg")'city-mpg',("Engine HP")'horsepower','year'("Year"),'price'("MSRP")
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
    let hp = d1[0].indexOf('Engine HP'); let price = d1[0].indexOf('price');
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
                d1_obj["hwy"].push( parseInt( d1[i][j] ));
            }
            else if (j == cty) {
                d1_obj["cty"].push( parseInt( d1[i][j] ));
            }
            else if (j == hp) {
                d1_obj["hp"].push( parseInt( d1[i][j] ));
            }
            else if (j == price) {
                d1_obj["price"].push( parseInt( d1[i][j] ));
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
// createD1Json();

let createD2Json = async () => {
    const jsonArray=await csv().fromFile("./datasets/numbers/cardataset.csv");
    // console.log(jsonArray[0]['highway MPG']);
    console.log(jsonArray[0]);
    
    // // 'highway-mpg'("highway MPG"),("city mpg")'city-mpg','horsepower','year'("Year"),'price'("MSRP")
    // // getting features and label
    let d2_obj = {
        "hwy": [],
        "cty": [],
        "hp": [],
        "yr":[],
        "price": []
    };
    // console.log(d2[1][hwy]);
    for (let i = 0; i < jsonArray.length; i++) {
       d2_obj["hwy"].push( parseInt( jsonArray[i]["highway MPG"] ) );
       d2_obj["cty"].push( parseInt( jsonArray[i]["city mpg"] ) );
       d2_obj["hp"].push( parseInt( jsonArray[i]["Engine HP"] ) );
       d2_obj["yr"].push( parseInt( jsonArray[i]["Year"] ) );
       d2_obj["price"].push( parseInt( jsonArray[i]["MSRP"] ) );
    }
    // console.log(d2_obj["hwy"].length == d2_obj["cty"].length == d2_obj["hp"].length == d2_obj["yr"].length == d2_obj["price"].length);
    // console.log(d2_obj["cty"].length);
    // console.log(d2_obj["hp"].length);
    // console.log(d2_obj["yr"].length);
    // console.log(d2_obj["price"].length);
    // console.log(d2_obj["hwy"].length);
    // console.log(d2_obj);
    // write d2_obj to json file 
    d2_obj = JSON.stringify(d2_obj);
    fs.writeFileSync('datasets/json/d2.json', d2_obj);
};
// createD2Json();


const tf = require('@tensorflow/tfjs');
// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
require('@tensorflow/tfjs-node');
const fs = require('fs');
const csv = require("csvtojson/v2");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');
const formidable = require('formidable');
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
                d1_obj["hwy"].push(parseInt(d1[i][j]));
            }
            else if (j == cty) {
                d1_obj["cty"].push(parseInt(d1[i][j]));
            }
            else if (j == hp) {
                d1_obj["hp"].push(parseInt(d1[i][j]));
            }
            else if (j == price) {
                d1_obj["price"].push(parseInt(d1[i][j]));
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
    return JSON.parse(d1_obj);
};
let createD2Json = async () => {
    const jsonArray = await csv().fromFile("./datasets/numbers/cardataset.csv");
    // console.log(jsonArray[0]['highway MPG']);
    // console.log(jsonArray[0]);

    // // 'highway-mpg'("highway MPG"),("city mpg")'city-mpg','horsepower','year'("Year"),'price'("MSRP")
    // // getting features and label
    let d2_obj = {
        "hwy": [],
        "cty": [],
        "hp": [],
        "yr": [],
        "price": []
    };
    // console.log(d2[1][hwy]);
    for (let i = 0; i < jsonArray.length; i++) {
        d2_obj["hwy"].push(parseInt(jsonArray[i]["highway MPG"]));
        d2_obj["cty"].push(parseInt(jsonArray[i]["city mpg"]));
        d2_obj["hp"].push(parseInt(jsonArray[i]["Engine HP"]));
        d2_obj["yr"].push(parseInt(jsonArray[i]["Year"]));
        d2_obj["price"].push(parseInt(jsonArray[i]["MSRP"]));
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
    return JSON.parse(d2_obj);
};
let createModel = () => {
    const model = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [1], units: 1, useBias: true }),
            tf.layers.dense({ units: 1, useBias: true })
        ]
    });
    return model
};
let trainModel = async (model, inputs, labels) => {
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse']
    });
    const batchSize = 32;
    const epochs = 50;
    return await model.fit(inputs, labels, {
        batchSize: batchSize,
        epochs: epochs,
        shuffle: true
    });
}

let makeAndTrain = async () => {
    let d1 = createD1Json();
    let d2 = fs.readFileSync("datasets/json/d2.json", { encoding: 'utf8', flag: 'r' });//createD2Json();
    d2 = JSON.parse(d2);
    const model = createModel();
    let input = tf.tensor(d1.hwy);
    let output = tf.tensor(d1.price);
    console.log(input);
    console.log(output);
    await trainModel(model, input, output);
    console.log('done training');
    let tempInput = tf.tensor(input.arraySync());
    let p = model.predict(tempInput);
    console.log("predicted" + p + " actual value " + d1.price[0]);
    const saveResult = await model.save('file://./models/d1-model');
    // console.log(saveResult);
};
// makeAndTrain();

const loadAndRun = async (features, callback) => {
    const model = await tf.loadLayersModel('file://./models/d1-model/model.json');
    // console.log(model);
    let input = tf.tensor([features]);
    let output = model.predict(input).arraySync();
    output = output[0][0] * 50000;
    console.log(output);
    callback(output);
};
// loadAndRun(/*need input and callback now!*/);

const readImage = (path) => {
    const imageBuffer = fs.readFileSync(path);
    const tfImage = tfnode.node.decodeImage(imageBuffer);
    return tfImage;
}

const imageClassification = async (path, callback) => {
    const image = readImage(path);
    const mobilenetModel = await mobilenet.load();
    const predictions = await mobilenetModel.classify(image);
    console.log(predictions);
    callback(predictions);
    return predictions;
}

app.get('/', (req, res) => {
    let hwy = req.query.hwy || (Math.floor(Math.random() * Math.floor(20)) + 20);
    hwy = parseInt(hwy);
    console.log("hwy: " + hwy);
    try {
        loadAndRun(hwy, (output) => res.send("Value: " + output));
        imageClassification("./datasets/images/cars/1.jpg", ((predictions) => res.send(predictions)));
    } catch (err) {
        console.log("\n~~~~~~~~~\nHey! Something went wrong...\n~~~~~~~~~\n");
        console.log(err);
    }
});

app.post('/image', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = './' + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            console.log(newpath);
            if (err) throw err;
            try {
                imageClassification(newpath/*"./datasets/images/car3.jpeg"*/, ((predictions) => {
                    for(let i = 0; i < predictions.length; i++){
                        if( predictions[i]["className"].indexOf("car") > 0 || predictions[i]["className"].indexOf("minivan") > 0 || predictions[i]["className"].indexOf("truck") > 0 || predictions[i]["className"].indexOf("wagon") > 0  ){
                            let result = Math.floor(Math.random() * Math.floor(20000)) + 20000;
                            res.send("Value: " + result);
                            return;
                        }
                    }
                    res.send("not a car but rather " + predictions[0]["className"]);
                })).catch((err)=>{
                    console.log("error with prediction (probably because it's not a jpg)",err);
                    res.send("error with prediction (probably because it's not a jpg)");
                });
            } catch (err) {
                console.log("\n~~~~~~~~~\nHey! Something went wrong...\n~~~~~~~~~\n");
                console.log(err);
            }
        });
    });
});


app.get('/demo', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="image" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


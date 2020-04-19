const tf = require('@tensorflow/tfjs');
// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
require('@tensorflow/tfjs-node');

// cars_data.csv : 'highway-mpg','city-mpg','horsepower','price'
// cardataset.csv 'highway-mpg'("highway MPG"),("city mpg")'city-mpg','horsepower','year'("Year"),'price'("MSRP")
// car_sale_advertisements.csv 'mileage','make','year'
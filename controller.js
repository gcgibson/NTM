module.exports.controllerFunction =controllerFunction;
var numeric  = require('numeric');
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./config.json'));



var P;

var   input_size = data.input_size,
    mem_size   = data.mem_size,
    mem_width  = data.mem_width,
    output_size = data.output_size,
    shift_width = data.shift_width,
    layer_sizes= data.layer_sizes,
    no_heads= 1;
var W_input_hidden = [[]];
var W_read_hidden = [[]];
var b_hidden_0 = [];
//initialize weight matrices
//initialise the variables in the cache
for (var i =0; i < input_size; i++){
    var tmp = [];
    for(var j=0; j< layer_sizes; j++){
        tmp.push(Math.random());
    }  
    W_input_hidden.push(tmp);
}

for(var i2 = 0; i2 < mem_width; i2++){
    var tmp2=[];
    for(var j2 =0; j2 <layer_sizes; j2++){
        tmp2.push(Math.random());
    }
    W_read_hidden.push(tmp2);
}

for(var i =0; i < layer_sizes; i++ ){
    b_hidden_0.push(0.0);
}

var hidden_weights = [];
var W_hidden_output = [[]];
var b_output = [];

for (var i3 = 0; i3 < layer_sizes; i3++){
    var tmp3 = [];
    for(var j3 = 0; j3 <output_size; j3++){
        tmp3.push(Math.random());
    }
    W_hidden_output.push(tmp3);
    
}

for (var i = 0; i <output_size; i++){
    b_output.push(0.0);
}

   W_input_hidden.shift();
    W_read_hidden.shift();
    W_hidden_output.shift();
var model=require("./model.js");

model.myCache.set( "W_input_hidden", W_input_hidden, function( err, success ){
   if( !err && success ){
   }
 });
 model.myCache.set( "W_read_hidden", W_read_hidden, function( err, success ){
   if( !err && success ){
   }
 });
 model.myCache.set( "b_hidden_0", b_hidden_0, function( err, success ){
   if( !err && success ){
   }
 });
 model.myCache.set( "hidden_weights", hidden_weights, function( err, success ){
   if( !err && success ){
   }
 });
 model.myCache.set( "W_hidden_output", W_hidden_output, function( err, success ){
   if( !err && success ){
   }
 });
 model.myCache.set( "b_output", b_output, function( err, success ){
   if( !err && success ){
   }
 });

//I think the ControllerFunction i

function controllerFunction(input_t,read_t,callback){
    
 
    //why is input_t an array
    //THIS FUNCTION IS DEFINITELY NOT CORRECT
   
    
    //need to multiply by the individual vals
   //need to read from the cache
    model.myCache.get( "W_input_hidden", function( err, W_input_hidden ){
    model.myCache.get( "W_read_hidden", function( err, W_read_hidden ){
    model.myCache.get( "b_hidden_0", function( err, b_hidden_0 ){
     model.myCache.get( "W_hidden_output", function( err, W_hidden_output ){   

        //SECOND PREDICT IS BREAKING HERE
         var tmp1= numeric.dotVM(input_t,W_input_hidden.W_input_hidden);
    var tmp2= numeric.dotVM(read_t,W_read_hidden.W_read_hidden);
    var tmp3  = numeric.add(tmp1,tmp2);
    var prev_layer = numeric.add(tmp3,
            b_hidden_0.b_hidden_0);
            
    for(var i = 0; i < prev_layer.length; i ++){
        prev_layer[i] = tanh(prev_layer[i]);
    }
    
    
    //htis is right because it is 20 
    //W_hidden_output is an array of zeroes
        var fin_hidden = prev_layer;
    
     

    var dotTmp =numeric.dotVM(fin_hidden,W_hidden_output.W_hidden_output);
    
    var tmpOutPut_t = numeric.add(dotTmp,b_output);
    var output_t= [];
    
    for(var i =0; i < tmpOutPut_t.length;i++){
        output_t.push(sigmoid(tmpOutPut_t[i]));
    }
    
        callback([output_t,fin_hidden]);
    
   
    }); 
    });        
    });
    });
   
    
    
}




function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}




function tanh(x) {
  if(x === Infinity) {
    return 1;
  } else if(x === -Infinity) {
    return -1;
  } else {
    var y = Math.exp(2 * x);
    return (y - 1) / (y + 1);
  }
}

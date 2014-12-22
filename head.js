var numeric = require('numeric');
var fs = require('fs');

var util = require('util');
var P = {};
var log_file = fs.createWriteStream(__dirname + '/debug1.log', {flags : 'w'});
var log_stdout = process.stdout;


  console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
 //  // log_stdout.write(util.format(d) + '\n');
  };
 
function build(input_size,mem_width,mem_size,shift_width){
    

    var tmp1  = createInitialweights(input_size,mem_width);
    tmp1.shift();
    P["W_key"]  = tmp1;

    var tmp2=createInitialweightsZeroes(mem_width);

    P["b_key"]   = tmp2;
    
    var tmp3 = createInitialweights(input_size,shift_width);
    tmp3.shift();
    P["W_shift"] = tmp3;
    
    var tmp4 = createInitialweightsZeroes(shift_width);
    P["b_shift"] = tmp4;

    var tmp5 = createInitialweightsZeroes(input_size);
   
    P["W_beta"]  =tmp5;
    

    P["b_beta"]  = 0.0;
    
    var tmp6 = createInitialweightsSingle(input_size);

    P["W_gamma"] = tmp6;
    
    P["b_gamma"] = 0.0;
    
    var tmp7 = createInitialweightsSingle(input_size);

    P["W_g"]     = tmp7;
    P["b_g"]     = 0.0;

    var tmp8 = createInitialweights(input_size,mem_width);
    tmp8.shift();
    P["W_erase"] = tmp8;
    
    var tmp9 = createInitialweightsZeroes(mem_width);
    
    P["b_erase"] = tmp9;
    
    var tmp10 = createInitialweights(input_size,mem_width);
    tmp10.shift();
    P["W_add"]   = tmp10;
    var tmp11 = createInitialweightsZeroes(mem_width);

    P["b_add"]   = tmp11;
    
    
    
    
}

function head_params(x){
    // x will be a vecotr
     
        var tmpW_Key =  P["W_key"];
        var tmpB_key= P["b_key"];
        var addWB = numeric.dotVM(x,tmpW_Key);
        var key_t =  sigmoid(numeric.add(addWB,tmpB_key));

        
        var tmp_W_shift = P["W_shift"];
        var tmp_b_shift = P["b_shift"];
        var shift_t = softmax(numeric.add(numeric.dotVM(x,tmp_W_shift), tmp_b_shift));

        
        var _beta_t  = numeric.add(numeric.dotVV(x,P["W_beta"]), P["b_beta"]);
        var     _gamma_t = numeric.add(numeric.dotVV(x,P["W_gamma"]), P["b_gamma"]);
        
        var beta_t  = softplus([_beta_t])
        var gamma_t =  softplus([_gamma_t]) + 2.0;
        
        
        var g_t     = sigmoid([numeric.add(numeric.dotVV(x,P["W_g"]),P["b_g"])]);
        var tmpP_werase  =numeric.dotVM(x,P["W_erase"]); 
        var erase_t = sigmoid(numeric.add(tmpP_werase , P["b_erase"]));
        var add_t   = sigmoid(numeric.add(numeric.dotVM(x,P["W_add"]) ,P["b_add"]));
    
        return [key_t,beta_t,g_t,shift_t,gamma_t,erase_t,add_t];
    
    }

function softplus(x){
    return Math.log(1+Math.exp(x));
}
function createInitialweights(a,b){
    var result = [[]];
    for(var i =0; i < a; i ++){
        var tmp=[];
        for (var j=0; j <b; j++){
            tmp.push(Math.random());
        }
        result.push(tmp);
    }
    return result;
}

function createInitialweightsZeroes(a){
    var result = [];
    
    for(var i =0; i < a; i ++){
       
        result.push(0.0);
    }
    return result;
}
function createInitialweightsSingle(a){
    var result = [];
    
    for(var i =0; i < a; i ++){
       
        result.push(Math.random());
    }
    return result;
}

module.exports.build =build;
module.exports.head_params = head_params;


function sigmoid(array){
    var tmpSig= [];
    for(var i =0; i < array.length;i++){
        tmpSig.push(sigmoidSingle(array[i]));
    }
    return tmpSig;
}
function sigmoidSingle(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

function softmax(array){
    var tmpSoft = [];
    var sum= 0;
    for(var i =0 ; i < array.length; i++){
        sum+= Math.exp(array[i]);
    }
    for(var i =0 ; i < array.length; i++){
        tmpSoft.push( array[i]/sum);
    }
    return tmpSoft;
}

function tanh(array) {
    if(array.length>1){
    var returnArray= []
    for(var i =0; i< array.length; i++){ 
        var x = array[i];
      if(x === Infinity) {
        returnArray.push(1);
      } else if(x === -Infinity) {
        returnArray.push(-1);
      } else {
        var y = Math.exp(2 * x);
        returnArray.push ((y - 1) / (y + 1));
      }
    }
    return returnArray;
    }
    else{
          var z = array[0];
      if(z === Infinity) {
        return (1);
      } else if(z === -Infinity) {
        return (-1);
      } else {
        var k = Math.exp(2 * z);
        return ((k - 1) / (k + 1));
      }
    }
}
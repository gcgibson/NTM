var synaptic = require('synaptic');

var inputLayer = new synaptic.Layer(2);
var hiddenLayer = new synaptic.Layer(3);
var outputLayer = new synaptic.Layer(1);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var myNetwork = new synaptic.Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

// train the network
var learningRate = .3;
for (var i = 0; i < 1; i++)
{
    // 0,0 => 0
    myNetwork.activate([0,0]);
    myNetwork.propagate(learningRate, [1]);

   
}


// test the network
console.log(myNetwork.activate([0,0])); // [0.015020775950893527]
myNetwork.activate([0,1]); // [0.9815816381088985]
myNetwork.activate([1,0]); // [0.9871822457132193]
myNetwork.activate([1,1]); // [0.012950087641929467]
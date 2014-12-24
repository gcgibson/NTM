var synaptic = require('synaptic');
var A = new synaptic.Neuron();
var B = new synaptic.Neuron();
A.project(B);

var learningRate = .001;

for(var i = 0; i < 2; i++)
{
    // when A activates 1
    A.activate(1);

    // train B to activate 0
    B.activate();
    B.propagate(learningRate, 0); 
}

// test it
A.activate(1);
console.log(B.activate()); // 0.006540565760853365
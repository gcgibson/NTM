-----

Developed by Graham Gibson dec 15th 2014

-----

Neural Turing Machine implementation in node js. The architecture the authors developed is awesome. 



Here is a usage example:



 grahamcgibson$ /bin/bash -c "ulimit -s 65500; exec /usr/local/bin/node --stack-size=65500 model.js "

Training on 

[ 1, 0, 1, 0 ]


-------
Neural Network Trained Ready for Input sequence: 

prompt: inputsequence: 1,1,1,1


  inputsequence: 1,1,1,1


Final ---> [ 0.9999631888851344,
  0.36935813795683203,
  0.9999695650749896,
  0.05992527183073481 ]


Also: I am trying out some limited auto-programming using brainfuck. Currently if you give the NTM the brainfuck for A, it will guess the brainFuck for B, but you have to translate the brainfuck instruction set into a vector first, so it is not quite auto-generating code yet, but soon! 

Right now there are some issues,because of the linear algebra library used you can only have 
"input_size" = "mem_width" = "output_size" in the config.json. 

Enjoy --feel free to submit a PR as this is obviously not all finished!
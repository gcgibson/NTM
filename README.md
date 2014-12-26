NTM
===

Neural Turing Machine implementation in Node JS using synaptic. 

The NTM is actually pretty simple -- just used the architecture developed and described by
http://arxiv.org/pdf/1410.5401v2.pdf

if you haven't checked it out yet take a look, it is pretty brilliant. 

I just added a simply bfInterpreter that actually ouputs BF code in the simple instruction set using a parser based on
the interactions between the controller and the memory matrix. 

Currently there are some limitations:


1) Only sequences of binary values can be added becasue BF only has a + - instrcution set so not sure how I want to 
handle floats yet.

2) Only sequences of length 3 can be copied becasue I didn't want to figure out how to write the convolutional shift 
matrix for arbitrary sequence length. 

3) Current tape length is 8 mem slots, and expanding that will require some reworking of the layer size maps.


tl;dr 
  Very simple NTM architecture used to output instruction sequence in BF for copying sequences into memory.


If you want to try a different input change input sequence in code line 245, currently length 4 inputs are supported (will be enhanced very soon).

Numerically stability is definitely still an issue, and only one read/write head is connected to the controller for now. 

execute (depending on your system):  /bin/bash -c "ulimit -s 65500; exec /usr/local/bin/node --stack-size=65500 model.js" 
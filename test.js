var x = [0,1,2]
var y = {'-1':0,'0':1,'1':2};
var sum = 0;
for (var i =0; i < 3;i++){
	for(var j=0; j<3; j++){
		console.log(i,j);
		if(y[i-j]){
			sum += y[i-j];
		}
	}
}console.log(sum);
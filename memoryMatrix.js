var numeric = require('numeric');
//memory matrix
module.exports = {


/*------------INPUT VARIABLES------------*/


sharpening:function (wG_t,gamma_t,memMat){
	var totalSum = 0;
	for(var i =0; i < wG_t.length; i ++){
		totalSum += Math.pow(wG_t[i],gamma_t);
	}
	for(var i =0; i < memMat.length; i ++){
		wG_t[i] =  Math.pow(wG_t[i],gamma_t)/totalSum;
	}
	return wG_t;
},
convolutionalShift: function (s_t,wG_t,memMat){
	for(var i =0; i < wG_t.length; i++){	
		var sum = 0;
		for(var j =0; j < memMat.length; j++){
				sum+=wG_t[j]*s_t[i-j]
		}
		wG_t[i] = sum;
	}
	return wG_t;
},
interpolationGate: function (g_t,wC_t,w_tM1){
	var tmpWCT = [];
	for(var i =0; i<wC_t.length; i++){
		tmpWCT.push(g_t*wC_t[i]);
	}
	var tmpwTM1 = [];
	for(var i =0; i<w_tM1.length; i++){
		tmpwTM1.push((1-g_t)*w_tM1[i]);
	}
	return numeric.add(tmpwTM1,tmpWCT);

},

generateContentBasedNormalization: function (b_t,k_t,memMat){
	console.log('memMat   ---->' + memMat);
	console.log('k_t   ---->' + k_t);
		console.log('b_t   ---->' + b_t);
	var totalSum = 0;
	for(var i =0; i < memMat.length; i ++){
		var tmp = cosineSimilar(k_t,memMat[i]);
		totalSum += Math.exp(b_t*tmp);
	}
	console.log(totalSum)
	for(var i =0; i < memMat.length; i ++){
				
		k_t[i] = Math.exp(b_t*cosineSimilar(k_t,memMat[i]))/totalSum;
	}
	
	return k_t;
},



//implementation of cosine similarity 
cosineSimilar: function (a,b){

	var numerator = numeric.dotVV(a,b);
	var denominator = (a.length + b.length);
	return numerator/denominator;
}
};

function cosineSimilar  (a,b){
	console.log('consine compare a ->>>> ',a);
	console.log('consine compare b ->>>> ',b);
	var numerator = numeric.dotVV(a,b);
	//console.log(numerator);
	var sum1  = 0;
	for(var i =0; i < a.length; i++){
		sum1+=a[i];
	}
	var sum2  = 0;
	for(var i =0; i < b.length; i++){
		sum2+=b[i];
	}
	var denominator = (sum1 + sum2);
	console.log(numerator/denominator);
	return (numerator/denominator);
}

/** Reimplementação do forEach */
if(!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun /*, thisp*/) {
    var len = this.length >>> 0;
    if(typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

$.extend({
    range:  function() {
        if (!arguments.length) { return []; }
        var min, max, step;
        if (arguments.length == 1) {
            min  = 0;
            max  = arguments[0]-1;
            step = 1;
        }
        else {
            min  = arguments[0];
            max  = arguments[1]-1;
            step = arguments[2] || 1;
        }
        if (step < 0 && min >= max) {
            step *= -1;
            var tmp = min;
            min = max;
            max = tmp;
            min += ((max-min) % step);
        }
        var a = [];
        for (var i = min; i <= max; i += step) { a.push(i); }
        return a;
    }
});
/** Reimplementação do forEach */

/** Helper pra Data */
function renderData(data){
	subs = data.substr(0,10);
	dataArray = subs.split('-');

	return dataArray[2]+"/"+dataArray[1]+"/"+dataArray[0];
}

Object.values = function (obj) {
	var vals = [];
	for( var key in obj ) {
		if ( obj.hasOwnProperty(key) ) {
			vals.push(obj[key]);
		}
	}
	return vals;
}

/** Helper pras validações*/
function paramDictionary(obj){
	key = obj;
	str ='';
	switch(key){
		case 'name':
			str = 'nome' ;
		break;
		case 'price':
			str = 'preço' ;
		break;
		case 'category_ids':
			str = 'categorias' ;
		break;
		case 'tag_list':
			str = 'tags' ;
		break;
		case 'place':
			str = 'local' ;
		break;
		case 'description':
			str = 'descrição' ;
		break;
		default:
			str = 'none' ;
		break;
	}
	return str;
}

function printError(obj){
	resposta = obj.responseText;
	resposta = JSON.parse(resposta);

	if(typeof(Object.keys(resposta)[0])!== undefined && Object.keys(resposta)[0].length>0){
		server = Object.keys(resposta)[0];
	}else{
		console.log('printError ELSE');
		console.log(resposta);
		console.log(Object.keys(resposta));
	}
	return paramDictionary(Object.keys(resposta)[0])+' '+Object.values(resposta)[0];
}

/** Expõe o arquivo encodado para fora do escopo do evento */
function retornaBlob(blob){
	return blob;
}

function create_blob(file, callback) {
    var reader = new FileReader();
    reader.onload = function() { callback(reader.result) };

    //O método readAsDataURL() ja retorna um resultado em base64. 
    //assim vc só vai precisar remover os metadados iniciais
    reader.readAsDataURL(file);
}

/** Responsavel por retornar um arquivo base64encoded */
function create_blob2(file, callback) {
    var reader2 = new FileReader();
    reader2.onload = function() { callback(reader2.result) };
    reader2.readAsDataURL(file);
}


/** Varias funcoes de file encoding que um dia poderão ser usadas (ou nao)*/
function encode_utf8(s) {
 return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

function utf8encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
}

function decodeBase64(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};

function stringToAscii(s) {
	var ascii="";
	if(s.length>0)
	for(i=0; i<s.length; i++) {
		var c = ""+s.charCodeAt(i);
		while(c.length < 3)
			c = "0"+c;
			ascii += c;
	}
	return(ascii);
}

function uint8ToBase64(uint8) {
	var i,
	extraBytes = uint8.length % 3, 
	output = "",
	temp, length;

	function tripletToBase64 (num) {
		return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
	}

	// itera no array every de 3 em 3 bytes
	for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
		temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
		output += tripletToBase64(temp);
	}

	// Isso evita o ERR_INVALID_URL no Chrome (Firefox okay)
	switch (output.length % 4) {
		case 1:
			output += '=';
		break;
		case 2:
			output += '==';
		break;
		default:
		break;
	}

	return output;
}

function uint8ToString(buf) {
    var i, length, out = '';
    for (i = 0, length = buf.length; i < length; i += 1) {
        out += String.fromCharCode(buf[i]);
    }
    return out;
}

function uploadImage(){

	var fileReader = new FileReader();

	fileReader.onload = function(e) {
	    var xmlHttpRequest = new XMLHttpRequest();

	    //velho AJAX  - callbacks, handlers etc.
	    xmlHttpRequest.open("POST", '/', true);
	    var dashes = '--';
	    var boundary = 'photoupload';
	    var crlf = "\r\n";

	    //Post com o MIME type correto (Se o SO poder identificar um)
	    if ( fileObject.type == '' ){
	        filetype = 'application/octet-stream';
	    } else {
	        filetype = fileObject.type;
	    }

	    //Monta o HTTP request pra enviar o arquivo
	    var data = dashes + boundary + crlf + "Content-Disposition: form-data;" + "name=\"file\";" + "filename=\"" + unescape(encodeURIComponent(fileObject.name)) + "\"" + crlf + "Content-Type: " + filetype + crlf + crlf + e.target.result + crlf + dashes + boundary + dashes;

	    xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);

	    //Envia os dados binários
	    xmlHttpRequest.send(data);
	}

	//fileReader.readAsBinaryString(fileObject);
	fileReader.readAsDataURL( fileObject.split("data:image/jpeg;base64,")[1] ) ;

}

function convertDataURIToBinary(dataURI){
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (i = 0; i < rawLength; i++)
    {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}


Object.values = function (obj) {
	var vals = [];
	for( var key in obj ) {
		if ( obj.hasOwnProperty(key) ) {
			vals.push(obj[key]);
		}
	}
	return vals;
}

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
	reposta = obj.responseText;
	reposta = JSON.parse(reposta);
	server = "";
	if(Object.keys(reposta)[1].length>0){
		server = Object.keys(reposta)[1];
	}
	return paramDictionary(Object.keys(reposta)[0])+' '+Object.values(reposta)[0]+' '+server;
}

/** Expoe o arquivo encodado para fora do escopo do evento */
function retornaBlob(blob){
	return blob;
}

function create_blob(file, callback) {
    var reader = new FileReader();
    reader.onload = function() { callback(reader.result) };

    //The readAsDataURL() method might already encode it as base64 for you. 
    //You'll probably need to strip out the beginning stuff
    reader.readAsDataURL(file);
}

/** Responsavel por retornar um arquivo base64encoded */
function create_blob2(file, callback) {
    var reader2 = new FileReader();
    reader2.onload = function() { callback(reader2.result) };
    reader2.readAsDataURL(file);
}


/** Varias funcoes de file encoding que um dia poderao ser usadas (ou nao)*/
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
	extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
	output = "",
	temp, length;

	function tripletToBase64 (num) {
		return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
	}

	// go through the array every three bytes, we'll deal with trailing stuff later
	for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
		temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
		output += tripletToBase64(temp);
	}

	// this prevents an ERR_INVALID_URL in Chrome (Firefox okay)
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

	    //Some AJAX-y stuff - callbacks, handlers etc.
	    xmlHttpRequest.open("POST", '/', true);
	    var dashes = '--';
	    var boundary = 'photoupload';
	    var crlf = "\r\n";

	    //Post with the correct MIME type (If the OS can identify one)
	    if ( fileObject.type == '' ){
	        filetype = 'application/octet-stream';
	    } else {
	        filetype = fileObject.type;
	    }

	    //Build a HTTP request to post the file
	    var data = dashes + boundary + crlf + "Content-Disposition: form-data;" + "name=\"file\";" + "filename=\"" + unescape(encodeURIComponent(fileObject.name)) + "\"" + crlf + "Content-Type: " + filetype + crlf + crlf + e.target.result + crlf + dashes + boundary + dashes;

	    xmlHttpRequest.setRequestHeader("Content-Type", "multipart/form-data;boundary=" + boundary);

	    //Send the binary data
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

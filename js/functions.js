
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
	return paramDictionary(Object.keys(reposta)[0])+' '+Object.values(reposta)[0];
}

function retornaBlob(blob){
	return blob;
}

function create_blob(file, callback) {
    var reader = new FileReader();
    //reader.readAsBinaryString(file);
    reader.onload = function() { callback(reader.result) };
    reader.readAsDataURL(file);
}
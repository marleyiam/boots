// A URL raiz para os serviços RESTful
var rootURL = "http://localhost:8080/RedeSocialSimplificada/rest/usuarios";

var usuarioAtual;

// Recupera a lista de Usuarios quando a applicação starta
findAll();

// Nada a ser excluido quando a aplicação inicia por isso o hide
$('#btnDelete').hide();

// Registra o listener do botão de busca
$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});

// Campo Search retorna false para um valor inválido passado
$('#searchKey').keypress(function(e){
	if(e.which == 13) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});

$('#btnAdd').click(function() {
	novoUsuario();
	return false;
});

$('#btnSave').click(function() {
	if ($('#usuarioId').val() == '')
		adicionarUsuario();
	else
		atualizarUsuario();
	return false;
});

$('#btnDelete').click(function() {
	excluirUsuario();
	return false;
});

$('#usuarioList a').live('click', function() {
	findById($(this).data('identity'));
});

// subistitui imagens inválidas por uma imagem genérica
$("img").error(function(){
  $(this).attr("src", "pics/default_profile.png");

});

function search(searchKey) {
	if (searchKey == '') 
		listaUsuarios();
	else
		findByLogin(searchKey);
}

function novoUsuario() {
	$('#btnDelete').hide();
	usuarioAtual = {};
	detalharUsuario(usuarioAtual); // Exibe o formulário vazio
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // tipo de resposta
		success: renderizarLista
	});
}

function findByLogin(searchKey) {
	console.log('findByLogin: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderizarLista 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById com sucesso .: ' + data.login);
			usuarioAtual = data;
			detalharUsuario(usuarioAtual);
		}
	});
}

function adicionarUsuario() {
	console.log('adicionarUsuario');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Usuario criado com sucesso!');
			$('#btnDelete').show();
			$('#usuarioId').val(data.id);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Erro ao adicionar usuario .: ' + textStatus);
		}
	});
}

function atualizarUsuario() {
	console.log('atualizarUsuario');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#usuarioId').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Usuario atualizado com sucesso !');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Erro ao atulizar usuario! .: ' + textStatus);
		}
	});
}

function excluirUsuario() {
	console.log('excluirUsuario');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#usuarioId').val(),
		success: function(data, textStatus, jqXHR){
			alert('Usuario excluido com Sucesso!');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Erro ao excluir usuario!');
		}
	});
}

function renderizarLista(data) {
	// JAX-RS serializa uma lista vazia como null, e uma 'coleção de um só' como um objeto (não um 'array de um só elemento')
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	$('#usuarioList li').remove();
	$.each(list, function(index, usuario) {
		$('#usuarioList').append('<li><a href="#" data-identity="' + usuario.id + '">'+usuario.login+'</a></li>');
	});
}

function detalharUsuario(usuario) {
	$('#usuarioId').val(usuario.id);
	$('#login').val(usuario.login);
	$('#senha').val(usuario.senha);
	$('#idade').val(usuario.idade);
	$('#pais').val(usuario.pais);
	$('#cidade').val(usuario.cidade);
	$('#foto').attr('src', 'pics/' + usuario.foto);
	$('#descricao').val(usuario.descricao);
}

//  Função Helper para serializar todos os campos do form em uma string JSON 
function formToJSON() {
	var usuarioId = $('#usuarioId').val();
	return JSON.stringify({
		"id": usuarioId == "" ? null : usuarioId, 
		"login": $('#login').val(), 
		"senha": $('#senha').val(),
		"idade": $('#idade').val(),
		"pais": $('#pais').val(),
		"cidade": $('#cidade').val(),
		"foto": usuarioAtual.foto,
		"descricao": $('#descricao').val()
		});
}

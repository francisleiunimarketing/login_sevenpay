
var loaderBg_Global;
$(document).ready(function() {
	$.ajax({
		url: '../controller/login.php'
		, type: 'POST'
		, dataType: 'text'
		, data: { 'getConfigLogin': true }
		, error: function() { console.log('Falha ao fazer a requisição!'); }
	}).done(function(data) {
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		if ((data.no_set_nome || '') == '') {
			$(".titulo_projeto_login").html((data.nome_projeto || ''));
		}
		$(".titulo_projeto").html((data.nome_projeto || ''));

		$("#login").attr('type', (data.login_type || 'text'));
		if ((data.login_maxlength || '') != '') $("#login").attr('maxlength', data.login_maxlength);
		$("#login_desc").html((data.login_desc || 'Login'));
		
		if ((data.logo_png || '') != '') {
			$("#logoOficial").attr('src','../img/' + data.logo_png + '.png').css('display','block');
		} else {
			$("#logoOficial").css('display','none');
		}

		if ((data.isCadastro || '') != '') {
			$(".linkAdicionais").append(''
				+ '<div><a href="../create-user">' + data.linkCadastro + '</a></div>'
			);
		}

		if ((data.isForgetPassword || '') != '') {
			$(".linkAdicionais").append(''
				+ '<div><a href="../password-reset">' + data.linkForgetPassword + '</a></div>'
			);
		}
		loaderBg_Global	= data.colorLoadAlert || '#11ACED';
	});
});

$("#formLogin").submit(function(e) {
	e.preventDefault();

	$("#btnLogin").attr('disabled',true).find('i').attr('class','fa fa-spinner fa-pulse');

	$.ajax({
		url: '../controller/login.php'
		, type: 'POST'
		, dataType: 'text'
		, data: { 'loginSystem': true
			, 'login': $("#login").val()
			, 'senha': $("#senha").val()
		}
		, error: function() {
			// alert('Falha ao fazer a requisição!');
			$("#btnLogin").attr('disabled',false).find('i').attr('class','fa fa-sign-in');
		}
	}).done(function(data) {
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		$("#btnLogin").attr('disabled',false).find('i').attr('class','fa fa-sign-in');

		if (data[0].debug == 'OK') {
			data[0].debug = undefined;
			localStorage.setItem('usuario',JSON.stringify(data[0]));
			window.location.assign('../principal');
		} else {
			alert('Login inválido!');
			$("#login").val('')[0].focus();
			$("#senha").val('');
		}
	});
});

var alertOld = alert;
setTimeout(function() {
	alert = function(text, options={}) {
		try {
			$.toast({
				heading: options.head || $(".titulo_pagina").html() || 'Aviso',
				text,
				showHideTransition: options.animation || 'slide',
				icon: options.icon || 'warning',
				position: options.position || "top-right",
				loaderBg: options.loaderBg || loaderBg_Global
			});
		} catch(e) {
			// console.error(e);
			alertOld(text);
		}
	}
}, 500);
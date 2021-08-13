$(function() {
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-blue',
		radioClass: 'iradio_square-blue',
		increaseArea: '20%',
	});
});

var loaderBg_Global;
$(document).ready(function() {
	$.ajax({
		url: '../controller/login.php'
		, type: 'POST'
		, dataType: 'text'
		, data: { 'getConfigForgetPassword': true }
		, error: function() { alert('Falha ao fazer a requisição!'); }
	}).done(function(data) {
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		if ((data.no_set_nome || '') == '') {
			$(".titulo_projeto_login").html((data.nome_projeto || ''));
		}
		$(".titulo_projeto").html((data.nome_projeto || ''));

		if ((data.email_maxlength || '') != '') $("#email").attr('maxlength', data.email_maxlength);
		
		if ((data.logo_png || '') != '') {
			$("#logoOficial").attr('src','../img/' + data.logo_png + '.png').css('display','block');
		} else {
			$("#logoOficial").css('display','none');
		}

		$(".tituloPagina").html(data.link || "Perdeu a Senha?");
		loaderBg_Global	= data.colorLoadAlert || '#11ACED';
	});
});

$("#formEmailPasswordReset").submit(function(e) {
	e.preventDefault();

	$("#btnLogin").attr('disabled',true).find('i').attr('class','fa fa-spinner fa-pulse');

	$.ajax({
		  url: '../controller/login.php'
		, type: 'POST'
		, dataType: 'text'
		, data: { 'passwordReset': true, 'email': $("#email").val() }
		, error: function() {
			alert('Falha ao fazer a requisição!');
			$("#btnLogin").attr('disabled',false).find('i').attr('class','fa fa-send');
		}
	}).done(function(data) {
		console.log(data);
		data = JSON.parse(data);
		console.log(data);

		$("#btnLogin").attr('disabled',false).find('i').attr('class','fa fa-send');

		if (data == '1') {
			$("#obsEnvioEmail").html(''
				+ 'E-mail enviado com sucesso!<br>'
				+ 'Alguns e-mails podem ir para Caixa de Spam, verifique-a, caso não apareça na sua Caixa de Entrada'
			).css('margin-bottom','15px');
			alert('E-mail enviado com sucesso!', { icon: 'success' })
		} else {
			alert('Falha ao enviar email: ' + data);
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
			console.error(e);
			alertOld(text);
		}
	}
}, 500);

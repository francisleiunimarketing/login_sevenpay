var loaderBg_Global;
$(document).ready(function() {
	$.ajax({
		url: '../controller/login.php'
		, type: 'POST'
		, dataType: 'text'
		, data: { 'getConfigCadastro': true }
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

		$(".tituloPagina").html(data.link || "Cadastre-se");

		$(".linkAdicionais").append('<div><a href="../login">' + data.linkLogin + '</a></div>');

		if ((data.isForgetPassword || '') != '') {
			$(".linkAdicionais").append(''
				+ '<div><a href="../password-reset">' + data.linkForgetPassword + '</a></div>'
			);
		}
		loaderBg_Global	= data.colorLoadAlert || '#11ACED';

		form_Global.forEach(function(array, i) {
			Object.keys(form_Global[i]).forEach(function(obj) {
				Object.keys(form_Global[i][obj]).forEach(function(key) {
					var campo = form_Global[i][obj][key];
					// Iniciar evento de keyup para definir o value do campo
					if (key == 'input' && ((campo['id'] || '') != '')) {
						eval(`
						form_Global[${i}]["${obj}"]["${key}"]['onkeyup'] = function() {
							form_Global[${i}]["${obj}"]["${key}"]['value'] = resolvVal("${campo['id']}");
						}`);
					}
					// Iniciar evento de click para definir o value do campo
					if (key == 'input'
						&& (((campo['radio'] || '') != '') || ((campo['checkbox'] || '') != ''))
						&& (((campo['id'] || '') != '') || ((campo['name'] || '') != ''))
					) {
						var identifica = ((campo['id'] || '') != '') ? 'id' : 'name';
						eval(`
						form_Global[${i}]["${obj}"]["${key}"]['onclick'] = function() {
							form_Global[${i}]["${obj}"]["${key}"]['value'] = resolvVal("${campo[identifica]}");
						}`);
					}
				});
			});
		});
		resolvFormCadastro();
	});
});

var cadastroAtual_Global = 0;
var formularioCadastro_Global = {};
$("#formCadastro").submit(function(e) { e.preventDefault(); });

function resolvFormCadastro() {
	var row = [], idFocus = '';
	Object.keys(form_Global[cadastroAtual_Global]).forEach(function(obj) {
		var indice = row.length;
		row.push({});
		Object.keys(form_Global[cadastroAtual_Global][obj]).forEach(function(key) {
			row[indice][key] = form_Global[cadastroAtual_Global][obj][key];
			if ((form_Global[cadastroAtual_Global][obj][key]['autofocus'] || '') != '') {
				idFocus = form_Global[cadastroAtual_Global][obj][key]['id'];
			}
		});
	});

	$("#formCadastroRender").html(
		resolvConfig([ { row }
			, { row: [
				{ div: { id: 'btnsFormRender', ctx: [
					{ button: { desc: 'Voltar', classDiv: 'col-xs-6', class: 'btn btn-default btn-block'
						, style: { 'display': cadastroAtual_Global == 0 ? 'none' : 'block' }
						, styleDiv: { 'margin-top':'10px','padding-left':'0' }
						, click: function() {
							cadastroAtual_Global--;
							resolvFormCadastro();
						}
					} },
					{ button: { desc: cadastroAtual_Global == form_Global.length-1 ? 'Finalizar' : 'Prosseguir'
						, classDiv: 'col-xs-6', class: 'btn btn-block btn-primary'
						, styleDiv: { 'margin-top':'10px','padding-right':'0' }
						, click: function() {
							var form = getForm(form_Global[cadastroAtual_Global]);
							if (!form.valid) return;

							$.ajax({
								url: '../controller/login.php',
								type: 'POST',
								dataType: 'text',
								data: $.extend({}
									, JSON.parse(`{"validForm${cadastroAtual_Global}":true}`)
									, form.param
								),
								error: function() { alert('Falha ao tentar validar o formulario!'); }
							}).done(function(data) {
								console.log(data);
								if (data != '') {
									try {
										data = JSON.parse(data);
										console.log(data);
										alert(data.debug);
									} catch(e) {
										alert(data);
									}
								} else {
									formularioCadastro_Global = $.extend({}, formularioCadastro_Global, form.param);
									if (cadastroAtual_Global == form_Global.length-1) {
										enviarFormulario();
									} else {
										cadastroAtual_Global++;
										resolvFormCadastro();
									}
								}
							});
						}
					} },
				] } }
			] }
		], 0, true)
	);
	setTimeout(function() {
		try { initForm(); } catch(e) {}

		if (idFocus != '')
			try { resolvFocus(idFocus); } catch(e) {}
	}, 100);
}

function enviarFormulario() {
	var param = {}, valid = true;

	var getFormObj = getForm(form_Global, { onlyValuePre: true });
	if (!getFormObj.valid) valid = getFormObj.valid;
	param = getFormObj.param;

	$("#btnsFormRender").find('button').attr('disabled',true);

	param.enviarFormulario = true;
	// console.log(param);

	if (!valid) return;

	$.ajax({
		url: '../controller/login.php'
		, type: 'POST'
		, dataType: 'text'
		, data: param
		, error: function() {
			alert('Falha ao enviar formulario!');
			$("#btnsFormRender").find('button').attr('disabled',false);
		}
	}).done(function(data) {
		console.log(data);
		$("#btnsFormRender").find('button').attr('disabled',false);

		if (data != '1') {
			try {
				data = JSON.parse(data);
				data = data.debug;
			} catch(e) { }
			// return alert('Falha: ' + data);
			return alert('Falha: ' + data, { icon: 'danger' });
		}

		alert('Cadastro feito com sucesso!', { icon: 'success' });
		setTimeout(function() {
			window.location.assign('../login');
		}, 2500);
	});
}

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

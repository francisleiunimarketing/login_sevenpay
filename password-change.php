<?php

include '../controller/constConfig.php';
include '../controller/funcoes.php';
$pdo = getConection();

$key = '';

if (isset($_GET['key'])) $key = $_GET['key'];

$sql = "SELECT 
			USUARIO.ID_USUARIO,
			USUARIO.NOME
		FROM SENHA_RESET
		INNER JOIN USUARIO ON USUARIO.ID_USUARIO = SENHA_RESET.ID_USUARIO
		WHERE SENHA_RESET.HASH = '$key'
		AND TIME_TO_SEC(TIMEDIFF(CURRENT_TIMESTAMP, SENHA_RESET.DT_SENHA_RESET)) <= 18000 -- 5 horas
		AND SENHA_RESET.CK_INATIVO = 0";
// printQuery($sql);
$resultado = padraoResultado($pdo, $sql, 'Nenhum resultado encontrado!');
$resultado = $resultado[0];

?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
	<script>
		if (window.location.href.indexOf('localhost') < 0
			&& window.location.href.indexOf('http://') == 0
		) {
			window.location.assign(window.location.href.replace('http','https'));
		}
	</script>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Esqueci Senha Sevenpay</title>
	<link rel="shortcut icon" href="../img/favicon.ico" type="image/x-icon">
	<link rel="stylesheet" href="loginsevenpay.css">
	<link rel="stylesheet" href="../biblioteca/bower_components/font-awesome/css/font-awesome.min.css">
	<script>
		var ext = (window.location.href.split('.')[1] || '').split('?')[0].split('#')[0];
		if ((['html','php','htm']).indexOf(ext) != -1) {
			var url = window.location.href.split('/');
			window.location.assign(url.splice(0,url.length-1).join('/'));
		}
	</script>
</head>

<body>
<div id="background">
	<main style="padding:40px">
		<!-- <form id='formEmailPasswordReset' action="#" method="post"> -->
			<h2 style="margin-top: 50px;margin-bottom: 15px;">
				<span id="seven">Seven</span>pay<span id="registro">®️</span>
			</h2>
			<div id="divLogin">
<?php
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ($resultado->get('debug') == 'OK') { 
	echo "
				<script>var key = '$key';</script>";
?>
				<script src="./form.js"></script>
				<div class="text-center" style="color:white;">
					<p>Escolha uma nova senha para seu perfil <b><?php echo $resultado->get('NOME'); ?></b></p>
				</div>
				<!-- <div class="form-group has-feedback">
					<input placeholder="E-mail" type="email" id="email" name="email"
						style="width:100%" required autofocus
					>
				</div>
				<div id="obsEnvioEmail" style="color:white;margin-bottom:15px;font-size: 12px;"></div> -->
			</div>

			<div>
				<div class="row" id="formEmalPasswordChange"></div>
				<br>
				<!-- <div class="row">
					<div class="col-xs-5"> -->
				<button onclick="passwordChange();" id="btnLogin">
					<i class="fa fa-check"></i>&nbsp;&nbsp;&nbsp;Redefinir
				</button>
					<!-- </div>
				</div> -->
			</div>
			
			<script>
				function resolvForm() {
					$("#formEmalPasswordChange").html(resolvConfig(form_Global, 0, true));
				}

				function passwordChange() {
					var form = getForm(form_Global);
					if (!form.valid) return;

					form.param.passwordChange = true;
					form.param.key = key;

					$("#btnLogin").attr('disabled',true).find('i').attr('class','fa fa-spinner fa-pulse');

					$.ajax({
						url: '../controller/login.php'
						, type: 'POST'
						, dataType: 'text'
						, data: form.param
						, error: function() {
							alert('Falha ao fazer a requisição!');
							$("#btnLogin").attr('disabled',false).find('i').attr('class','fa fa-check');
						}
					}).done(function(data) {
						console.log(data);
						data = JSON.parse(data);
						console.log(data);

						$("#btnLogin").attr('disabled',false).find('i').attr('class','fa fa-check');

						if (data[0].debug == 'OK') {
							alert('Senha alterado com sucesso!', { icon: 'success' });
							setTimeout(function() {
								window.location.assign('../login');
							}, 2500);
						} else {
							alert('Falha ao redefinir senha: ' + data[0].debug);
							try { $("#senha")[0].focus(); } catch(e) { }
						}
					});
				}
			</script>

<?php
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} else { 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
?>
			<center>
				<h2>Link Expirado</h2>
			</center>
<?php
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
?>

			<!-- <button type="submit" id="btnLogin">
				<i class="fa fa-send"></i> Enviar
			</button> -->

			<div id="links">
				<p id="recuperar">
					<a href="../login">Fazer Login</a>
					<a href="../create-user">Cadastrar-se</a>
				</p>
			</div>
		<!-- </form> -->
	</main>
</div>

<!-- <script src="./lib/jquery.min.js"></script> -->
<script src="../biblioteca/bower_components/jquery/dist/jquery.min.js"></script>
<script src="../biblioteca/bower_components/jquery-mask/jquery.mask.min.js"></script>
<!-- <script src="../biblioteca/bower_components/toast/jquery.toast.min.js"></script> -->
<script src="../js/resolvConfig.min.js"></script>
<script src="./script-password-reset.js"></script>

<script>
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

		$(".tituloPagina").html(data.linkPasswordChange || "Redefinir Senha");
		$(".linkAdicionais").append('<div><a href="../login">' + data.linkLogin + '</a></div>');

		if ((data.isCadastro || '') != '') {
			$(".linkAdicionais").append(''
				+ '<div><a href="../create-user">' + data.linkCadastro + '</a></div>'
			);
		}
		loaderBg_Global	= data.colorLoadAlert || '#11ACED';

		try { resolvForm(); } catch(e) { }
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
</script>

</body>

</html>
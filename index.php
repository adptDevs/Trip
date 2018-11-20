<?php

	if(isset($_GET['user'])){
		$access = $_GET['access'];
		$section = $_GET['section'];
		$user = $_GET['user'];
?>

<!DOCTYPE html>
<html>
<head>
	<title>Development: Trip2.0</title>
	<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
	<meta http-equiv='X-UA-Compatible' content='IE=edge'/>
	<link rel='stylesheet' type='text/css' href='/dhtmlx/codebase/dhtmlx.css'/>
	<script type='text/javascript' src='/dhtmlx/codebase/dhtmlx.js'></script>
	<script type='text/javascript' src='application.js'></script>
	<style>
		html, body{
			width: 100%;
			height: 100%;
			overflow: hidden;
			border: none;
			padding: 0;
			margin: 0;
		}
	</style>

</head>
<body>
	<?php $ini = parse_ini_file('config.ini'); ?>
	<script type='text/javascript'>
		var appLayout = new dhtmlXLayoutObject(
			{
				parent: document.body,
				pattern: '1C',
				cells: [
					{
						id: 'a',
						text: '',
						header: false
					}
				]
			});
		var varName = <?php echo json_encode($ini[directory]); ?>;
		var user = <?php echo json_encode($user); ?>;

		getObjectType(varName);

		// Run ARF in portal
		function getObjectType(varName){
			window[(varName)].runApp(appLayout.cells('a'), <?php echo $access; ?>, "<?php echo $section; ?>", JSON.parse(user));
		}
	</script>

</body>
</html>

<?php
	}
?>
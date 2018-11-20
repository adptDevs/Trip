<?php
	define('IN_ADPT', true);
	// Modify component_connector.php for DHTMLX component being used
	require('/dhtmlx/connector/combo_connector.php');
	require('/dhtmlx/connector/db_config.php');;
	require('/dhtmlx/connector/db_sqlsrv.php');

	$sql_db = 'CommonCore';
	$sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);

	$conn = sqlsrv_connect($sql_server,$sql_conn_info);
	
	if(isset($_GET['isGridCombo'])){
		$sql = 	"SELECT * FROM states";
		$res = sqlsrv_query($conn, $sql);
		$stateArray = array();
		while ($rows = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC)){
			array_push($stateArray,[$rows['abbr'], $rows['name']]);
			}
			echo json_encode($stateArray);

		
		
	}else{
		$combo = new ComboConnector($conn, "SQLSrv");

		$combo->render_table("states","abbr","name,abbr");
	}
?>
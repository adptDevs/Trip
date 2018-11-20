<?php
/**
  * REQUIRED ITEMS -- copy/paste
*/
  define('IN_ADPT', true);
  require("/dhtmlx/connector/form_connector.php");
  require('/dhtmlx/connector/db_config.php');
  require("/dhtmlx/connector/db_sqlsrv.php");

///////////////////////////////////////////////////////////////////////////////////////////////////////////


// DB CONNECTION
  /* Name of DB */
  $sql_db = "Trip_2.0";
  /* REQUIRED FOR DB CONNECTION -- copy/paste */
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

	/**
		* NOTE:
		*  Because the dhtmlxdataprocessor is a POS,
		*  we're updating the DB manually. So.....
		*  Here are the array values:
		*  Array (
		*     [0] => ID
		*     [1] => Address 1
		*     [2] => Address 2
		*     [3] => City
		*     [4] => State
		*     [5] => Zip	
		*/
		
	$updates = json_decode($_GET['updates']);
	
	
	for($i = 0; $i < sizeof($updates); $i++){
			$id = $updates[$i][0];
			$status = $updates[$i][1];
			$address1 = $updates[$i][2];
			$address2 = $updates[$i][3];
			$city = $updates[$i][4];
			$state = $updates[$i][5];
			$zipcode = $updates[$i][6];

			$query = "UPDATE staging SET status = '$status', address = '$address1', address2 = '$address2', city = '$city', state = '$state', zipcode = '$zipcode' WHERE id = $id";

			//$stmt = sqlsrv_query($conn,$query);
	}

?>
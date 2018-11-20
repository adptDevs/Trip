<?php
  define('IN_ADPT', true);
  require("/dhtmlx/connector/form_connector.php");
  require('/dhtmlx/connector/db_config.php');
  require("/dhtmlx/connector/db_sqlsrv.php");
  
  $sql_db = "Trip_2.0";
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);
	
  if(isset($_GET['range'])){
  	$date = $_GET['range'];
  	$query = "SELECT TOP 10 state, COUNT(state) AS counter FROM archive WHERE entrydate > '$date' GROUP BY state ORDER BY COUNT(state) DESC";
  }else{
  	$query = "SELECT state, COUNT(state) AS counter FROM archive GROUP BY state ORDER BY COUNT(state) DESC";
  }
  $statesArray = array();


$stmt = sqlsrv_query($conn,$query);

if($stmt){
	$index = 0;
	while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
		$rand = dechex(rand(0x000000, 0xFFFFFF));
		$color = '#' . $rand;
		if($index < 10){
			array_push($statesArray, array('' . $rows['counter'] . '',$rows['state'],$color));
		}
		$index++;
	}
}
  
// CREATE JSON STYLE
$jsonObject = "[";
for($i = 0; $i < sizeof($statesArray); $i++){
	$jsonObject .= "{ id: " . $i . " ,states1: '" . $statesArray[$i][0] . "', states2: '" . $statesArray[$i][1] . "', color: '" . $statesArray[$i][2] . "' },";
}
$jsonObject = trim($jsonObject, ",");
$jsonObject .= "]";



/**
	* EXPECTED OUTPUT:
	*				[
	*					{ Items: "", label: "", color: "" },
	*					...
	*				]
	*/

echo json_encode($jsonObject);
	
 ?>
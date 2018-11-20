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
  	$query = "SELECT TOP 10 source, COUNT(source) AS counter FROM viewArchiveMediaSources WHERE entrydate > '$date' GROUP BY source ORDER BY COUNT(source) DESC";
  }else{
  	$query = "SELECT source, COUNT(source) AS counter FROM viewArchiveMediaSources GROUP BY source ORDER BY COUNT(source) DESC";
  }
  $categoryArray = array();


$stmt = sqlsrv_query($conn,$query);
$color = array("#023852", "#196E73", "#F3D191", "#F69B54", "#B63355", "#8BAA4C", "#F7921E");
$counter = 0;
if($stmt){
	while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
		array_push($categoryArray, array('' . $rows['counter'] . '',$rows['source'],$color[$counter]));
		$counter++;
	}
}
  
// CREATE JSON STYLE
$jsonObject = "[";
for($i = 0; $i < sizeof($categoryArray); $i++){
	$jsonObject .= "{ Items: '" . $categoryArray[$i][0] . "', label: '" . $categoryArray[$i][1] . "', color: '" . $categoryArray[$i][2] . "' },";
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
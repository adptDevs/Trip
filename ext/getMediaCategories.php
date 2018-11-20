<?php
  define('IN_ADPT', true);
  require('/dhtmlx/connector/db_config.php');
  require("/dhtmlx/connector/db_sqlsrv.php");
  
  $sql_db = "Trip_2.0";
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);
	
// GET COUNT OF ALL RECORDS (OR RECORDS ON DATE RANGE)
  if(isset($_GET['range'])){
  	$date = $_GET['range'];
  	$query = "SELECT TOP 10 category, COUNT(category) AS counter FROM viewArchiveMediaCodes WHERE entrydate > '$date' GROUP BY category ORDER BY COUNT(category) DESC";
  }else{
  	$query = "SELECT category, COUNT(category) AS counter FROM viewArchiveMediaCodes GROUP BY category ORDER BY COUNT(category) DESC";
  }

// CREATE ARRAY TO STORE RECORDS FOR CREATING THE JSON OBJECT
  $categoryArray = array();


// EXECUTE QUERY
$stmt = sqlsrv_query($conn,$query);

// CREATE COLOR ARRAY (HARD-CODED COLOR HEX VALUES) -- CHOOSE ANY COLORS YOU WANT
// CREATE COUNTER VARIABLE EQUAL TO NUMBER OF COLORS YOU CHOSE
/*
  NOTE:
    ONLY CHOOSE THE NUMBER OF COLORS BASED ON HOW MANY RECORDS ARE RETURNED FROM QUERY
    IN THIS CASE, ONLY 5 RECORDS ARE RETURNED
 */
$color = array("#B6A37C", "#E4DCA4", "#49402F", "#A55723", "#E77917", "#8BAA4C");
$counter = 5;

// IF QUERY IS SUCCESSFUL, LOOP OVER RECORDS AND PUSH THE FOLLOWING INTO $categoryArray
// 1.) count of category ($rows['counter'])
// 2.) category name ($rows['category'])
// 3.) color value ($color[$counter])
if($stmt){
	while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
		array_push($categoryArray, array('' . $rows['counter'] . '',$rows['category'],$color[$counter]));
		$counter--;
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
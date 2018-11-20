<?php
  define('IN_ADPT', true);
  require("/dhtmlx/connector/form_connector.php");
  require('/dhtmlx/connector/db_config.php');
  require("/dhtmlx/connector/db_sqlsrv.php");
  
  $sql_db = "Trip_2.0";
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);
	
  if(isset($_GET['id'])){
  	switch($_GET['id']){
  		// Top 10 states via arkansas.com
  		// bar graph
  		case '1':
  			$minDate = date('Y-m-d', strtotime('first day of previous month'));
  			$maxDate = date('Y-m-d', strtotime('last day of previous month'));
  			$query = "SELECT state, COUNT(state) AS counter FROM viewArchiveMediaCodes WHERE category LIKE 'Arkansas.com%' AND entryDate >= '$minDate' and entryDate <= '$maxDate' GROUP BY state ORDER BY COUNT(state) DESC";

  			$statesArray = array();

			$stmt = sqlsrv_query($conn,$query);
			if($stmt){
				$color = "#D9EAFF";
				while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
					array_push($statesArray, array('' . $rows['counter'] . '',$rows['state'],$color));
				}
			}
			  
			// CREATE JSON STYLE
			$jsonObject = "[";
			for($i = 0; $i < sizeof($statesArray); $i++){
				$jsonObject .= "{ id: " . $i . " ,states1: '" . $statesArray[$i][0] . "', states2: '" . $statesArray[$i][1] . "', color: '" . $statesArray[$i][2] . "' },";
			}
			$jsonObject = trim($jsonObject, ",");
			$jsonObject .= "]";

			echo json_encode($jsonObject);
  			break;

  		default:
  			break;
  	}

 }
  		
?>
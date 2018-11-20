<?php
define('IN_ADPT', true);
  require('/dhtmlx/connector/db_config.php');
  require("/dhtmlx/connector/db_sqlsrv.php");
//code below is simplified - in real app you will want to have some kins session based autorization and input value checking
//error_reporting(E_ALL ^ E_NOTICE);

function add_row($cn){
	global $newId;
	
	$sql = 	"INSERT INTO blacklistNames(name,action)
			VALUES ('".$_POST["c0"]."',
					'1')";

	$res = sqlsrv_query($cn, $sql);
	if($res === false){
		if( ($errors = sqlsrv_errors() ) != null) {
			$errorStr = "";
	        foreach( $errors as $error ) {
	            $errorStr .= "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
	            $errorStr .= "code: ".$error[ 'code']."<br />";
	            $errorStr .= "message: ".$error[ 'message']."<br />";
	        }
	    }
	    return "error";
	}
	//set value to use in response
	$newId = 0;
	$query = sqlsrv_query($cn, "SELECT @@identity AS id");
	if($row = sqlsrv_fetch_array($query, SQLSRV_FETCH_ASSOC)){
		$newId = $row['id'];
		return "insert";
	}
	
	return "error";	
}

function update_row($cn){
	$sql = 	"UPDATE blacklistNames SET  name='".$_POST["c0"]."',
					action= '".$_POST["c1"]."'

			WHERE id=".$_POST["gr_id"];
	$res = sqlsrv_query($cn, $sql);
	
	return "update";	
}

function delete_row($cn){

	$d_sql = "DELETE FROM blacklistNames WHERE id=".$_POST["gr_id"];
	$resDel = sqlsrv_query($cn, $d_sql);
	return "delete";	
}


//include XML Header (as response will be in xml format)
header("Content-type: text/xml");
//encoding may differ in your case
echo('<?xml version="1.0" encoding="iso-8859-1"?>');


$mode = $_POST["!nativeeditor_status"]; //get request mode
$rowId = $_POST["gr_id"]; //id or row which was updated 
$newId = $_POST["gr_id"]; //will be used for insert operation

$sql_db = 'Trip_2.0';
$sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
$conn = sqlsrv_connect($sql_server,$sql_conn_info);

switch($mode){
	case "inserted":
		//row adding request
		$action = add_row($conn);
	break;
	case "deleted":
		//row deleting request
		$action = delete_row($conn);
	break;
	default:
		//row updating request
		$action = update_row($conn);
	break;
}

//output update results
echo "<data>";
echo '<action type="' . $action . '" sid="' . $rowId . '" tid="' . $newId . '" />';
echo "</data>";

?>
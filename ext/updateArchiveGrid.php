<?php
define('IN_ADPT', true);
require('/dhtmlx/connector/db_config.php');
require("/dhtmlx/connector/db_sqlsrv.php");

function update_row($cn){
	$sql = 	"UPDATE archive SET state='".$_POST["c7"]."',
					zipcode='".$_POST["c8"]."'
					
			 WHERE id=".$_POST["gr_id"];

	$res = sqlsrv_query($cn, $sql);
	
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


	return "update";	



}

//include XML Header (as response will be in xml format)
header("Content-type: text/xml");
//encoding may differ in your case
echo('<?xml version="1.0" encoding="iso-8859-1"?>');

$rowId = $_POST["gr_id"]; //id or row which was updated 
$sql_db = 'Trip_2.0';
$sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
$conn = sqlsrv_connect($sql_server,$sql_conn_info);

//row updating request
$action = update_row($conn);


//output update results
echo "<data>";
echo '<action type="' . $action . '" sid="' . $rowId . '"/>';
echo "</data>";

?>
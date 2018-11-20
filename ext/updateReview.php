<?php
/**
  * REQUIRED ITEMS -- copy/paste
*/
  define('IN_ADPT', true);

  require('/dhtmlx/connector/db_config.php');
  require("/dhtmlx/connector/db_sqlsrv.php");
  
  	function clean($string){
  		return preg_replace("[^A-Za-z1-9 ]", "''", $string);
  	}
  
	function update_row($cn){
		$sql = 	"UPDATE staging SET status='".$_POST["c2"]."',
				address=	'".clean($_POST["c6"])."',
				address2=	'".clean($_POST["c7"])."',
				city=		'".str_replace("'", "''", $_POST["c8"])."',
				state=		'".$_POST["c9"]."',
				zipcode=	'".$_POST["c10"]."',
				zone=	'".$_POST["c11"]."',
				country=	'".$_POST["c12"]."'
				WHERE id=".$_POST["c1"];
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


	$mode = $_POST["!nativeeditor_status"]; //get request mode
	$rowId = $_POST["gr_id"]; //id or row which was updated 
	$newId = $_POST["gr_id"]; //will be used for insert operation

	// DB CONNECTION
	/* Name of DB */
	$sql_db = "Trip_2.0";
	/* REQUIRED FOR DB CONNECTION -- copy/paste */
	$sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
	$conn = sqlsrv_connect($sql_server,$sql_conn_info);
	
	$action = update_row($conn);

	



	//output update results
	echo "<data>";
	echo "<action type='".$action."' sid='".$rowId."' tid='".$rowId."'/>";
	echo "</data>";
 ?> 
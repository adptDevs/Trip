<?php
define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');
ini_set('display_errors', 'On');
error_reporting(E_ALL);
  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);

  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $gridConn = new GridConnector($conn, 'SQLSrv');

  //$gridConn->render_complex_sql("SELECT * FROM staging WHERE status = 'R'","id","id, status, entrydate, firstname, lastname,address, address2, city, state, zipcode, country, phone, emailaddress, brochures,reviewItem");
  
  $query = "SELECT A.*, B.source FROM staging A INNER JOIN mediaSources B ON A.mediasource = B.number WHERE status = 'R'";
  // 11/15/2018 EDIT, we now point to 'number' column instead of vendorID. There was an odd change in the system, therefore, the number column seems to line up with the sources.
  //$query = "SELECT * FROM staging";
  $stmt = sqlsrv_query($conn,$query);

  //include XML Header (as response will be in xml format)
  header("Content-type: text/xml");
  //encoding may differ in your case
  echo('<?xml version="1.0" encoding="utf8"?>');


$index = 1;
$xmlString = "<rows>";

while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){

//echo $row["dupID"];
//print_r($row);
if($row["dupID"] != ''){
	$xmlString .= '<row id="' . $index . '" megan="mean">';
  	$xmlString .= '<cell type="sub_row_grid"><![CDATA[/_apps/trip2/ext/subGridGenerator.php?dupeIDs='.$row["dupID"].']]></cell>';
  	//echo $row["dupID"];
}else{
	$xmlString .= '<row id="' . $index . '">';
	$xmlString .= '<cell></cell>';
}
//$firstName = preg_replace('/&(?!#?[a-z0-9]+;)/', '&amp;', $row["firstname"]);

$xmlString .= '<cell>'. $row["id"]. '</cell>';
$xmlString .= '<cell>'. $row["status"]. '</cell>';
$xmlString .= '<cell>'. date_format($row["entrydate"], "Y-m-d"). '</cell>';
$xmlString .= '<cell><![CDATA['. $row["firstname"]. ']]></cell>';
$xmlString .= '<cell><![CDATA['. $row["lastname"]. ']]></cell>';
$xmlString .= '<cell><![CDATA['. $row["address"]. ']]></cell>';
$xmlString .= '<cell><![CDATA['. $row["address2"]. ']]></cell>';
$xmlString .= '<cell><![CDATA['. $row["city"]. ']]></cell>';
$xmlString .= '<cell>'. $row["state"]. '</cell>';
$xmlString .= '<cell><![CDATA['. $row["zipcode"]. ']]></cell>';
$xmlString .= '<cell><![CDATA['. $row["zone"]. ']]></cell>';
$xmlString .= '<cell>'. $row["country"]. '</cell>';
$xmlString .= '<cell><![CDATA['. $row["phone"]. ']]></cell>';
$xmlString .= '<cell><![CDATA['. $row["emailaddress"]. ']]></cell>';
$xmlString .= '<cell>'. $row["source"]. '</cell>';
$xmlString .= '<cell>'. $row["brochures"]. '</cell>';
$xmlString .= '<cell>'. $row["reviewItem"]. '</cell>';
//$xmlString .= '<cell>'. $row["dupID"]. '</cell>';


$xmlString .= '</row>';
$index++;

}

$xmlString .= '</rows>';
echo $xmlString;



?>
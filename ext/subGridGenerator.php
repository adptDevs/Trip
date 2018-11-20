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


  $dupeIDs = $_GET['dupeIDs'];




  $dupeQuery = "SELECT * FROM archive WHERE id IN ($dupeIDs)";
  $stmt = sqlsrv_query($conn,$dupeQuery);
  $subrowString = "<rows>";
  $subrowString .= "<head style='display:none;'>";
  $subrowString .= "<column width='30' type='ro' align='left' color='orange' sort='str'></column>";
  $subrowString .= "<column width='150' type='ro' align='left' color='orange' sort='str'>Date</column>";
  $subrowString .= "<column width='200' type='ro' align='left' color='orange' sort='str'>First Name</column>";
  $subrowString .= "<column width='200' type='ro' align='left' color='orange' sort='str'>Last Name</column>";
  $subrowString .= "<column width='100' type='ro' align='left' color='orange' sort='str'>Address</column>";
  $subrowString .= "<column width='70' type='ro' align='left' color='orange' sort='str'>Address 2</column>";
  $subrowString .= "<column width='100' type='ro' align='left' color='orange' sort='str'>City</column>";
  $subrowString .= "<column width='100' type='ro' align='left' color='orange' sort='str'>State</column>";
  $subrowString .= "<column width='150' type='ro' align='left' color='orange' sort='str'>Zip</column>";
  $subrowString .= "<column width='200' type='ro' align='left' color='orange' sort='str'>Country</column>";
  $subrowString .= "<column width='200' type='ro' align='left' color='orange' sort='str'>Phone</column>";
  $subrowString .= "<column width='100' type='ro' align='left' color='orange' sort='str'>Email</column>";
  $subrowString .= "<column width='210' type='ro' align='left' color='orange' sort='str'>Brochures</column>";
  $subrowString .= "</head>";
  $index = 1;

while($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
	$subrowString .= "<row id='" . $index . "'>";

	// $subrowString .= '<cell>'. $row["status"]. '</cell>';
	$subrowString .= '<cell></cell>';
	$subrowString .= '<cell>'. date_format($row["entrydate"], "Y-m-d"). '</cell>';
	$subrowString .= '<cell>'. $row["firstname"]. '</cell>';
	$subrowString .= '<cell>'. $row["lastname"]. '</cell>';
	$subrowString .= '<cell>'. $row["address"]. '</cell>';
	$subrowString .= '<cell>'. $row["address2"]. '</cell>';
	$subrowString .= '<cell>'. $row["city"]. '</cell>';
	$subrowString .= '<cell>'. $row["state"]. '</cell>';
	$subrowString .= '<cell>'. $row["zipcode"]. '</cell>';
	$subrowString .= '<cell>'. $row["country"]. '</cell>';
	$subrowString .= '<cell>'. $row["phone"]. '</cell>';
	$subrowString .= '<cell>'. $row["emailaddress"]. '</cell>';
	$subrowString .= '<cell>'. $row["brochures"]. '</cell>';
	//$subrowString .= '<cell>'. $row["reviewItem"]. '</cell>';
	$subrowString .= "</row>";


	$index++;

}

$subrowString .= "</rows>";
echo $subrowString;





?>
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

  $sql = "SELECT * FROM suspendDates";
  $res = sqlsrv_query($conn, $sql);

  $jsonString = "[";
  $counter = 1;
  while($rows = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC)){
    $year = ($rows['year'] == '0000' ? date("Y") : $rows['year']);
    $jsonString .= "{id: $counter, text: 'Date Suspension', start_date: '".$year."-".$rows["month"]."-".$rows["day"]." 00:00', end_date: '".$year."-".$rows["month"]."-".$rows["day"]." 23:55'},";
    $counter++;
  }
  $jsonString = rtrim($jsonString, ",");
  $jsonString .= "]";

  echo json_encode($jsonString);

?>
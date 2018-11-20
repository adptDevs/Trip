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

// Get all variable config values
  $sql = "SELECT * FROM variableConfig";
  $res = sqlsrv_query($conn, $sql);

// Create array to hold those values (because we're sending it back to JS)
  $vConfigs = array();

// Loop through the found set from the select statement
  while($rows = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC)){
    // store values inside array
    array_push($vConfigs, [trim($rows['variableName']), trim($rows['value'])]);
  }

// Display back to JS
  echo json_encode($vConfigs);

?>
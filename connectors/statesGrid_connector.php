<?php
  define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');

  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);

  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $gridConn = new GridConnector($conn, 'SQLSrv');

  $minDate = date('Y-m-d', strtotime('first day of previous month'));
  $maxDate = date('Y-m-d', strtotime('last day of previous month'));
  $gridConn->render_complex_sql("SELECT name, COUNT(name) AS counter FROM viewArchiveMediaCodes WHERE category LIKE 'Arkansas.com%' AND entryDate >= '$minDate' and entryDate <= '$maxDate' GROUP BY name ORDER BY name ASC","id","name,counter");
?>
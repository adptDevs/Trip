<?php
  define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');

  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);

  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $gridConn = new GridConnector($conn, 'SQLSrv');


  if(isset($_GET['All'])){

        $gridConn->render_table("processLog_vw","logID", "process, startTime, fileName, validRecords, errorRecords, processed");

  }else{

    $from = $_GET['from'];
    $to = $_GET['to'];

    $dateQuery = ($to != '' ? "convert(char(10),startTime,120) BETWEEN '$from' AND '$to'" : "(convert(char(10),startTime,120) >= '$from')");

    $gridConn->render_sql("SELECT * FROM processLog_vw WHERE " . $dateQuery . "","logID", "process, startTime, fileName, validRecords, errorRecords, processed");
  }

?>
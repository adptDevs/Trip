<?php
  define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');

  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);

  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $gridConn = new GridConnector($conn, 'SQLSrv');

// DID THE USER REQUEST ALL RECORDS OR A DATE RANGE?

// IF ALL, THEN SELECT ALL FROM THE ARCHIVE TABLE
  if(isset($_GET['All'])){
    $gridConn->render_sql("SELECT * FROM archive","id","status, processdate, firstname, lastname, address, address2, city, state, zipcode, country, phone, email, brochures");

// OTHERWISE, CREATE THE DATE RANGE QUERY
  }else{
// GET THE 'TO' AND 'FROM' VALUES
    $from = $_GET['from'];
    $to = $_GET['to'];

// CREATE THE DATEQUERY
//    NOTE:
//          WE ALLOW THE USER TO EITHER ENTER A VALUE INTO THE FROM FIELD AND THE TO FIELD OR JUST THE FROM FIELD.
//          SO, WE USE A TERNARY OPERATION TO CHECK IF THE 'TO' FIELD HAS A VALUE.
//          IF IT DOES, THEN OUTPUT THE FOLLOWING EXAMPLE:
//                    (processdate >= '2016-09-21' OR processdate <= '2016-10-20')
//          HOWEVER, IF THE USER JUST ENTERS A VALUE INTO THE 'FROM' FIELD AND NOTHING IN THE 'TO' FIELD,
//          THEN OUTPUT THE FOLLOWING EXAMPLE:
//                    (processdate >= '2016-09-21')
    $dateQuery = ($to != '' ? "processdate BETWEEN '$from' AND '$to'" : "(processdate >= '$from')");

// THEN CONCATENATE THE ABOVE QUERY TO THE PREDICATE PART OF THE SELECT STATEMENT.
// IT COULD LOOK LIKE THE FOLLOWING
//          "SELECT * FROM archive WHERE (processdate >= '2016-09-21' OR processdate <= '2016-10-20')"
//                  OR
//           "SELECT * FROM archive WHERE (processdate >= '2016-09-21')"

    //echo "SELECT * FROM archive WHERE " . $dateQuery . "";
    $gridConn->render_sql("SELECT * FROM archive WHERE " . $dateQuery . "","id","status, processdate, firstname, lastname, address, address2, city, state, zipcode, country, phone, email, brochures");
  }
  
?>
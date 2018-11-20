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


    $fName = $_GET['fName'];
    $lName = $_GET['lName'];
   

    if($fName != ''){
      $query = "INSERT INTO whitelistNames (name,action) VALUES ('$fName','1')";
      $stmt = sqlsrv_prepare($conn,$query);

      if(sqlsrv_execute($stmt) == false){
        print "<pre>";
        die( print_r( sqlsrv_errors(), true));
      }
    }

    if($lName != ''){
      $query = "INSERT INTO whitelistNames (name,action) VALUES ('$lName','1')";
      $stmt = sqlsrv_prepare($conn,$query);

      if(sqlsrv_execute($stmt) == false){
        print "<pre>";
        die( print_r( sqlsrv_errors(), true));
      }
    }

?>
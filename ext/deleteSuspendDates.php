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

  $date = json_decode($_POST['date']);
  $year = $date[0][0];
  $month = $date[0][1];
  $day = $date[0][2];

  $sql = "DELETE FROM suspendDates WHERE month = '$month' AND day = '$day'";
  $res = sqlsrv_query($conn, $sql);
    if($res === false){
      if( ($errors = sqlsrv_errors() ) != null) {
        $errorStr = "";
            foreach( $errors as $error ) {
                $errorStr .= "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
                $errorStr .= "code: ".$error[ 'code']."<br />";
                $errorStr .= "message: ".$error[ 'message']."<br />";
            }
        }
        echo "error";
    }else{
      echo 'success';
    }

?>
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

  if(isset($_GET['isNames'])){
    $fName = $_GET['fName'];
    $lName = $_GET['lName'];
    $action = $_GET['action'];

   if($fName != ''){
      $query = "INSERT INTO blacklistNames (name, action) VALUES ('$fName', $action)";
      $stmt = sqlsrv_prepare($conn,$query);

    if(sqlsrv_execute($stmt) == false){
      print "<pre>";
      die( print_r( sqlsrv_errors(), true));
    }
    }

     if($lName != ''){
      $query = "INSERT INTO blacklistNames (name, action) VALUES ('$lName', $action)";
      $stmt = sqlsrv_prepare($conn,$query);

    if(sqlsrv_execute($stmt) == false){
      print "<pre>";
      die( print_r( sqlsrv_errors(), true));
    }
   }


}

  if(isset($_GET['isAddresses'])){
    $address = $_GET['address'];
    $address2 = $_GET['address2'];
    $city = $_GET['city'];
    $state = $_GET['state'];
    $zipcode = explode("-", $_GET['zipcode']);
    $firstZip = $zipcode[0];
    $plus4Zip = $zipcode[1]; 
    $aNotes = $_GET['blacklistNotes'];
    $action = $_GET['action'];

// INSERT INTO blacklistAddresses
     $query = "INSERT INTO blacklistAddresses (address, address2, city, state, zipcode, plus4, notes, action) VALUES ('$address','$address2','$city','$state','$firstZip','$plus4Zip','$aNotes',$action)";
     $stmt = sqlsrv_prepare($conn,$query);


  


    if(sqlsrv_execute($stmt) == false){
      print "<pre>";
      die( print_r( sqlsrv_errors(), true));
    }
  }


  $gridID = $_GET['gridID'];

$query = "UPDATE staging SET status = 'D' WHERE id = $gridID";
$stmt = sqlsrv_prepare($conn,$query);

    if(sqlsrv_execute($stmt) == false){
      print "<pre>";
      die( print_r( sqlsrv_errors(), true));
    }

// 3.) Create variable to hold $_GET['gridID'];


// 4.) Update record in staging table
//      i.e.
//        $query = "UPDATE staging SET status = 'D' WHERE id = $gridID"
//        ( Check database for columns names because I can't remember :) )


?>
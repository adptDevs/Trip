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

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// NOW THE FUN STUFF!!!.....KINDA
  /* DHX OBJECT */
  /**
    * NOTE: This is the same for every DHX object.
    *       You will have a variable ($myVariable)
    *       set to a new <objectName>Connector.
    *       You will always use the same parameters
    *       EX.)
    *           $myVariable = new <DHX object name>Connector($conn, "SQLSrv");
    */
  $form = new FormConnector($conn, "SQLSrv");

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// NOW FOR THE ACTUAL FUN STUFF!....I PROMISE!!!

  /* Set variables to $_GET[] params sent by JS (if you sent any) */
  $entrydate = date("Y-m-d");

  $Fname = $_GET['Fname'];
  $Lname = $_GET['Lname'];
  $address = $_GET['address'];
  $address2 = $_GET['address2'];
  $city = $_GET['city'];
  $state = $_GET['state'];
  $zip = $_GET['zip'];
  $phoneNumber = $_GET['phoneNumber'];
  $email = $_GET['email'];
  $notes = $_GET['notes'];


  $packages = explode(",", $_GET['packageList']);

  $brochureString = "0000000000000000000000000";

  $query= "SELECT * FROM brochures";
  $stmt = sqlsrv_query($conn,$query);
  while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
    $item =  "" . strtolower($rows['abbr']) . "";
    if (in_array($item, $packages)){
      $pos= (int)$rows["idpos"];
      $brochureString = substr_replace($brochureString, "1", $pos-1, 0);
    }
  }

  $removedZeros = 0 - sizeof($packages);
  $brochureString = substr($brochureString, 0, $removedZeros);
  

  /* Write your query */
  /**
    * NOTE: Use the same variable you used to set to the
    *       connector object. Then use DHX function to
    *       send query to DB. Go to:
    *       http://docs.dhtmlx.com/connector__php__connector_object_methods.html#rendertable
    *       to see examples of their functions to send queries to DB.
    *       Also, the one below is not in their docs. This
    *       was given to us in a support-ticket response
    *       that we sent because we wanted to write custom
    *       queries.
    */
  //$form->sql->query("INSERT INTO staging (status, entrydate, firstname, lastname, address, address2, city, state, zipcode, country, phone, emailaddress, mediasource, brochures, [foreign], reviewItem) VALUES ('P', '$entrydate', '$Fname', '$Lname', '$address', '$address2', '$city', '$state', '$zip', 'United States', '$phoneNumber', '$email', 5, '$brochureString', 0, '')");

  $query = "INSERT INTO staging (status, entrydate, firstname, lastname, address, address2, city, state, zipcode, country, phone, emailaddress, mediasource, brochures, [foreign], reviewItem) VALUES ('S', '$entrydate', '$Fname', '$Lname', '$address', '$address2', '$city', '$state', '$zip', 'United States', '$phoneNumber', '$email', 5, '$brochureString', 0, '')";
  //echo $query;
  $stmt = sqlsrv_prepare($conn,$query);

  if(sqlsrv_execute($stmt) == false){
    print "<pre>";
    die( print_r( sqlsrv_errors(), true));
  }else{
    echo 'success';
  }
////////////////////////////////////////////////////////////////////////////////////////////




// CUSTOM CODE PROVIDED BY STACEY
  /**
    * NOTE: Most likely you will not need this.
    *       It's situational and DHX provides
    *       most of everything we need anyways.
    */
  // Execute queries and stored procedures
  function exeQry($conn,$query,$isReturn){
    if($isReturn){
      $stmt = sqlsrv_query($conn,$query);
      $rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
      return $rows;
    }else{
      $stmt = sqlsrv_prepare($conn,$query);

      if(sqlsrv_execute($stmt) == false){
        print "<pre>";
        die( print_r( sqlsrv_errors(), true));
      }
    }
  }




?>
<?php
  define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');

  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $from = $_GET['from'];
  $to = $_GET['to'];

  $onlinePath = "/_apps/trip2/ext/getConversionReport.php?isOnline=true&from=". $from ."&to=". $to;
  $traditionalPath = "/_apps/trip2/ext/getConversionReport.php?isTraditional=true&from=". $from ."&to=". $to;


  function outPutXML($qry, $c){
    $stmt = sqlsrv_query($c,$qry);
    if($stmt){
      $index = 1;
      while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
        // Out put XML
        echo "<row id='" . $index . "'>";
        echo "<cell>" . $rows['category'] . "</cell>";
        echo "<cell>" . $rows['Total'] . "</cell>";
        echo "</row>";

        $index++;
      }

    }
  }

  $query1 = "SELECT category, COUNT(*) AS Total
                FROM viewArchiveMediaCodes WHERE entrydate >= '$from' AND entrydate <= '$to' AND (category = 'Internet' OR category = 'Arkansas.com') GROUP BY category";

  $query2 = "SELECT category, COUNT(*) AS Total
      FROM viewArchiveMediaCodes WHERE entrydate >= '$from' AND entrydate <= '$to' AND (category <> 'Internet' AND category <> 'Arkansas.com') GROUP BY category";


  //include XML Header (as response will be in xml format)
  header("Content-type: text/xml");
  //encoding may differ in your case
  echo('<?xml version="1.0" encoding="iso-8859-1"?>');
  echo "<rows>";
  echo '<row id="' . 1 . '">';
  echo "<cell type='sub_row_grid'>";

  echo "<rows>";
    echo "<head>";
    echo "<column width='150' type='ro' align='left' color='white' sort='str'>Sub-Media</column>";
    echo "<column width='150' type='ro' align='left' color='white' sort='str'>" . $from . "</column>";
    echo "<column width='*' type='ro' align='left' color='white' sort='str'>" . $to . " YTD</column>";
    echo "</head>";
  outPutXML($query1, $conn);
  echo "</rows>";

  echo "</cell>";
  echo "<cell>Online Media</cell>";
  echo "</row>";
  echo '<row id="' . 2 . '">';
  echo "<cell type='sub_row_grid'>";

  echo "<rows>";
    echo "<head>";
    echo "<column width='150' type='ro' align='left' color='white' sort='str'>Sub-Media</column>";
    echo "<column width='150' type='ro' align='left' color='white' sort='str'>" . $from . "</column>";
    echo "<column width='*' type='ro' align='left' color='white' sort='str'>" . $to . " YTD</column>";
    echo "</head>";
  outPutXML($query2, $conn);
  echo "</rows>";

  echo "</cell>";
  echo "<cell>Traditional Media</cell>";
  echo "</row>";
  echo "</rows>";



?>
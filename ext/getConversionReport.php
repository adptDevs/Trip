<?php
  define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');

  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $from = $_GET['from'];
  $to = ($_GET['to'] != '' ? $_GET['to'] : date("Y-m-d");

  $mons = array(1 => "January", 2 => "Feburary", 3 => "March", 4 => "Apri", 5 => "May", 6 => "June", 7 => "July", 8 => "August", 9 => "September", 10 => "October", 11 => "November", 12 => "December");

  //include XML Header (as response will be in xml format)
  header("Content-type: text/xml");
  //encoding may differ in your case
  echo('<?xml version="1.0" encoding="iso-8859-1"?>');
  echo "<rows>";
  echo "<head>";
  echo "<column width='150' type='ro' align='left' color='white' sort='str'>Sub-Media</column>";
  echo "<column width='150' type='ro' align='left' color='white' sort='str'>" . $from . "</column>";
  echo "<column width='*' type='ro' align='left' color='white' sort='str'>" . $to . " YTD</column>";
  echo "</head>";

  function outPutXML($qry, $c){
  	$stmt = sqlsrv_query($c,$qry);
		if($stmt){
			$index = 1;
			while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
				// Calculate percent change
				$current = intval($rows['Cur']);
				$previous = intval($rows['Prev']);
        $total = intval($rows['Total']);

        $currentPercent = ($current/$total)*100 . "%";
        $previousPercent = ($previous/$total)*100 . "%";

				// Out put XML
				echo "<row id='" . $index . "'>";
				echo "<cell>" . $rows['category'] . "</cell>";
				echo "<cell>" . $rows['Cur'] . "</cell>";
				echo "<cell>" . $rows['Prev'] . "</cell>";
				echo "</row>";

				$index++;
			}

		}
  }

  switch(true){
  	case isset($_GET['isOnline']):
  		$query = "SELECT category, COUNT(*) AS Total
                FROM viewArchiveMediaCodes WHERE entrydate >= '$from' AND entrydate <= '$to' AND (category = 'Internet' OR category = 'Arkansas.com') GROUP BY category";
		
		outPutXML($query, $conn);
  		break;

  	case isset($_GET['isTraditional']):
  		$query = "SELECT category, COUNT(*) AS Total
      FROM viewArchiveMediaCodes WHERE entrydate >= '$from' AND entrydate <= '$to' AND (category <> 'Internet' AND category <> 'Arkansas.com') GROUP BY category";
		
		outPutXML($query, $conn);
  		break;

  	default:
  		break;
  }

  echo "</rows>";

?>
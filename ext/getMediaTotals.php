<?php
  define('IN_ADPT', true);

  require('/dhtmlx/connector/grid_connector.php');
  require('/dhtmlx/connector/db_config.php');
  require('/dhtmlx/connector/db_sqlsrv.php');

  $sql_db = 'Trip_2.0';
  $sql_conn_info = array('Database'=>$sql_db, 'UID'=>$sql_user, 'PWD'=>$sql_pass);
  $conn = sqlsrv_connect($sql_server,$sql_conn_info);

  $currentYear = date("Y");
  $lastYear = $currentYear - 1;

  //include XML Header (as response will be in xml format)
  header("Content-type: text/xml");
  //encoding may differ in your case
  echo('<?xml version="1.0" encoding="iso-8859-1"?>');
  echo "<rows>";
  echo "<head>";
  echo "<column width='150' type='ro' align='left' color='white' sort='str'>Sub-Media</column>";
  echo "<column width='150' type='ro' align='left' color='white' sort='str'>" . $currentYear . "</column>";
  echo "<column width='150' type='ro' align='left' color='white' sort='str'>" . $lastYear . "</column>";
  echo "<column width='*' type='ro' align='left' color='white' sort='str'>% Change</column>";
  echo "</head>";

  function outPutXML($qry, $c){
  	$stmt = sqlsrv_query($c,$qry);
		if($stmt){
			$index = 1;
			while($rows = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)){
				// Calculate percent change
				$value = 0;
				$current = intval($rows['Cur']);
				$previous = intval($rows['Prev']);
				$previous = 1;
				if($rows['Cur'] >= $rows['Prev']){
					// Percent increase
					$value = (($current - $previous)/$previous)*100 . "%";
				}else{
					// Percent decrease
					$value = "-" . (($previous - $current)/$previous)*100 . "%";
				}

				// Out put XML
				echo "<row id='" . $index . "'>";
				echo "<cell>" . $rows['category'] . "</cell>";
				echo "<cell>" . $rows['Cur'] . "</cell>";
				echo "<cell>" . $rows['Prev'] . "</cell>";
				echo "<cell>" . $value . "</cell>";
				echo "</row>";

				$index++;
			}

		}
  }

  switch(true){
  	case isset($_GET['isOnline']):
  		$query = "SELECT category, COUNT(*) AS Total,
	SUM(CASE WHEN DATEPART(yyyy, entrydate) = '$currentYear' THEN 1 ELSE 0 END) Cur,
	SUM(CASE WHEN DATEPART(yyyy, entrydate) = '$lastYear' THEN 1 ELSE 0 END) Prev
FROM viewArchiveMediaCodes WHERE category = 'Internet' OR category = 'Arkansas.com' GROUP BY category";
		
		outPutXML($query, $conn);
  		break;

  	case isset($_GET['isTraditional']):
  		$query = "SELECT category, COUNT(*) AS Total,
	SUM(CASE WHEN DATEPART(yyyy, entrydate) = '$currentYear' THEN 1 ELSE 0 END) Cur,
	SUM(CASE WHEN DATEPART(yyyy, entrydate) = '$lastYear' THEN 1 ELSE 0 END) Prev
FROM viewArchiveMediaCodes WHERE category <> 'Internet' AND category <> 'Arkansas.com' GROUP BY category";
		
		outPutXML($query, $conn);
  		break;

  	case isset($_GET['isTotal']):
  		$query = "SELECT COUNT(*) AS Total,
	SUM(CASE WHEN DATEPART(yyyy, entrydate) = '$currentYear' THEN 1 ELSE 0 END) Cur,
	SUM(CASE WHEN DATEPART(yyyy, entrydate) = '$lastYear' THEN 1 ELSE 0 END) Prev
FROM viewArchiveMediaCodes";

		outPutXML($query, $conn);
  		break;

  	default:
  		break;
  }

  echo "</rows>";

?>
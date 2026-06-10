<?php

	$inData = getRequestInfo();

	$userId = intval($inData["userId"] ?? 0);
	$search = $inData["search"] ?? "";

	$conn = new mysqli("localhost", "Dante", "COP4331Project1!", "CRUD");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");

		$search = "%" . $inData["search"] . "%";

		$stmt->bind_param("ssi",$search,$search,$inData["userId"]);

		$stmt->execute();

		$result = $stmt->get_result();
		$contacts = [];

		while ($row = $result->fetch_assoc())
		{
			// new array for json encode
			$contacts[] = [
				"ID"        => $row["ID"],
				"FirstName" => $row["FirstName"],
				"LastName"  => $row["LastName"],
				"Phone"     => $row["Phone"],
				"Email"     => $row["Email"]
			];
		}

		$stmt->close();
		$conn->close();
		// JS show empty-state
		returnWithInfo($contacts);
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = json_encode(["results" => [], "error" => $err]);
    	sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($contacts)
	{
		$retValue = json_encode(["results" => $contacts, "error" => ""]);
    	sendResultInfoAsJson($retValue);
	}

?>
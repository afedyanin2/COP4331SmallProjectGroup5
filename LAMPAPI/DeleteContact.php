<?php

	$inData = getRequestInfo();

	$contactId = intval($inData["ID"]);
    $userId = intval($inData["userId"]);

	// if guard
	if ($userId < 1 || $contactId < 1)
	{
		returnWithError("Invalid request");
		exit;
	}

	$conn = new mysqli("localhost", "Dante", "COP4331Project1!", "CRUD");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts  WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $contactId, $userId);
		$stmt->execute();
		
		if($stmt->affected_rows > 0)
		{
			returnWithError("");
		}
		else
		{
			returnWithError("No Contact Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = json_encode(["error" => $err]);
		sendResultInfoAsJson($retValue);
	}

?>
<?php
	$inData = getRequestInfo();

    // get contact info
	$contactId = intval($inData["ID"] ?? 0);
	$userId    = intval($inData["userId"] ?? 0);
	$firstName =  $inData["FirstName"] ?? "";
	$lastName  =  $inData["LastName"] ?? "";
	$phone     =  $inData["Phone"] ?? "";
	$email     =  $inData["Email"] ?? "";

    // validate
	if ($contactId < 1 || $userId < 1)
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
        // update
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnWithError("");
		}
		else
		{
			returnWithError("Contact not found");
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
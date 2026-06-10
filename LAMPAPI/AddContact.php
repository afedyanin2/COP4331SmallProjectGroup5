<?php
	$inData = getRequestInfo();

	$userId = intval($inData["userId"]);
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phone = $inData["Phone"];
	$email = $inData["Email"];

	$conn = new mysqli("localhost", "Dante", "COP4331Project1!", "CRUD");

	if ($userId < 1)
	{
		returnWithError("Invalid user session");
		exit;
	}

	if (empty($firstName))
	{
		returnWithError("First name is required");
		exit;
	}

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (UserID,FirstName,LastName,Phone,Email) VALUES (?,?,?,?,?)");
		$stmt->bind_param("issss",$userId,$firstName,$lastName,$phone,$email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
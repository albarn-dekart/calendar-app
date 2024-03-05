<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'DbConnect.php';
$db = new DbConnect;
$connection = $db->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $startOfWeek = $_GET['startOfWeek']; // Assuming you pass startOfWeek and endOfWeek as parameters in your URL
        $endOfWeek = $_GET['endOfWeek'];

        $sql = "SELECT * FROM events WHERE date BETWEEN :startOfWeek AND :endOfWeek";
        $path = $_SERVER['REQUEST_URI'];

        if (isset($path[3]) && is_numeric($path[3])) {
            $sql .= " AND id = :id";
            $statement = $connection->prepare($sql);
            $statement->bindParam(':startOfWeek', $startOfWeek);
            $statement->bindParam(':endOfWeek', $endOfWeek);
            $statement->bindParam(':id', $path[3]);
            $statement->execute();
            $events = $statement->fetch(PDO::FETCH_ASSOC);
        } else {
            $statement = $connection->prepare($sql);
            $statement->bindParam(':startOfWeek', $startOfWeek);
            $statement->bindParam(':endOfWeek', $endOfWeek);
            $statement->execute();
            $events = $statement->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($events);
        break;
    case 'POST':
        $event = json_decode(file_get_contents('php://input'));
        $sql = "INSERT INTO events(id, title, date, timeStart, timeEnd) VALUES(null, :title, :date, :timeStart, :timeEnd)";
        $statement = $connection->prepare($sql);
        $statement->bindParam(':title', $event->title);
        $statement->bindParam(':date', $event->date);
        $statement->bindParam(':timeStart', $event->timeStart);
        $statement->bindParam(':timeEnd', $event->timeEnd);

        if ($statement->execute()) $response = ['status' => 1, 'message' => 'Record created successfully.'];
        else $response = ['status' => 0, 'message' => 'Failed to create record.'];
        echo json_encode($response);
        break;
    case 'PUT':
        $event = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE events SET title = :title, date = :date, timeStart = :timeStart, timeEnd = :timeEnd WHERE id = :id";
        echo $sql;
        $path = explode('/', $_SERVER["REQUEST_URI"]);

        $statement = $connection->prepare($sql);
        $statement->bindParam(':id', $path[3]);
        $statement->bindParam(':title', $event->title);
        $statement->bindParam(':date', $event->date);
        $statement->bindParam(':timeStart', $event->timeStart);
        $statement->bindParam(':timeEnd', $event->timeEnd);

        if ($statement->execute()) $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        else $response = ['status' => 0, 'message' => 'Failed to update record.'];
        echo json_encode($response);
        break;
    case 'DELETE':
        $sql = "DELETE FROM events WHERE id = :id";
        $path = explode('/', $_SERVER["REQUEST_URI"]);


        // if (isset($path[4]) && is_numeric($path[4]))
        $statement = $connection->prepare($sql);
        $statement->bindParam(':id', $path[3]);
        if ($statement->execute()) $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        else $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        echo json_encode($response);
        break;
}

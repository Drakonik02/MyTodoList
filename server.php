<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
    $servername = 'localhost';
    $database = 'i99520kb_123';
    $username = 'i99520kb_123';
    $password = '*42RDiXu';
    
    $conn = new mysqli($servername, $username, $password, $database);
    $_POST = json_decode(file_get_contents("php://input"), true);

    function answerBD($conn) {
        $answer=array();
        $result = $conn->query('SELECT * FROM DataTask');
        while($row = $result->fetch_assoc()) {
            $answer['data'][$row['id']]=array('id'=>$row['id'],'text'=>$row['text'],'done'=>$row['done']);
        };     
        return json_encode($answer);
    };
    
    if($_POST['action'] === 'addTask') {
        $text = $_POST["textTask"];
        $conn->query("INSERT INTO DataTask (text) VALUES ('$text')");
        echo answerBD($conn);
    }

    if($_POST['action'] === 'doneTask') {
        $id = $_POST["id"];
        $conn->query("UPDATE `DataTask` SET done='1' WHERE id='$id'");
        echo answerBD($conn);
    }

    if($_POST['action'] === 'deleteTask') {
        $id = $_POST["id"];
        $conn->query("DELETE FROM `DataTask` WHERE id='$id'");
        echo answerBD($conn);
    }

    if($_POST['action'] === 'saveTask') {
        $text = $_POST["text"];
        $id = $_POST["id"];
        $conn->query("UPDATE `DataTask` SET text='$text' WHERE id='$id'");
        echo answerBD($conn);
    }

    if($_POST['action'] === 'getAll') {
        echo answerBD($conn);
    }
    
    $conn->close();
}
?>
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    // Set the recipient email address
    $to = "info@onebytefood.com";
    
    // Set the email subject
    $subject = "New Message from $name";
    
    // Compose the email message
    $email_message = "Name: $name\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Message: $message\n";
    
    // Send the email
    mail($to, $subject, $email_message);
}
?>

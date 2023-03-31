<?php
if(isset($_POST['submit'])) {
  // Validate form data
  $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
  $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
  $subject = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
  $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

  // Sanitize form data
  $name = trim($name);
  $email = trim($email);
  $subject = trim($subject);
  $message = trim($message);

  // Send email
  $to = 'pdhungana@crimson.ua.edu';
  $headers = 'From: ' . $name . ' <' . $email . '>' . "\r\n" .
             'Reply-To: ' . $email . "\r\n" .
             'X-Mailer: PHP/' . phpversion();
  $message_body = "Name: $name\nEmail: $email\nSubject: $subject\n\n$message";
  $mail_sent = mail($to, $subject, $message_body, $headers);

  // Handle errors
  if($mail_sent) {
    echo 'Your message has been sent. Thank you!';
  } else {
    echo 'An error occurred while sending your message. Please try again later.';
  }
}
?>

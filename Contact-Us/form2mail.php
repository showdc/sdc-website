<html>
<head>
	<title></title>
</head>

<body>
<?php   
	require 'src/PHPMailerAutoload.php';

	if(isset($_POST['sendmail'])) {
		//$email = $_POST['email'];
		//$password = $_POST['password'];
		//$to_id = $_POST['toid'];
		//$message = $_POST['message'];
		//$messasge = "test";		
		//$subject = $_POST['subject'];		

		$mail = new PHPMailer;
		$mail->isSMTP();
		$mail->Host = 'smtp.gmail.com';
		$mail->Port = 587;
		$mail->SMTPSecure = 'tls';
		$mail->SMTPAuth = true;
		$mail->Username = '';
		$mail->Password = '';
		$mail->addAddress('it-support@showdc.co.th');
		$mail->Subject = 'Test';
		$mail->msgHTML('Test');

		if (!$mail->send()) {
			$error = "Mailer Error: " . $mail->ErrorInfo;
			echo 'Error: '.$error;
		}
		else {
			echo 'Send email successfully.';
		}

	}
?>
<form  action="form2mail.php" name="frmMain" method="post">
<table width="415" border="0" cellspacing="1" cellpadding="1">
<tr><td colspan="2"> </td></tr>

			<tr><td width="179"><h4>Full name<em>*</em></h4></td><td width="229"><label><input name="name" type="text" id="name" /></label></td>
			</tr>
		    <tr>
			<td><h4>E mail address<em>*</em></h4></td>
			<td><label><input name="email" type="text" id="email" /></label></td>
		    </tr>
		     <tr>
			<td><h4>Password<em>*</em></h4></td><td><label>
		    <input type="password" placeholder="password" name="password"/></label></td>
		    </tr>
		    <tr>
			<td><h4>phon <em>*</em></h4></td><td><label><input name="phon" type="number" id="phon" /></label></td>
		    </tr>
		    <tr>
			<td><h4>subject</h4></td><td><label><input name="subject" type="text" id="subject" /></label></td>
		    </tr>
		    <tr>
			<td valign="top"><h4>Message</h4></td><td><label>
			<textarea name="messages" cols="30" rows="5" wrap="virtual" id="messages"></textarea></label></td>
		    </tr>
		    <tr>
			<td colspan="2"><div align="center"><input type="submit" name="sendmail" value="Send Mail" /></td>
            </tr>
</table>
</form>
</body>
</html>
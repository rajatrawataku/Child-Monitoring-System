import yagmail
yag = yagmail.SMTP("email", 'password')
yag.send("emailToId", "Baby", "is Screaming")

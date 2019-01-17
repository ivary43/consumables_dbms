echo "Enter the Name(min 3)"
read name
echo "Enter the username(min 4)"
read username
echo "Enter the email of user(valid i.e xxxx@iitp.ac.in/gmail.com)"
read email
echo "Enter the password(min 6)"
read password

curl -d '{"name":'\""$name"\"', "username":'\""$username"\"', "email":'\""$email"\"', "password":'\""$password"\"'}' -H "Content-Type: application/json" -X POST http://172.16.26.36:3000/register

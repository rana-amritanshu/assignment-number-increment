# Counter Incrementor
---
## Instructions to run

### Development:
- run **(sudo) docker-compose up**
- the service is available on port localhost:9001
  
### Production:
- copy contents of .env-dev to .env file
- make changes to .env file **MONGODB_STRING=mongodb://root:password@db-prod:27017**
- run **(sudo) docker-compose up**
- the service is available on port localhost:9001
  
---
## Service is hosted for reference:
---
curl --location --request POST 'http://35.187.242.113/register' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "john.doe@example.com",
	"password": "1234"
}'

curl --location --request POST 'http://35.187.242.113/login' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "john.doe@example.com",
	"password": "1234"
}'

curl --location --request GET 'http://35.187.242.113/current' \
--header 'Authorization: Bearer <token>'

curl --location --request GET 'http://35.187.242.113/next' \
--header 'Authorization: Bearer <token>'

curl --location --request PUT 'http://35.187.242.113/current' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data-raw '{
	"number": 69
}'

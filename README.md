# Gruppexamination Bonz.Ai API 
Bunny Monkeys

## Data In Body

### POST Booking

<pre> ```json
{
  "guests": 4,
  "bookedRooms": [
	{ "type": "single", "amount": 2 }, 
	{ "type": "double", "amount": 1 }, 
	{ "type": "suite", "amount": 0 }
  ],
    "checkIn": "2025-09-09",
    "checkOut": "2025-09-12",
  	"name": "Banana Apple"
}
``` </pre>

### PUT Booking
Id in url.
<pre> ```json
{
 "guests": 6,
	"bookedRooms": [
		{ "type": "single", "amount": 1 }, 
		{ "type": "double", "amount": 1 }, 
		{ "type": "suite", "amount": 1 }
	],
	"name": "Anna Andersson",
}
``` </pre>

### DELETE Booking
Id in url.
<pre> ```json
{ 
  "email": "anna@example.com"
}
``` </pre>


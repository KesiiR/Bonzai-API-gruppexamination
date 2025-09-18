# Gruppexamination Bonz.Ai API 
Bunny Monkeys

## .env:
MY_ROLE =
<br/>
MY_ORG =

## Data In Body

### POST Booking

<pre>
{
  "guests": 4,
  "bookedRooms": [
	{ "type": "single", "amount": 2 }, 
	{ "type": "double", "amount": 1 }, 
	{ "type": "suite", "amount": 0 }
  ],
    "checkIn": "2025-09-09",
    "checkOut": "2025-09-12",
  	"name": "Anna Andersson",
	"email": "anna@example.com"
}
</pre>

### PUT Booking
Id in url.
<pre>
{
 "guests": 6,
	"bookedRooms": [
		{ "type": "single", "amount": 1 }, 
		{ "type": "double", "amount": 1 }, 
		{ "type": "suite", "amount": 1 }
	],
	"checkIn": "2025-09-09",
    "checkOut": "2025-09-12",
	"name": "Anna Andersson"
}
</pre>

### DELETE Booking
Id in url.
<pre>
{ 
  "email": "anna@example.com"
}
</pre>


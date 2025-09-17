# Gruppexamination Bonz.Ai API 
Bunny Monkeys

## Data In Body

### POST Booking

{
  "guests": 4,
  "bookedRooms": [
    { "type": "single", "amount": 2 }, <br/>
    { "type": "double", "amount": 1 }, <br/>
    { "type": "suite", "amount": 0 } <br/>
  ],
    "checkIn": "2025-09-09",
    "checkOut": "2025-09-12",
  "name": "Banana Apple"
}


### PUT Booking
Id in url.

{
 "guests": 6,
	"bookedRooms": [
		{ "type": "single", "amount": 1 }, <br/>
		{ "type": "double", "amount": 1 }, <br/>
		{ "type": "suite", "amount": 1 } <br/>
	],
	"name": "Anna Andersson",
}


### DELETE Booking
Id in url.

{ 
  "email": "anna@example.com"
}


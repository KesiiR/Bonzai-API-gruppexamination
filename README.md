# Gruppexamination Bonz.Ai API 
Bunny Monkeys

## Data In Body

### POST Booking

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


### PUT Booking
Id in url.

{
 "guests": 6,
	"bookedRooms": [
		{ "type": "single", "amount": 1 },
		{ "type": "double", "amount": 1 },
		{ "type": "suite", "amount": 1 }
	],
	"name": "Anna Andersson",
}


### DELETE Booking
Id in url.

{ 
  "email": "anna@example.com"
}


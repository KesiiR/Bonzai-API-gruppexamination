// Alla rumstyper med deras kapacitet och pris
export const rooms = {
  single: {
    capacity: 1,
    price: 500,
  },
  double: {
    capacity: 2,
    price: 1000,
  },
  suite: {
    capacity: 3,
    price: 1500,
  },
};
// Räknar totalt antal bokade rum i en array med rumobjekt
export function getTotalBookedRoomCount(arr) {
  return arr.reduce((sum, room) => {
    return sum + room.amount, 0;
  });
}

// Hämtar antal bokade rum av en viss typ (single, double, suite)
export function getRoomCountByType(bookedRooms, type) {
  return bookedRooms.find((room) => room.type === type)?.amount ?? 0;
}

// Beräknar total summa av en viss egenskap (t.ex. capacity eller price) för alla bokade rum
export function getTotalByRoomProperty(bookedRooms, property) {
  return bookedRooms.reduce((sum, room) => {
    return sum + rooms[room.type][property] * room.amount;
  }, 0);
}

// Räknar ut den totala gästkapaciteten baserat på bokade rum
export const getTotalGuestCapacity = (bookedRooms) => {
  return getTotalByRoomProperty(bookedRooms, 'capacity');
};

// Räknar ut det totala priset för bokningen baserat på bokade rum
export const getTotalBookingPrice = (bookedRooms) => {
  return getTotalByRoomProperty(bookedRooms, 'price');
};

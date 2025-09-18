
// Validera att alla nödvändiga fält måste finnas med
export const validateRequired = (data, fields) => {
  for (let field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      return `${field} is required`;
    }
  }
  return null;
};

// Validera att email innehåller @
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

// validera att bookedRooms är en array och inte tom
export const validateRooms = (bookedRooms) => {
  if (!Array.isArray(bookedRooms) || bookedRooms.length === 0) {
    return "bookedRooms must be a non-empty array";
  }
  return null;
};


// Validera att namn är en sträng och minst 3 tecken lång
export const validateName = (name) => {
  if (typeof name !== 'string' || name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }

  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/; 
  if (!regex.test(name)) {
    return "Name contains invalid characters";
  }

  return null;
};


// Validera att antal gäster är ett nummer och större än 0
export const validateGuests = (guests) => {
  if (typeof guests !== 'number' || guests < 1) {
    return "Guests must be a number greater than 0";
  }
  return null;
};


//Validera datum
function isValidDate(str) {
  // Formatet är YYYY-MM-DD
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  if (!regex.test(str)) return false

  const date = new Date(str)
  return !isNaN(date.getTime())
}

// validerar hela checkIn/checkOut
export function validateDates(checkIn, checkOut) {
  if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
    return {
      valid: false,
      message: "checkIn and checkOut must be valid dates in format YYYY-MM-DD",
    }
  }

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (checkOutDate <= checkInDate) {
    return {
      valid: false,
      message: "checkOut must be after checkIn",
    }
  }

  return null
}
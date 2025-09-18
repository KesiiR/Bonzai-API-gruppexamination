
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


// validera datum så det är rätt format YYYY-MM-DD
export const validateDate = (date) => {
  if (!date || typeof date !== 'string') {
    return "Date must be a string";
  }

  // Regex för formatet YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) {
    return "Date must be in YYYY-MM-DD format";
  }

  return null;
};


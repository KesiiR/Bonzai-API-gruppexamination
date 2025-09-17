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

//Validera datum
export function isValidDate(str) {
  // Formatet är YYYY-MM-DD
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
  if (!regex.test(str)) return false

  const date = new Date(str)
  return !isNaN(date.getTime())
}

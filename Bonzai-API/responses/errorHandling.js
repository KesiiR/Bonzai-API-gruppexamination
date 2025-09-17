export const errorResponse = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({ message })
});

export const successResponse = (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(data)
});


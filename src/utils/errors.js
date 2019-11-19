export default (thrown, name) => {
  if (thrown.name === 'StatusCodeError') {
    if (thrown.error) {
        const { statusCode, message } = thrown.error;
        const error = new Error(`Unable to ${name}: ${message}`);
        error.status = statusCode || thrown.status || 404;
        throw error;
    }
    const { statusCode, message } = thrown;
    const error = new Error(`Unable to ${name}: ${message}`);
    error.status = statusCode || thrown.status || 404;
    throw error;
  }
  const error = new Error(`Unable to ${name}: ${thrown.message}`);
  error.status = thrown.status || 404;
  throw thrown;
}
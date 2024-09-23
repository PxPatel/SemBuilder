class FetchError extends Error {
  public statusCode?: number; // Optional property for HTTP status code
  public responseText?: string; // Optional property for response text

  constructor(message: string, statusCode?: number, responseText?: string) {
    super(message); // Pass the message to the base Error class
    this.name = "FetchError"; // Set the name property to the name of your custom error class

    // Capture the stack trace, if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.statusCode = statusCode; // Assign the statusCode if provided
    this.responseText = responseText; // Assign the responseText if provided

    // Ensure the name of this error is the same as the class name
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default FetchError;

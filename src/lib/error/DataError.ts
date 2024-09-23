class DataError extends Error {
  statusCode: number | null;

  constructor(message: string, statusCode?: number) {
    super(message); // Pass the message to the base Error class
    this.name = "DataError"; // Set the name property to the name of your custom error class
    this.statusCode = statusCode ?? null; // Custom property to hold the status code

    // Ensure the name of this error is the same as the class name
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default DataError;

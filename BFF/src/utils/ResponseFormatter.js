export class ResponseFormatter {
  /**
   * Generates and sends a standardized success JSON response.
   * @param {import('express').Response} res
   * @param {any} data
   * @param {number} statusCode
   */
  static success(res, data = {}, statusCode = 200) {
    // If data is already an envelope with success flag or an array/object to return directly
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return res.status(statusCode).json(data);
    }
    return res.status(statusCode).json(data);
  }

  /**
   * Generates and sends a standardized error JSON response adhering to BACKEND_DEMAND_SHEET 2.1.
   * @param {import('express').Response} res
   * @param {string} code
   * @param {string} message
   * @param {number} statusCode
   */
  static error(res, code, message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }
}

export default ResponseFormatter;

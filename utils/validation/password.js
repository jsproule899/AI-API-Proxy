/**
 * Utility function for validating password complexitiy rules have been adhered to.
 * 
 * @param {string} password - Password to validate.
 * @returns {string} Empty string if valid, or error message if invalid.
 */
const validatePasswordComplexity = (password) => {
    const containsUppercase = (ch) => /[A-Z]/.test(ch);
    const containsLowercase = (ch) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch) =>
        /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
        countOfLowerCase = 0,
        countOfNumbers = 0,
        countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
        let ch = password.charAt(i);
        if (!isNaN(+ch)) countOfNumbers++;
        else if (containsUppercase(ch)) countOfUpperCase++;
        else if (containsLowercase(ch)) countOfLowerCase++;
        else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    let errorMessage = '';

    if (password.length < 8) {
        errorMessage += 'Password must be at least 8 characters long. \n';
    }
    if (countOfLowerCase < 1) {
        errorMessage += 'Password must contain at least one lowercase letter. \n';
    }
    if (countOfUpperCase < 1) {
        errorMessage += 'Password must contain at least one uppercase letter. \n';
    }
    if (countOfNumbers < 1) {
        errorMessage += 'Password must contain at least one number. \n';
    }
    if (countOfSpecialChar < 1) {
        errorMessage += 'Password must contain at least one special character. \n';
    }

    return errorMessage
}

module.exports = validatePasswordComplexity;
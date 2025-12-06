import { ErrorHandler } from "../src/objects/errorHandler.js";

// Email Validator:
// export async function emailValidator (email) {
//     try {
//         // (1) Verify that the email exists and is valid to recieve emails:
//         const response = await axios.get(`https://emailreputation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`)
        
//         const deliverability = data.email_deliverability?.status || null;
//         const isDisposable = data.email_quality?.is_disposable || false;
//         const isRole = data.email_quality?.is_role || false;
//         const smtpValid = data.email_deliverability?.is_smtp_valid ?? false;

//         // Reject disposable or role-based emails
//         if (isDisposable || isRole) return false;

//         // Reject if SMTP check fails
//         if (!smtpValid) return false;

//         // Only accept truly deliverable emails
//         if (deliverability === 'deliverable') return true;

//         // Risky, undeliverable, unknown → reject
//         return false;
//   } 
//   catch (err) {
//     console.error('Email validation error:', err.message);
//     return false;
//   }
// }

// Password Validator:
async function passwordLengthValidator (password) {
    return password.length >= 10; 
}   

async function passwordCharValidator (password) {
    if (typeof password !== 'string') return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

export async function passwordValidator (password) {
  try {
      const isLongEnough = await passwordLengthValidator(password);
      const hasRequiredChars = await passwordCharValidator(password);

      // Return combined result:
      return isLongEnough && hasRequiredChars;
    
  } catch (error) {
      console.error("Password validation error:", error);
      return false;
  }
}

// Name validator:
export async function nameValidator (name) {
    return typeof name === 'string' && name.trim() !== '';
}

// Validate profile:
export async function validateNewAccount(firstName, lastName, email, password) {
    const errors = [];

    // Run all validators
    if (!(await nameValidator(firstName))) errors.push("Invalid first name");
    if (!(await nameValidator(lastName))) errors.push("Invalid last name");
    if (!(await nameValidator(email))) errors.push("Invalid email");
    if (!(await passwordValidator(password))) errors.push("Password must be at least 10 characters long and include a capital letter, a lowercase letter, a number, and a special character.");

    if (errors.length > 0) {
        throw new ErrorHandler(errors.join(", "), 400);
    }

    // Return value;
    return true;
}
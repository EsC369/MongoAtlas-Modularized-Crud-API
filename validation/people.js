const validator = require("validator");
const isEmpty = require("./is-empty.js")

module.exports = function validatePeopleInput(data) {
    let errors = {};
    
    // Validations:
    // First Name:
    if (!validator.isAlpha(data.firstName)) {
      errors.msg = "First Name Must Only Container Letters a-z, A-Z.";
    }
    if(data.firstName.length < 3){
      errors.msg = "First Name Field Is Required And Must Be More Than 3 Characters.";
    }

    // Last Name:
    if (!validator.isAlpha(data.lastName)) {
      errors.msg = "Last Name Must Only Container Letters a-z, A-Z.";
    }
    if(data.lastName.length < 3){
      errors.msg = "Last Name Field Is Required And Must Be More Than 3 Characters.";
    }
  
    return {
      errors, 
      isValid: isEmpty(errors)
    };
  };
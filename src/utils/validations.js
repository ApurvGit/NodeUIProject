const validators = require("validator")

const validatorSignUpdata = (req) => {

    const { firstName, lastName, emailId, gender, city, emp_id, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Name field can not be empty")
    } else if (!validators.isEmail(emailId)) {
        throw new Error("Enter valid Email")
    }

}

const validIfEditDataIsAllowed = (req) => {
    const allowedEditFields = ["emailId", "city", "photoUrl"]
    const isEditAlowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
    console.log(isEditAlowed)
    return isEditAlowed;
}
module.exports = { validatorSignUpdata, validIfEditDataIsAllowed }
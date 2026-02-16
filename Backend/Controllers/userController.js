const user = require ('../models/userModels');

const bcrypt = require ('bcrypt')

const registerUser = asyns (res,req) => {
    try{
        const {email, password, name, country, zip_code} = req.body
    }
}
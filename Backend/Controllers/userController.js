const user = require ('../models/userModels');

const bcrypt = require ('bcrypt'); 

const registerUser = asyns (res,req) => {
    try{
        const {email, password, name, country, zip_code} = req.body;

        const exisitingUer = await User.findByEmail(email);
        if(exisitingUer) return res.status(400).json({message: 'Email already exits'});

        const newUser = await User.create({email, password, name, country, zip_code})

        res.status(201).json({message: 'User registered!', user: {id: newUser.id, email: newUser.email}
             catch (err){
             console.error(err);
             res.status(500).json({message: 'Server error'});
             

        }
        })

    }
}
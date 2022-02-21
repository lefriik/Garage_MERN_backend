import jwt from "jsonwebtoken"
import Instructor from "../models/Instructor.js"

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            req.instructor = await Instructor.findById(decoded.id).select("-password -token -confirmado")
           
            return next();
        } catch (error) {
            const e = new Error("Token no valido");
            return res.status(403).json({msg : e.message});
        }  
    }

    if(!token){
        const error = new Error("Token no valido o inexistente");
        res.status(403).json({msg : error.message});
    }

    next();
}

export default checkAuth;
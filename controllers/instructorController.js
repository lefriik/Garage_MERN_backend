import Instructor from "../models/Instructor.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar = async (req, res) => {

     const { email, nombre } = req.body
    //prevenir usuarios registrados
    const existeUsuario = await Instructor.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});   
    }
    try {
        // Guardar nuevo instructor
        const instructor = new Instructor(req.body)
        const instructorGuardado = await instructor.save();

        //enviar email
        emailRegistro({
            email,
            nombre,
            token: instructorGuardado.token,
        });




        res.json(instructorGuardado);

        
    } catch (error) {
        console.log(error);
    }    
};

const perfil = (req, res) => {
    
    const {instructor} = req;
    res.json({ instructor });
};

const confirmar = async (req, res) => {

    const { token } = req.params

    const usuarioConfirmar = await Instructor.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    }
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()
        res.json({msg: 'Usuario Confirmado Correctamente'})
        
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    
    const { email, password } = req.body;

    //comprobar si el usuario existe
    const usuario = await Instructor.findOne({email})

    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});   
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    //autenticar al usuario
    if( await usuario.comprobarPassword(password) ){
        //autenticar usuario
      
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
        
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
    }    
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeInstructor = await Instructor.findOne({email})

    if(!existeInstructor) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeInstructor.token = generarId()
        await existeInstructor.save()

        //enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeInstructor.nombre,
            token: existeInstructor.token
        });
        

        res.json({ msg: "Hemos enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error)
    }

};

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const tokenValido = await Instructor.findOne({token});

    if(tokenValido){
        //el token es valido, el usuario existe
        res.json({ msg: 'token valido'});
    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message}); 
    }
   

}

const nuevoPassword = async (req, res) => {

    const { token } = req.params;
    const{ password } = req.body;

    const instructor = await Instructor.findOne({token});
    if(!instructor){
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    try {
        instructor.token = null;
        instructor.password = password;
        await instructor.save();
        res.json({ msg: 'Password modificado correctamente' });
        
    } catch (error) {
        console.log(error)
    }

}

const actualizarPerfil = async (req, res) => {
    const instructor = await Instructor.findById(req.params.id);
    if(!instructor) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body;
    if(instructor.email !== req.body.email) {
        const existeEmail = await Instructor.findOne({email});
        if(existeEmail){
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({msg: error.message});
        } 
    }

    try {
        instructor.nombre = req.body.nombre;
        
        instructor.email = req.body.email;
        
        instructor.web = req.body.web;
        instructor.telefono = req.body.telefono;

        const instructorActualizado = await instructor.save();
        
        res.json(instructorActualizado)

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {

    const { id } = req.instructor;
    const { pwd_actual, pwd_nuevo } = req.body;

    const instructor = await Instructor.findById(id);
    if(!instructor) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    if(await instructor.comprobarPassword(pwd_actual)){
        
        instructor.password = pwd_nuevo;
        await instructor.save();
        res.json({ msg: 'Password almacenado correctamente'})
    }else{
        const error = new Error('El password actual es Incorrecto');
        return res.status(400).json({msg: error.message});
    }


    // almacenar el nuevo pass

}


export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };


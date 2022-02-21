import Alumno from '../models/Alumno.js'

const agregarAlumno = async (req, res) => {
    const alumno = new Alumno(req.body);
    alumno.instructor = req.instructor._id;
    
    try {
        const alumnoAlmacenado = await alumno.save();
        res.json(alumnoAlmacenado);
        
    } catch (error) {
        console.log(error)
    }
    
}

const obtenerAlumnos = async (req, res) => {
    const alumnos = await Alumno.find().where('instructor').equals(req.instructor);

    res.json(alumnos);

}

const obtenerAlumno = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findById(id);

    if(!alumno){
      
        res.status(404).json({ msg: 'No encontrado'})
       
    }

    if(alumno.instructor._id.toString() !== req.instructor._id.toString()) {
        return res.json({ msg: "accion no valida" });
    }

 
    res.json({alumno});
 
    
}



const actualizarAlumno = async (req, res) => {

    const { id } = req.params;
    const alumno = await Alumno.findById(id);

    if(!alumno){
        res.status(404).json({ msg: 'No encontrado'})     
    }
    if(alumno.instructor._id.toString() !== req.instructor._id.toString()) {
        return res.json({ msg: "accion no valida" });
    }
    //actualizar alumno
    alumno.nombre = req.body.nombre || alumno.nombre;
    alumno.email = req.body.email || alumno.email;
    alumno.inscripcion = req.body.inscripcion || alumno.inscripcion;
    alumno.detalles = req.body.detalles || alumno.detalles;

    try {
        const alumnoActualizado = await alumno.save()
        res.json(alumnoActualizado);
    } catch (error) {
        console.log(error)
    }

}


const eliminarAlumno = async (req, res) => {

    const { id } = req.params;
    const alumno = await Alumno.findById(id);

    if(!alumno){
        res.status(404).json({ msg: 'No encontrado'})     
    }
    if(alumno.instructor._id.toString() !== req.instructor._id.toString()) {
        return res.json({ msg: "accion no valida" });
    }

    try {
        await alumno.deleteOne()
        res.json({ msg: 'Alumno eliminado'})
    } catch (error) {
        console.log(error)
    }

}


export { agregarAlumno, obtenerAlumnos, obtenerAlumno, actualizarAlumno, eliminarAlumno };
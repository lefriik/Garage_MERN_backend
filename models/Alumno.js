import mongoose from 'mongoose';

const alumnosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    inscripcion: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    detalles: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
},
    {
        timestamps: true,
    }
);

const Alumno = mongoose.model("Alumno", alumnosSchema);

export default Alumno;
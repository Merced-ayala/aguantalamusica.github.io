import express from "express";
import cors from "cors";
import { connectToDB } from "./dbaguanta.mjs";
import { ObjectId } from "mongodb"; // Importar ObjectId correctamente

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;
let contactsCollection;

// Inicializar la base de datos antes de arrancar el servidor
async function initializeDatabase() {
    try {
        db = await connectToDB();
        contactsCollection = db.collection("contacts");
        console.log("📡 Base de datos lista para recibir peticiones");
    } catch (err) {
        console.error("Error inicializando la base de datos:", err);
        process.exit(1); // Detener el servidor si no se puede conectar
    }
}

initializeDatabase();

// Obtener todos los contactos
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await contactsCollection.find().toArray();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener contactos", error: err.message });
    }
});

// Crear un nuevo contacto
app.post("/contacts", async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newContact = { name, email, phone, message };

    try {
        const result = await contactsCollection.insertOne(newContact);
        res.status(201).json({
            message: "Contacto creado exitosamente",
            contact: { _id: result.insertedId, ...newContact },
        });
    } catch (err) {
        res.status(500).json({ message: "Error al crear el contacto", error: err.message });
    }
});

// Actualizar un contacto por ID
app.put("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID no válido" });
    }

    try {
        const result = await contactsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, email, phone, message } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        res.json({ message: "Contacto actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el contacto", error: err.message });
    }
});

// Eliminar un contacto por ID
app.delete("/contacts/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID no válido" });
    }

    try {
        const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        res.status(200).json({ message: "Contacto eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el contacto", error: err.message });
    }
});

// 🚀 Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});


import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://aguantalamusica:aguantalamusicadb@aguantalamusica.njxfp.mongodb.net/?retryWrites=true&w=majority&appName=aguantalamusica";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let database = null; // Variable global para la conexión

export async function connectToDB() {
    if (database) return database; // Si ya hay conexión, reutilizarla

    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        database = client.db("aguantalamusica"); // Asegúrate de que esta sea tu base de datos
        return database;
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1); // Detiene la ejecución si la conexión falla
    }
}

export default client;

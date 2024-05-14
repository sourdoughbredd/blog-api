import { connect, disconnect, connection } from "../config/database.js";

async function main() {
  try {
    await connect();
    const collections = await connection.listCollections();
    const collectionNames = collections.map((coll) => coll.name);
    for (let coll of collectionNames) {
      if (coll !== "Collection0") {
        console.log(`Deleting ${coll} collection...`);
        await connection.dropCollection(coll);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await disconnect();
  }
}

main();

require("dotenv").config();
const db = require("../config/database");

async function main() {
  try {
    await db.connect();
    const collections = await db.connection.listCollections();
    const collectionNames = collections.map((coll) => coll.name);
    for (let coll of collectionNames) {
      if (coll !== "Collection0") {
        console.log(`Deleting ${coll} collection...`);
        await db.connection.dropCollection(coll);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await db.disconnect();
  }
}

main();

const mongoose = require("mongoose");
require('dotenv').config()

mongoose.set("strictQuery", false);

const mongoDB = process.env.DB_CONNECTION

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('DB Connected')
}

module.exports= mongoose;
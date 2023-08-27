const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(`mongodb+srv://rokayaabdelgwad246:0Qn1f5gFrj1ZusfD@cluster0.jmkl18b.mongodb.net/`);
  console.log("connected to database successfully ✅✅✅✅");
}

main().catch((err) => console.log(err));
const mongoose = require("mongoose");

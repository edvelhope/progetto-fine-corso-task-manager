const bcrypt = require("bcrypt");

// (async () => {
//   const hash = await bcrypt.hash("tuaPassword123", 10);
//   console.log("Hash:", hash);
// })();

// (async () => {
//   const hash = await bcrypt.hash("password4", 10);
//   console.log("Hash:", hash);
// })();

(async () => {
  const hash = await bcrypt.hash("password3", 10);
  console.log("Hash:", hash);
})();

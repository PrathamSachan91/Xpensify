const path = require("path");
const fs = require("fs");
// File Upload Helper
exports.ensureUpload = async (file, folder = "uploads") => {
  if (!file) return null;

  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000); // adds 3-digit random number
  const cleanName = file.name.replace(/\s+/g, "");
  const fileName = `${timestamp}_${random}_${cleanName}`;

  const uploadPath = path.join(__dirname, "..", folder);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const filePath = path.join(uploadPath, fileName);
  await file.mv(filePath);

  return `/${folder}/${fileName}`; // relative path
};

exports.deleteOldFile = (filePath) => {
  if (!filePath) return;
  const absolutePath = path.join(__dirname, "..", filePath); // adjust according to your folder structure
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const path = require("path");
const multer = require("multer");
const uuid4 = require("uuid").v4;

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, "public")
    },
    filename: function (req, file, cb) {
      const fullName = "images_" + uuid4().replace(/-/g, "") + path.extname(file.originalname);
      cb(null, fullName);
    },
  });

const upload = multer({ storage: storage }).single('public');

module.exports(upload);

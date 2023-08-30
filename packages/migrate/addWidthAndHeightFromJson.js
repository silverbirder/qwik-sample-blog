const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");
const url = require("url");
const crypto = require("crypto");
require("dotenv").config();

const filePath = "../docs/src/routes/resume/index.json";
const dryRun = false;
let processLimit = 1;

const downloadImage = async (imgUrl) => {
  const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
};

const processJson = async () => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const data = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(data);
  const updatedItems = json.items;

  for (let item of updatedItems) {
    if (item.image && processLimit > 0) {
      const imageUrl = item.image;
      if (dryRun) {
        console.log(`Image URL: ${imageUrl}`);
      } else {
        try {
          const imageBuffer = await downloadImage(imageUrl);
          const metadata = await sharp(imageBuffer).metadata();

          item.width = metadata.width;
          item.height = metadata.height;
        } catch (error) {
          console.error(
            `Failed to process image from URL ${imageUrl} due to error:`,
            error
          );
        } finally {
          processLimit--;
        }
      }
    }
  }

  if (!dryRun) {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
  }
};

processJson()
  .then(() => {
    if (dryRun) {
      console.log("Dry run completed. No images were uploaded.");
    } else {
      console.log("Image URLs processed and updated!");
    }
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });

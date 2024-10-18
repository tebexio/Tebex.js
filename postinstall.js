import { access, copyFile, constants } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define source and destination file paths
const sourceFile = join(__dirname, "example.dev.vars");
const destFile = join(__dirname, ".dev.vars");

// Check if the destination file exists
access(destFile, constants.F_OK, (err) => {
    if (err) {
        // Copy the file
        copyFile(sourceFile, destFile, (err) => {
            if (err) {
                console.error("Error copying file:", err);
            } else {
                console.log("File copied successfully");
            }
        });
    }
});

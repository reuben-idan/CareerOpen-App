import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const questions = [
  {
    name: "VITE_FIREBASE_API_KEY",
    message: "Enter your Firebase API Key: ",
    required: true,
  },
  {
    name: "VITE_FIREBASE_AUTH_DOMAIN",
    message: "Enter your Firebase Auth Domain: ",
    required: true,
  },
  {
    name: "VITE_FIREBASE_PROJECT_ID",
    message: "Enter your Firebase Project ID: ",
    required: true,
  },
  {
    name: "VITE_FIREBASE_STORAGE_BUCKET",
    message: "Enter your Firebase Storage Bucket: ",
    required: true,
  },
  {
    name: "VITE_FIREBASE_MESSAGING_SENDER_ID",
    message: "Enter your Firebase Messaging Sender ID: ",
    required: true,
  },
  {
    name: "VITE_FIREBASE_APP_ID",
    message: "Enter your Firebase App ID: ",
    required: true,
  },
];

const envPath = path.join(rootDir, ".env");

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question.message, (answer) => {
      if (question.required && !answer) {
        console.log("This field is required!");
        return askQuestion(question).then(resolve);
      }
      resolve(answer);
    });
  });
}

async function setup() {
  console.log("Welcome to CareerOpen App Setup!");
  console.log("This script will help you set up your environment variables.\n");

  const answers = {};
  for (const question of questions) {
    answers[question.name] = await askQuestion(question);
  }

  const envContent = Object.entries(answers)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(envPath, envContent);
  console.log("\nEnvironment variables have been set up successfully!");
  console.log("You can now run the application using:");
  console.log("npm run dev     # for development");
  console.log("npm run build   # for production build");

  rl.close();
}

setup().catch((error) => {
  console.error("An error occurred during setup:", error);
  process.exit(1);
});

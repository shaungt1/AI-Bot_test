import fs from "fs";
import readline from "readline";
import OpenAI from "openai";

// Set your OpenAI API key directly
const apiKey = "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";

// Read the system prompt from the file system_prompt.txt
const systemPrompt = fs.readFileSync("system_prompt.txt", "utf8").trim();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const openai = new OpenAI({
  apiKey: apiKey,
});

async function main() {
  let userPrompt = "";
  while (userPrompt.toLowerCase() !== "exit") {
    userPrompt = await new Promise((resolve) => {
      rl.question("You: ", resolve);
    });

    if (userPrompt.toLowerCase() === "exit") {
      console.log("Goodbye!");
      break;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { "role": "developer", "content": systemPrompt },
        { "role": "user", "content": userPrompt }
      ],
      stream: true,
    });

    process.stdout.write("AI: ");
    for await (const chunk of completion) {
      if (chunk.choices[0].delta.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    }
    console.log(); // New line after the response
  }

  rl.close();
}

main();
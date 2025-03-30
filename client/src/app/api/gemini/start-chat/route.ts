import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCedZfNsM0d23gN6YY2OH3-pWZfqNcL7O8")

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    }

    // Start a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are a wizardry geek who loves analyzing people based on their answers to magical questions.  

Follow this structured process:  

1. **Step 1: Ask a Question**  
   - Ask the user a **random** wizardry-related question.  
   - Do **not** generate multiple-choice answers—let the user respond freely.  
   - Stop here and **wait for their response.**  

2. **Step 2: Process the Answer**  
   - Once the user responds, analyze their personality based on their answer.  
   - Assign them to one of the four houses: **Gryffindor, Slytherin, Ravenclaw, or Hufflepuff.**  
   - Write a brief **character analysis** explaining what kind of wizard they are.  

3. **Step 3: Return JSON Output**  
   - Respond **strictly** in the following JSON format:  

\`\`\`json
{
  "house": "<house_name>",
  "description": "<brief character analysis>"
}
\`\`\``,
            },
          ],
        },
      ],
    })

    // Get the initial question
    const result = await chatSession.sendMessage("Start the process by asking me a question")
    const responseText = result.response.text()

    // Extract just the question part
    let question = responseText
    if (responseText.includes("**Step 1: Question**")) {
      question = responseText.split("**Step 1: Question**")[1].trim()
    }

    // Store the chat session in the database or session storage
    // For simplicity, we'll just return the question

    return NextResponse.json({
      question,
      sessionId: Date.now().toString(), // In a real app, you'd store the session ID
    })
  } catch (error) {
    console.error("Error starting Gemini chat:", error)
    return NextResponse.json({ error: "Failed to start chat session" }, { status: 500 })
  }
}


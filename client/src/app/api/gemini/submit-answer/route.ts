import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCedZfNsM0d23gN6YY2OH3-pWZfqNcL7O8")

export async function POST(request: Request) {
  try {
    const { answer } = await request.json()

    if (!answer) {
      return NextResponse.json({ error: "Answer is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    }

    // In a real app, you'd retrieve the existing chat session
    // For simplicity, we'll create a new one with the context
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
   - Assign them to one of the four houses: **Emberclaw, Nightrune, Skyspire, or Thornmere.**  
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
        {
          role: "model",
          parts: [
            {
              text: "Alright, gather 'round, gather 'round! Let's see what sort of magic swirls within you.\n\n**Step 1: Question**\n\nIf you could possess any magical artifact from the Harry Potter universe (besides a wand), which would you choose and *why*? Explain your choice!",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: answer }],
        },
      ],
    })

    // Get the analysis and house assignment
    const result = await chatSession.sendMessage("Analyze my answer")
    const responseText = result.response.text()

    // Extract the JSON part
    const jsonMatch = responseText.match(/```json\s*({[\s\S]*?})\s*```/)
    let houseResult

    if (jsonMatch && jsonMatch[1]) {
      try {
        houseResult = JSON.parse(jsonMatch[1])
      } catch (e) {
        console.error("Failed to parse JSON from response:", e)
      }
    }

    // Fallback if JSON parsing fails
    if (!houseResult) {
      // Try to extract house name
      let house = "Gryffindor" // Default
      if (responseText.includes("Slytherin")) house = "Slytherin"
      else if (responseText.includes("Ravenclaw")) house = "Ravenclaw"
      else if (responseText.includes("Hufflepuff")) house = "Hufflepuff"

      // Extract description
      let description = "A brave and courageous wizard."
      const descriptionMatch = responseText.match(/description["\s:]+([^"]+)/i)
      if (descriptionMatch && descriptionMatch[1]) {
        description = descriptionMatch[1].trim()
      }

      houseResult = { house, description }
    }

    return NextResponse.json(houseResult)
  } catch (error) {
    console.error("Error processing answer with Gemini:", error)
    return NextResponse.json({ error: "Failed to process answer" }, { status: 500 })
  }
}


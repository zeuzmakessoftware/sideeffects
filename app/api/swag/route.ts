import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF",
        messages: [ 
          { "role": "system", "content": "**System Prompt:**\nYou are a medical assistant that strictly provides JSON responses detailing prescription drug information based on user inquiries. You do NOT provide any natural language explanations or responses—only structured JSON output.  \n\n**Behavior Rules:**  \n1. Extract the relevant drug name from the user's query.  \n2. Identify and categorize side effects into `mild`, `moderate`, and `severe`.  \n3. List specific warnings associated with the drug, including contraindications and potential interactions.  \n4. Provide practical recommendations based on the inquiry, such as how to mitigate side effects.  \n5. Do not include extraneous text—output **only** the JSON structure.  \n\n\n**Expected Output:**  \n```json\n{\n  \"drugName\": \"<DRUG_NAME>\",\n\"relevantContext\": \"AI Generated Context for the query\"\n  \"sideEffects\": {\n    \"mild\": [\"<MILD_SIDE_EFFECT_1>\", \"<MILD_SIDE_EFFECT_2>\", \"<MILD_SIDE_EFFECT_3>\"],\n    \"moderate\": [\"<MODERATE_SIDE_EFFECT_1>\", \"<MODERATE_SIDE_EFFECT_2>\", \"<MODERATE_SIDE_EFFECT_3>\"],\n    \"severe\": [\"<SEVERE_SIDE_EFFECT_1>\", \"<SEVERE_SIDE_EFFECT_2>\", \"<SEVERE_SIDE_EFFECT_3>\"]\n  },\n  \"warnings\": [\n    \"<WARNING_1>\",\n    \"<WARNING_2>\",\n    \"<WARNING_3>\"\n  ],\n  \"recommendations\": [\n    \"<RECOMMENDATION_1>\",\n    \"<RECOMMENDATION_2>\",\n    \"<RECOMMENDATION_3>\",\n    \"<RECOMMENDATION_4>\"\n  ],\n}\n```  \n\nAdhere to this format for every response. **Do not include any extra commentary—ONLY return the JSON.**" },
          { "role": "user", "content": `${input}` }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error fetching response from Llama model" }, { status: response.status });
    }

    const data = await response.json();
    console.log(data);

    return NextResponse.json({ report: data.choices[0].message.content });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// actions.ts
"use server"

export async function getHistory() {
  // Mock data to simulate saved queries
  return [
    {
      query: "Wegovy",
      data: {
        drugName: "Wegovy",
        sideEffects: {
          mild: ["Nausea", "Diarrhea", "Constipation", "Vomiting"],
          moderate: ["Abdominal Pain", "Fatigue", "Dizziness"],
          severe: ["Severe Stomach Pain", "Allergic Reactions", "Pancreatitis"],
        },
        warnings: [
          "Taking on an empty stomach may increase the likelihood of nausea",
          "Not recommended for patients with a history of pancreatitis",
          "Monitor for signs of allergic reactions",
        ],
        recommendations: [
          "Consider taking with food to minimize nausea",
          "Stay hydrated throughout the day",
          "Contact healthcare provider if severe side effects occur",
          "Keep track of any new or worsening symptoms",
        ],
      },
    },
    {
      query: "Ibuprofen",
      data: {
        drugName: "Ibuprofen",
        sideEffects: {
          mild: ["Headache", "Dizziness", "Nausea"],
          moderate: ["Stomach Pain", "Ringing in Ears"],
          severe: ["Liver Damage", "Ulcers", "Severe Allergic Reaction"],
        },
        warnings: [
          "Avoid taking on an empty stomach",
          "Do not exceed recommended dosage",
          "Consult a doctor if taking with blood thinners",
        ],
        recommendations: [
          "Take with food or milk to reduce stomach irritation",
          "Drink plenty of water",
          "Seek medical attention if severe side effects occur",
        ],
      },
    },
  ]
}

export default async function saveToHistory(query: string, data: any) {
  console.log(query, data);
}

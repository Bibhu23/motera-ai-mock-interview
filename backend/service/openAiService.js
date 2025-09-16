import openAi from "openai"

const openai = new openAi({
    apiKey: process.env.OPENAI_API_KEY
})

export async function generatefuntion(role, difficulty = "easy") {
    const prompt = `Generate 5 ${difficulty} interview question for a role ${role}.`

    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
    })
    const question = JSON.parse(response.choices[0].message.content)
    return question
}
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const makeOpenAIRequest = async (prompt) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.8,
    max_tokens: 2048,
  })
  return completion.data.choices[0].text
}

const makeAPIRequest = async (messages, set_id, is_confident = false) => {
  const data = JSON.stringify({ messages, set_id, top_k: 10, is_confident })
  console.log("data", data)
  const response = await fetch("http://0.0.0.0:8080/v0/chat", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
  return response
}

export default async function (req, res) {
  const { messages, set_id, is_confident } = req.body
  const result = await makeAPIRequest(messages, set_id, is_confident)
  res.status(200).json({ result })
}
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

const makeAPIRequest = async (prompt) => {
  const data = JSON.stringify({ messages: prompt })
  console.log("data", data)
  const response = await fetch("http://0.0.0.0:8080/v0/chat", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
  console.log(response)
  return response.chat_response
}

export default async function (req, res) {
  const { messages } = req.body
  const result = await makeAPIRequest(messages)
  res.status(200).json({ result })
}
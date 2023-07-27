import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { subject, email, product, voice, topic } = req.body;
  const prompt =
    voice === "Marketing"
      ? generateMarketingPrompt(product, subject, email, topic)
      : generateSalesPrompt(product, subject, email, topic);
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    temperature: 0.8,
    max_tokens: 2048,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generateMarketingPrompt(product, subject, email, topic) {
  return `
  Write creative ad copy for the following product${topic?.length > 0 ? "using the topics below" : ""}.

  Product: ${product}
  ${topic?.length > 0 ? `Topic: ${topic}` : ""}
  ${subject?.length > 0 ? `Title: ${subject}` : ""}
  Ad: ${email}`;
}

function generateSalesPrompt(product, subject, email, topic) {
  return `
  Write a convincing sales email for the following product${topic?.length > 0 ? "using the topics below" : ""}.

  Product: ${product}
  ${topic?.length > 0 ? `Topic: ${topic}` : ""}
  ${subject?.length > 0 ? `Subject: ${subject}` : ""}
  Email: ${email}`;
}

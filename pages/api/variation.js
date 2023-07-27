import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { email, product, voice, topic } = req.body;

  const prompt =
    voice === "Marketing"
      ? generateMarketingPrompt(email, product, topic)
      : generateSalesPrompt(email, product, topic);

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    temperature: 1,
    max_tokens: 2048,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generateMarketingPrompt(email, product, topic) {
  return `
  Rewrite a new version of the following marketing ad for the following product.

  Product: ${product}

  Ad: ${email}

  Version:`;
}

function generateSalesPrompt(email, product, topic) {
  return `
  Rewrite a new version of the following email for the following product.

  Product: ${product}

  Email: ${email}

  Version:`;
}
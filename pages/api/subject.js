import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { product, topic, voice } = req.body;

  const prompt =
    voice === "Marketing"
      ? generateMarketingPrompt(product, topic)
      : generateSalesPrompt(product, topic);

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    temperature: 1.0,
    max_tokens: 15,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generateMarketingPrompt(product, topic) {
  return `
  Write a catchy marketing ad headline about the following product.

	Product: ${product}
  ${topic?.length > 0 ? `Topic: ${topic}` : ""}
	Headline:`;
}

function generateSalesPrompt(product, topic) {
  return `
  Write a convincing email subject about the following product.

	Product: ${product}
  ${topic?.length > 0 ? `Topic: ${topic}` : ""}
	Subject:`;
}

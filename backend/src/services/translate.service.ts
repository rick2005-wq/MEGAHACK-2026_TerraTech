import axios from "axios";
export async function translateText(text: string, targetLang: string): Promise<string> {
  // TODO: Use Google Translate API or OpenAI
  const response = await axios.post(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
    { q: text, target: targetLang }
  );
  return response.data.data.translations[0].translatedText;
}

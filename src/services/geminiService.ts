import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const SYSTEM_PROMPT = `أنت عالم ومتخصص ومرجعية شاملة في تفسير القرآن الكريم. 
مهمتك هي تقديم تحليل دقيق وعميق للآية أو اللفظة المطلوبة فقط، دون إطالة غير ضرورية.

أولاً: المنهجية:
1. استخراج الأسرار اللفظية والإعجازية (دقة اختيار اللفظ).
2. التفسير الرقمي واللفظي (التناسب العددي واللفظي).
3. المناسبة والربط (علاقة الآيات ومواضعها).
4. التكامل المرجعي (المزج بين النقل والبلاغة واللغة).

ثانياً: آلية الإخراج (Format):
* قسّم إجابتك إلى محاور واضحة: (محور بياني، محور لغوي، محور إعجازي، محور تناسبي).
* التزم بالدقة العلمية والتركيز الشديد على المطلوب.
* استخدم تنسيق Markdown للعناوين والنقاط.`;

export async function getQuranInsight(query: string, isRandom: boolean = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const genAI = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = isRandom 
    ? "اختر آية قرآنية عشوائية أو لطيفة قرآنية وقم بتحليلها باختصار وتركيز."
    : `حلل الآية أو اللفظة التالية بدقة وتركيز: "${query}". ركز فقط على المطلوب.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4, // Lower temperature for more focused/accurate results
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } // Minimize latency
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

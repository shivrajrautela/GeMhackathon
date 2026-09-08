// Create a new controller file for Gemini AI
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Ensure the API key is available
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

async function analyzeBidDocument(base64PdfData, mimeType = "application/pdf") {
    try {
        // Use Gemini 3.6 Flash - it is extremely fast and natively supports PDFs
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const prompt = `
        You are an expert government procurement auditor. 
        Analyze the attached bid document and extract the following information in strict JSON format.
        
        Required fields in JSON:
        {
          "companyName": "Extracted name of the company",
          "gstin": "Extracted GSTIN (15 characters)",
          "pan": "Extracted PAN (10 characters)",
          "financialTurnover": "Extracted turnover amount for the latest year (as a number or string)",
          "udyamRegistration": "Extracted Udyam/MSME number if present",
          "tamperingSigns": "true or false. Set to true if fonts look suspicious, text is overlaid, or dates look altered.",
          "summary": "A 2-sentence summary of the document's validity."
        }
        
        If a field is missing, return "NOT_FOUND". Do not include any markdown formatting like \`\`\`json in your response, just return the raw JSON object.
        `;

        // Pass the PDF data inline to Gemini
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64PdfData,
                    mimeType: mimeType
                }
            }
        ]);

        const responseText = result.response.text();
        // Clean up markdown if Gemini accidentally adds it
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error(`Gemini AI Error: ${error.message}`);
    }
}

module.exports = { analyzeBidDocument };

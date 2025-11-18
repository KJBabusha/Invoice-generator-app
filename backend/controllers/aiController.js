const {GoogleGenAI} = require('@google/genai');
const Invoice = require('../models/Invoice');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const parseInvoiceFormText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text input is required" });
    }
    try {
        const prompt = `
        You are an expert invoice data extraction AI. Analyze the following text and extract the relative information to create an invoice. 
        The output MUST be a valid JSON object.

        The JSON object should have the following structure:
        {
        "clientName":"string",
        "email":"string(if availble",
        "address":"string(if available)",
        "items":[
            {
            "name":"string",
            "quantity":number,
            "unitPrice":number,
            }
        ]
        }
        Here is the Text to parse:
        ---TEXT---
        ${text}
        ---END OF TEXT---

        Extract the data and provide only the JSON object as output.
    `;

    }catch (error) {
        console.error("Error parsing invoice with AI:", error);
        res.status(500).json({ message: "Failed to parse invoice data from text", details: error.message });
    }   
};



   
const generateRemiderEmail = async (req, res) => {
    const { invoiceId } = req.params;

    if (!invoiceId) {
        return res.status(400).json({ message: "Invoice ID is required" });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        const prompt = `
        You are a professional and polite accounting assistant. write a friendly reminder email to a client about an overdue or upcoming invoice payment.

        use the following detailes to personalize the email:
        - Client Name: ${invoice.billTo.clientName}
        - Invoice Number: ${invoice.invoiceNumber}
        - Amount Due: $${invoice.total.toFixed(2)}
        - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

        The tone should be friendly but clear. Keep it concise and to the point. Start the email with "Subject: Reminde".
    `;
    const response = await ai.models.generateContent({ 
        model: 'gemini-1.5-flash-latest',
        contents:prompt,
     });

    res.status(200).json({ reminderText: response.text });
    }catch (error) {
        console.error("Error generating reminder email with AI:", error);
        res.status(500).json({ message: "Failed to parse invoice data from text", details: error.message });
    } 
};



const getDashboardSummary = async (req, res) => {
  
    try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (invoices.length === 0) {
        return res.status(200).json({insights: "No invoices data available to generate insights."});
    } 

    // Process and  Summerize invoice data
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'Paid');
    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + inv.total, 0);

    const dataSummary = `
        -Total number of invoice: ${totalInvoices }
        -Total paid invoices: ${paidInvoices.length}
        -Total unpaid/pending invoices: ${unpaidInvoices.length}
        -Total revenue from paid invoices: $${totalRevenue.toFixed(2)}
        -Total outstanding amount from unpaid invoices: $${totalOutstanding.toFixed(2)}
        -Recent invoice (last 5): ${invoices.slice(-5).map(inv => `invoice #${inv.invoiceNumber} for ${inv.total.toFixed(2)} with status ${inv.status}`).join(', ')}

    `;

    const prompt = `
    You are a friendly and insightful financial analyst for small business owner.
    Based on the following summary of their invoice data, provide 2-3  concise and actionable insights.
    Each insight should be no string in a JSON array.
    The insights should be encouraging and helpful .  Do not just repeat the data provided.
    For example, if there is a high outstanding amount, suggest sending reminders. If the revenue is high be encouraging.

    Data Summary:
    ${dataSummary}
    Return your message as a valid JSON object with a single key"insights" containing an array of insight strings.
    Example format: {"insights":["Your revenue is looking strong this month!", "You have 5 overdue invoices. Consider sending reminders to get paid faster."]}
    `;
    const response = await ai.models.generateContent({ 
        model: 'gemini-1.5-flash-latest',
        contents:prompt,
     });
     const responseText = response.text;
     const cleanJson= responseText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    res.status(200).json(parsedData);
    }catch (error) {
        console.error("Error getting dashboard summary with AI:", error);
        res.status(500).json({ message: "Failed to parse invoice data from text", details: error.message });
    } 
};

module.exports = { parseInvoiceFormText, generateRemiderEmail, getDashboardSummary };
   
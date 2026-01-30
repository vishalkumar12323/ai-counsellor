import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { message, history } = await req.json();

        // Fetch user context
        const profile = await db.profile.findUnique({ where: { userId: session.id } });

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 400 });

        const systemPrompt = `
            You are an expert AI Study Abroad Counsellor. 
            Your goal is to guide the student: ${session.name}.
            
            Student Profile:
            - Education: ${profile.educationLevel}, ${profile.degree} (GPA: ${profile.gpa})
            - Goal: ${profile.targetDegree} in ${profile.fieldOfStudy}
            - Target Intake: ${profile.targetIntake}
            - Budget: ${profile.budgetRange} (${profile.fundingPlan})
            - Test Status: IELTS (${profile.ieltsScore || "Not taken"}), GRE (${profile.greScore || "Not taken"}).
            
            Your capabilities:
            1. Analyze their profile strength.
            2. Recommend universities (Dream, Target, Safe).
            3. Explain RISKS and COSTS.
            4. SHORTLIST universities.
            
            IMPORTANT: If the user explicitly asks to "shortlist", "save", or "add" a university to their list, you MUST output a JSON block at the end of your response to trigger the system action.
            Format:
            \`\`\`json
            {
                "action": "SHORTLIST",
                "university": "University Name",
                "location": "City, Country" (if known),
                "category": "Target" (inference based on profile)
            }
            \`\`\`
            
            Keep responses concise, encouraging, and professional. Use markdown formatting.
    `;

        let responseText = "";

        if (API_KEY) {
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            // Construct full history for stateless call
            const contents = [
                ...history,
                { role: "user", parts: [{ text: message }] }
            ];

            const result = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    { role: "system", parts: [{ text: systemPrompt }] },
                    ...contents
                ]
            })

            // Handle response
            if (result.text) {
                responseText = result.text;
            } else {
                responseText = JSON.stringify(result);
            }
        } else {
            responseText = mockResponse(message, profile);
        }

        // Check for Actions
        const actionMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (actionMatch) {
            try {
                const actionData = JSON.parse(actionMatch[1]);
                if (actionData.action === "SHORTLIST") {
                    // Save to DB
                    await db.savedUniversity.create({
                        data: {
                            userId: session.id,
                            name: actionData.university,
                            location: actionData.location,
                            category: actionData.category || "Target",
                            matchScore: 80,
                        }
                    });
                    responseText += "\n\n✅ **System Action**: " + actionData.university + " has been added to your shortlist.";
                }
            } catch (e) {
                console.error("Action parsing failed", e);
            }
        }

        return NextResponse.json({ response: responseText });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

function mockResponse(message: string, profile: any) {
    const msg = message.toLowerCase();

    if (msg.includes("suggest") || msg.includes("recommend")) {
        return `Based on your profile (GPA: ${profile.gpa}), here are some ${profile.preferredCountries} options:
        
        ### 1. Arizona State University (USA)
        - **Category**: Safe
        - **Why**: Strong match for ${profile.fieldOfStudy}. Your GPA is well above the requirement.

        ### 2. University of Manchester (UK)
        - **Category**: Target
        - **Why**: Reputable program, but requires a solid IELTS score.

        ### 3. University of Toronto (Canada)
        - **Category**: Dream
        - **Why**: Highly competitive. You need a strong SOP.

        Would you like me to **shortlist** any of these?`;
    }

    if (msg.includes("shortlist") || msg.includes("save")) {
        const uni = msg.replace("shortlist", "").replace("save", "").trim() || "University of Example";

        return `I'm adding ${uni} to your list.

        \`\`\`json
        {
        "action": "SHORTLIST",
        "university": "${uni}",
        "location": "Unknown",
        "category": "Target"
        }
        \`\`\`
        `;
    }

    return "I can help you with university shortlisting, profile analysis, and application guidance. What's on your mind?";
}

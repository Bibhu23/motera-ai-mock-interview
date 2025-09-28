// utils/scoringEngine.js
export function scoreResume(parsedData, role = "") {
    const parsed = parsedData.parsed || {};
    let score = 0;
    let feedback = [];

    // ---------------------------
    // 1. Format & ATS Compliance
    // ---------------------------
    if (parsed.sections?.length >= 4) {
        score += 15; // well-structured resume
    } else {
        feedback.push("Add more structured sections (Education, Skills, Experience, Projects).");
    }

    if (parsedData.normalized_text?.length > 500) {
        score += 10; // not too short
    } else {
        feedback.push("Your resume seems too short, expand with more details.");
    }

    // ---------------------------
    // 2. Role-Specific Skills
    // ---------------------------
    const roleSkillsMap = {
        "mern full stack developer": [
            "react", "node", "express", "mongodb", "javascript", "rest api", "git", "redux"
        ],
        "frontend developer": [
            "react", "angular", "vue", "css", "html", "javascript", "tailwind"
        ],
        "backend developer": [
            "node", "express", "mongodb", "sql", "api", "authentication"
        ],
        "data scientist": [
            "python", "machine learning", "tensorflow", "pandas", "statistics"
        ],
        "devops engineer": [
            "docker", "kubernetes", "ci/cd", "aws", "terraform", "linux"
        ],
    };

    const roleKey = role.toLowerCase();
    const skillsRequired = roleSkillsMap[roleKey] || [];
    const text = parsedData.normalized_text?.toLowerCase() || "";

    let matchedSkills = [];
    skillsRequired.forEach(skill => {
        if (text.includes(skill)) {
            score += 8;
            matchedSkills.push(skill);
        }
    });

    if (skillsRequired.length && matchedSkills.length === 0) {
        feedback.push(`Your resume does not mention required ${role} skills.`);
    }

    // ---------------------------
    // 3. Experience Scoring
    // ---------------------------
    if (parsed.experience?.length) {
        parsed.experience.forEach(exp => {
            if (exp.duration >= 12) score += 5; // 1+ year
            if (exp.role?.toLowerCase().includes("developer")) score += 5;
        });
    } else {
        feedback.push("No experience found, consider adding internships or projects.");
    }

    // ---------------------------
    // 4. Cap Score
    // ---------------------------
    if (score > 100) score = 100;

    return { score, matchedSkills, feedback };
}

import axios from "axios";

export const fetchJobs = async (skills, locations) => {
    let allJobs = [];

    // ✅ Handle both array and string inputs safely
    const skillsArray = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
            ? skills.split(",").map(s => s.trim()).filter(Boolean)
            : [];

    const locationArray = Array.isArray(locations)
        ? locations.filter(Boolean)
        : typeof locations === "string"
            ? [locations]
            : [];

    // ✅ Fetch jobs for each skill-location combo
    for (const skill of skillsArray) {
        for (const location of locationArray) {
            try {
                const res = await axios.get(
                    `http://localhost:7656/api/jobs?skill=${encodeURIComponent(skill)}&location=${encodeURIComponent(location)}`
                );

                // ✅ Ensure array response
                if (Array.isArray(res.data)) {
                    allJobs = allJobs.concat(res.data);
                }
            } catch (err) {
                console.error(`Failed to fetch jobs for ${skill} in ${location}:`, err.message);
            }
        }
    }

    // ✅ Remove duplicates if backend returns overlapping results
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job._id || job.id, job])).values());

    return uniqueJobs;


};

export const speakText = async (text, gender = "female", backendUrl = "http://localhost:7656") => {
    if (!text) return null;
    try {
        const response = await fetch(`${backendUrl}/api/speak`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, gender }),
        });
        const data = await response.json();
        if (data.audioUrl) {
            const audio = new Audio(`${backendUrl}${data.audioUrl}`);

            // Return a promise that resolves when audio finishes playing
            return new Promise((resolve, reject) => {
                audio.onended = () => {
                    console.log("✅ Audio playback finished");
                    resolve(audio);
                };
                audio.onerror = (error) => {
                    console.error("❌ Audio playback error:", error);
                    reject(error);
                };
                audio.play().catch((err) => {
                    console.error("❌ Audio play failed:", err);
                    reject(err);
                });
            });
        }
    } catch (err) {
        console.error("Error speaking text:", err);
        return Promise.reject(err);
    }
};
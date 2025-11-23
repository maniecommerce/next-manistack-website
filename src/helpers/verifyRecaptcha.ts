export async function verifyRecaptcha(token: string, expectedAction: string) {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    // 1️⃣ Basic success check
    if (!data.success) return { success: false, reason: "Invalid token" };

    // 2️⃣ Action verification (Required for v3)
    if (data.action !== expectedAction) {
      return { success: false, reason: "Invalid action" };
    }

    // 3️⃣ Hostname verification (Local + GitHub Codespaces + Production)
    const hostname = data.hostname;

    const localHosts = ["localhost", "127.0.0.1"];

    // GitHub Codespaces domains (3 types)
    const githubCodespacePattern1 = /^[a-z0-9-]+\.githubpreview\.dev$/i;
    const githubCodespacePattern2 = /^[a-z0-9-]+\.github\.dev$/i;
    const githubCodespacePattern3 = /^[a-z0-9-]+\.app\.github\.dev$/i;

    const allowedProductionDomains = [
      "yourdomain.com",
      "www.yourdomain.com"
    ];

    const isLocal = localHosts.includes(hostname);

    const isCodespace =
      githubCodespacePattern1.test(hostname) ||
      githubCodespacePattern2.test(hostname) ||
      githubCodespacePattern3.test(hostname); // ← NEW pattern added

    const isProduction = allowedProductionDomains.includes(hostname);

    if (!isLocal && !isCodespace && !isProduction) {
      return { success: false, reason: "Invalid hostname: " + hostname };
    }

    // 4️⃣ Score threshold (higher score = more human)
    if (data.score < 0.5) {
      return { success: false, reason: "Low score (bot suspected)" };
    }

    return { success: true, score: data.score };
  } catch (err) {
    console.error(err);
    return { success: false, reason: "Server error" };
  }
}

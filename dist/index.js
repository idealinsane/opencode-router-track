import * as fs from "fs";
import * as path from "path";
export default {
    id: "opencode.router-track",
    async setup(ctx) {
        // Use plugin-local data directory instead of hardcoded absolute path
        const PLUGIN_DIR = path.join(process.env.HOME ?? "", ".local/share/opencode/plugins/opencode-router-track");
        const RESOLVED_FILE = path.join(PLUGIN_DIR, "resolved.json");
        const hookReg = await ctx.session.hook("http.response", (event) => {
            const { providerID, model, response } = event;
            const reqModelId = model?.id ?? model?.modelID ?? "";
            // Match openrouter/free or any :free variant (providerID may be undefined)
            if (!(reqModelId === "openrouter/free" || reqModelId === "openrouter/openrouter/free" || reqModelId.endsWith(":free")))
                return;
            void (async () => {
                try {
                    const cloned = response.clone();
                    const text = await cloned.text();
                    // OpenRouter streaming response uses SSE (data: {...}) format
                    let selected = null;
                    for (const line of text.split("\n")) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data: "))
                            continue;
                        const chunk = trimmed.replace(/^data:\s*/, "");
                        if (chunk === "[DONE]")
                            continue;
                        try {
                            const parsed = JSON.parse(chunk);
                            selected = parsed?.model ?? parsed?.model_id ?? parsed?.provider ?? parsed?.provider_model ?? null;
                            if (typeof selected === "string" && selected)
                                break;
                        }
                        catch { }
                    }
                    // If no stream chunk matched, try full JSON (non-streaming)
                    if (!selected) {
                        try {
                            const parsed = JSON.parse(text);
                            selected = parsed?.model ?? parsed?.model_id ?? parsed?.provider ?? null;
                        }
                        catch { }
                    }
                    if (typeof selected === "string" && selected) {
                        try {
                            fs.mkdirSync(PLUGIN_DIR, { recursive: true });
                            await fs.promises.writeFile(RESOLVED_FILE, JSON.stringify({ model: selected }, null, 2), "utf8");
                        }
                        catch { }
                    }
                }
                catch {
                    // Ignore parse/write errors
                }
            })();
        });
        return () => {
            try {
                hookReg?.dispose?.();
            }
            catch { }
        };
    },
};
//# sourceMappingURL=index.js.map
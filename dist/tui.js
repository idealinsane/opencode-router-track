import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plugin } from "@opencode/plugin/tui";
import * as fs from "fs";
import * as path from "path";
const PLUGIN_DIR = path.join(process.env.HOME ?? "", ".local/share/opencode/plugins/opencode-router-track");
const RESOLVED_FILE = path.join(PLUGIN_DIR, "resolved.json");
function readResolvedFile() {
    try {
        const content = fs.readFileSync(RESOLVED_FILE, "utf8");
        const json = JSON.parse(content);
        return typeof json?.model === "string" ? json.model : null;
    }
    catch {
        return null;
    }
}
const routerPlugin = Plugin.define({
    id: "opencode.router-track",
    setup(context) {
        const { data, ui } = context;
        const isFreeRouter = () => {
            const m = ui.model.current();
            const modelID = typeof m?.modelID === "string" ? m.modelID : (m?.model ?? "");
            const providerID = typeof m?.providerID === "string" ? m.providerID : (m?.provider ?? "");
            return modelID === "openrouter/free" || (providerID === "openrouter" && modelID.endsWith(":free"));
        };
        function readLastMessageInfo() {
            try {
                const route = ui.router.current();
                if (!route || route.type !== "session")
                    return null;
                const msgList = data.session.message.list?.(route.sessionID) ?? [];
                const lastAssistant = [...msgList].reverse().find((m) => m.role === "assistant");
                if (!lastAssistant)
                    return null;
                const meta = lastAssistant.providerID ?? lastAssistant.modelID ?? lastAssistant.info?.model ?? lastAssistant.info?.providerModel ?? null;
                if (meta && meta !== "free" && meta !== "openrouter/free" && meta !== "openrouter")
                    return meta;
                return null;
            }
            catch {
                return null;
            }
        }
        const unsubscribe = data.listen?.(({ details }) => {
            const type = details?.type ?? "";
            if (type === "session.text.ended" || type === "session.execution.succeeded" || type === "message.updated" || type === "message.part.updated") {
                const msgInfo = readLastMessageInfo();
                if (msgInfo) {
                    try {
                        fs.mkdirSync(PLUGIN_DIR, { recursive: true });
                        fs.writeFileSync(RESOLVED_FILE, JSON.stringify({ model: msgInfo }));
                    }
                    catch { }
                }
            }
        });
        const fontFamily = "ui-monospace, SF Mono, Menlo, monospace";
        const slot = ui.slot({
            append: "sidebar.content",
            render: () => {
                if (!isFreeRouter())
                    return null;
                const fileModel = readResolvedFile();
                const msgMeta = readLastMessageInfo();
                const model = fileModel ?? msgMeta ?? null;
                const containerStyle = {
                    margin: 0,
                    padding: 0,
                    fontSize: "12px",
                    borderTop: `1px solid ${context.theme.border.normal}`,
                    borderBottom: `1px solid ${context.theme.border.normal}`,
                    background: context.theme.surface.elevated,
                };
                const detail = model ? `• ${model}` : "• selecting…";
                return (_jsxs("box", { style: containerStyle, children: [_jsx("text", { style: { fontWeight: "bold", fontFamily, fontSize: "12px", color: context.theme.text.highlight, margin: 0 }, children: "Free Models Router" }), _jsx("text", { style: { fontFamily, fontSize: "12px", color: context.theme.text.secondary, margin: 0 }, children: detail })] }));
            },
        });
        return () => {
            try {
                unsubscribe?.();
            }
            catch { }
            slot?.();
        };
    },
});
export default routerPlugin;
//# sourceMappingURL=tui.js.map
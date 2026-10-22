import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
    return {
        password: process.env["SESSION_SECRET"] || "hamza-pro-secret-session-salt-19978008-32chars",
        name: "hamza-gate",
        maxAge: 60 * 60 * 24 * 30,
        cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
    };
}

function passwordMatches(input: string, expected: string) {
    const a = createHash("sha256").update(input, "utf8").digest();
    const b = createHash("sha256").update(expected, "utf8").digest();
    return timingSafeEqual(a, b);
}

export const requireUnlocked = createServerFn({ method: "GET" }).handler(async () => {
    const session = await useSession<GateSession>(sessionConfig());
    if (!session.data.unlocked) throw redirect({ to: "/unlock" });
    return { ok: true as const };
});

export const unlockSite = createServerFn({ method: "POST" })
    .inputValidator((data: { password: string }) => data)
    .handler(async ({ data }) => {
        // كلمة المرور الافتراضية المخصصة للمالك: 19978008
        const expected = process.env["SITE_PASSWORD"] || "19978008";
        if (!passwordMatches(String(data.password ?? "").trim(), expected)) {
            return { ok: false as const };
        }
        const session = await useSession<GateSession>(sessionConfig());
        await session.update({ unlocked: true });
        return { ok: true as const };
    });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
    const session = await useSession<GateSession>(sessionConfig());
    await session.clear();
    return { ok: true as const };
});
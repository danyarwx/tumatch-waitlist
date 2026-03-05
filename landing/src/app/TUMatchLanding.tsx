"use client";
import React, { useMemo, useState } from "react";

export default function TUMatchLanding() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isTumEmail = useMemo(() => {
    const e = email.trim().toLowerCase();
    return e.endsWith("@tum.de") || e.endsWith("@mytum.de");
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setStatus("error");
      setMessage("Enter a valid email.");
      return;
    }
    if (!(clean.endsWith("@tum.de") || clean.endsWith("@mytum.de"))) {
      setStatus("error");
      setMessage("Use your TUM email (@tum.de or @mytum.de).");
      return;
    }

    setStatus("loading");
    try {
		const res = await fetch("/api/waitlist", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: clean }),
		});

		const data = await res.json();

		if (!res.ok) {
			setStatus("error");
			setMessage(data?.error ?? "Something went wrong.");
			return;
		}
      setStatus("success");
      setMessage("We will notify you when we launch!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div style={styles.page}>
      {/* background layers */}
      <div style={styles.bgGlowRed} />
      <div style={styles.bgGlowBlue} />

      {/* center stage */}
      <main style={styles.main}>
        <div style={styles.stage}>
          {/* “globe” visual */}
          <div style={styles.globeWrap} aria-hidden="true">
            <div style={styles.globe} />
            <div style={styles.arc1} />
            <div style={styles.arc2} />
          </div>

          {/* hero */}
          <section className="heroSection" style={styles.hero}>
            <div className="heroBadge" style={styles.badge}>
              <span style={styles.badgeText}>Early Access</span>
            </div>

            <h1 className="heroTitle" style={styles.hottest}>
              <span className="heroTitleLine1">the hottest app</span>{" "}
              <span className="heroTitleLine2">on campus</span>
              <span style={styles.hottestGlow} />
            </h1>

            <p className="heroStatement" style={styles.statement}>You didn’t come to university to be alone.</p>
            <p className="heroSub" style={styles.sub}>
              Scroll what’s happening in Heilbronn in the next 24 hours.
            </p>
            <p className="heroStatementSoft" style={styles.statementSoft}>Join events & meet new people today.</p>

            <form className="heroForm" onSubmit={onSubmit} style={styles.form}>
              <div className="heroInputRow" style={styles.inputRow}>
                <input
                  value={email}
                  onChange={(e) => {
                    setStatus("idle");
                    setMessage("");
                    setEmail(e.target.value);
                  }}
                  placeholder="your.name@tum.de"
                  type="email"
                  autoComplete="email"
                  className="heroInput"
                  style={styles.input}
                />
                <button
                  type="submit"
                  disabled={!email.trim() || !isTumEmail || status === "loading"}
                  className="heroButton"
                  style={{
                    ...styles.button,
                    ...((!email.trim() || !isTumEmail) ? styles.buttonDisabled : {}),
                  }}
                >
                  {status === "loading" ? "Checking…" : "Request access"}
                </button>
              </div>
            </form>
            {message && (
              <p
                style={{
                  ...styles.formMessage,
                  ...(status === "success" ? styles.formMessageSuccess : {}),
                  ...(status === "error" ? styles.formMessageError : {}),
                }}
              >
                {message}
              </p>
            )}
          </section>
        </div>
      </main>
      <style jsx>{`
        @media (max-width: 1024px) {
          .heroSection {
            padding: 28px 14px 24px !important;
          }

          .heroTitle {
            margin-top: -14px !important;
            font-size: clamp(30px, 11vw, 40px) !important;
          }

          .heroBadge {
            margin-top: -10px !important;
            margin-bottom: 20px !important;
          }

          .heroTitleLine1,
          .heroTitleLine2 {
            display: block !important;
            white-space: nowrap !important;
          }

          .heroTitleLine2 {
            margin-top: 2px !important;
          }

          .heroStatement {
            margin-top: 36px !important;
            font-size: 14px !important;
            line-height: 1.35 !important;
            white-space: nowrap !important;
          }

          .heroSub {
            margin-top: 12px !important;
            font-size: 13px !important;
            line-height: 1.45 !important;
            white-space: nowrap !important;
          }

          .heroStatementSoft {
            margin-top: 14px !important;
            font-size: 14px !important;
            line-height: 1.45 !important;
          }

          .heroForm {
            width: 100% !important;
            margin-top: 48px !important;
            padding: 12px !important;
            box-sizing: border-box !important;
          }

          .heroInputRow {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 12px !important;
          }

          .heroInput {
            width: 100% !important;
            min-width: 0 !important;
            height: 48px !important;
            font-size: 16px !important;
            box-sizing: border-box !important;
          }

          .heroButton {
            width: 100% !important;
            height: 48px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#070A0F",
    color: "#E6E8EE",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    position: "relative",
    overflow: "hidden",
  },

  // background
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
    backgroundSize: "56px 56px",
    opacity: 0.22,
    pointerEvents: "none",
  },
  bgGlowRed: {
    position: "absolute",
    width: 720,
    height: 720,
    borderRadius: 999,
    background: "radial-gradient(circle at center, rgba(255,0,61,0.22), transparent 62%)",
    right: -260,
    top: -240,
    filter: "blur(10px)",
    pointerEvents: "none",
  },
  bgGlowBlue: {
    position: "absolute",
    width: 900,
    height: 900,
    borderRadius: 999,
    background: "radial-gradient(circle at center, rgba(80,180,255,0.14), transparent 64%)",
    left: -340,
    bottom: -420,
    filter: "blur(10px)",
    pointerEvents: "none",
  },

  // layout
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 0,
  },
  stage: {
    width: "100%",
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    borderRadius: 0,
    border: "none",
    background: "transparent",
    backdropFilter: "none",
    position: "relative",
    overflow: "hidden",
    boxShadow: "none",
  },

  // globe visual
  globeWrap: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.95,
  },
  globe: {
    position: "absolute",
    width: "min(560px, 86vw)",
    height: "min(560px, 86vw)",
    borderRadius: "50%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.09), rgba(255,255,255,0.02) 58%, rgba(0,0,0,0) 72%)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 0 70px rgba(0,0,0,0.65) inset, 0 0 90px rgba(120,200,255,0.06)",
  },
  arc1: {
    position: "absolute",
    width: "min(760px, 100vw)",
    height: "min(760px, 100vw)",
    borderRadius: "50%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid rgba(80,180,255,0.14)",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  arc2: {
    position: "absolute",
    width: "min(700px, 92vw)",
    height: "min(700px, 92vw)",
    borderRadius: "50%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(18deg)",
    border: "2px solid rgba(255,0,61,0.12)",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  // hero content
  hero: {
    position: "relative",
    zIndex: 2,
    width: "min(980px, 100%)",
    padding: "44px clamp(20px, 4vw, 36px) 30px",
    boxSizing: "border-box",
    textAlign: "center",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    minHeight: 38,
    padding: "8px 18px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(8,11,18,0.72)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 18px rgba(0,0,0,0.3)",
    margin: "0 auto 16px",
  },
  badgeText: {
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(236,239,246,0.94)",
    fontWeight: 700,
  },

  hottest: {
    position: "relative",
    display: "inline-block",
    margin: 0,
    fontSize: "clamp(34px, 5.0vw, 56px)",
    fontWeight: 950,
    letterSpacing: -0.6,
    textTransform: "lowercase",
    color: "#FF003D",
    textShadow: "0 0 20px rgba(255,0,61,0.35), 0 0 46px rgba(255,0,61,0.20)",
  },
  hottestGlow: {
    position: "absolute",
    inset: -16,
    borderRadius: 18,
    background: "radial-gradient(circle at center, rgba(255,0,61,0.14), transparent 62%)",
    filter: "blur(8px)",
    zIndex: -1,
  },

  sub: {
    margin: "14px 0 0",
    fontSize: "clamp(18px, 2.2vw, 22px)",
    lineHeight: 1.6,
    color: "rgba(230,232,238,0.86)",
  },

  statement: {
    margin: "50px 0 0",
    fontSize: "clamp(20px, 2.5vw, 24px)",
    fontWeight: 800,
    color: "rgba(230,232,238,0.92)",
  },
  statementSoft: {
    margin: "12px 0 0",
    fontSize: "clamp(18px, 2.2vw, 21px)",
    color: "rgba(230,232,238,0.70)",
  },

  form: {
    marginTop: 50,
    padding: 14,
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.24)",
    boxShadow: "0 0 60px rgba(0,0,0,0.30)",
    maxWidth: 640,
    marginLeft: "auto",
    marginRight: "auto",
  },
  inputRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap", // makes mobile nice
  },
  input: {
    flex: "1 1 260px",
    height: 44,
    fontSize: 17,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(230,232,238,0.92)",
    padding: "0 12px",
    outline: "none",
    minWidth: 220,
  },
  button: {
    flex: "1 1 100%",
    width: "100%",
    height: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,0,61,0.35)",
    background: "rgba(255,0,61,0.10)",
    color: "rgba(255,215,225,0.95)",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(255,0,61,0.12)",
    whiteSpace: "nowrap",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  formMessage: {
    marginTop: 12,
    fontSize: 14,
    color: "rgba(230,232,238,0.78)",
  },
  formMessageSuccess: {
    color: "rgba(180,255,210,0.92)",
  },
  formMessageError: {
    color: "rgba(255,190,205,0.92)",
  },
};

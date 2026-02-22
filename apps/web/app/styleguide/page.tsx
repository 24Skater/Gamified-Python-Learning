"use client";

import { NesButton } from "@/components/nes/NesButton";
import { NesPanel } from "@/components/nes/NesPanel";
import { NesBadge } from "@/components/nes/NesBadge";
import { NesProgressBar } from "@/components/nes/NesProgressBar";
import { NesAlert } from "@/components/nes/NesAlert";
import { NesHud } from "@/components/nes/NesHud";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: "var(--nes-space-6)" }}>
      <h2
        style={{
          fontFamily: "var(--nes-font-display)",
          fontSize: "var(--nes-text-xl)",
          color: "var(--nes-primary)",
          marginBottom: "var(--nes-space-4)",
          borderBottom: "4px solid var(--nes-border)",
          paddingBottom: "var(--nes-space-2)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "var(--nes-space-4)" }}>
      <h3
        style={{
          fontFamily: "var(--nes-font-display)",
          fontSize: "var(--nes-text-sm)",
          color: "var(--nes-fg)",
          marginBottom: "var(--nes-space-2)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function DemoRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--nes-space-2)",
        alignItems: "center",
        marginBottom: "var(--nes-space-3)",
      }}
    >
      {children}
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div
      style={{
        background: "var(--nes-bg)",
        color: "var(--nes-fg)",
        minHeight: "100vh",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          background: "var(--nes-surface)",
          borderBottom: "4px solid var(--nes-border)",
          padding: "var(--nes-space-2) var(--nes-space-3)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--nes-space-2)",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--nes-font-display)",
              fontSize: "var(--nes-text-sm)",
              color: "var(--nes-primary)",
              marginRight: "var(--nes-space-3)",
            }}
          >
            NES UI Kit
          </span>
          {[
            ["#typography", "Type"],
            ["#buttons", "Buttons"],
            ["#panels", "Panels"],
            ["#badges", "Badges"],
            ["#progress", "Progress"],
            ["#forms", "Forms"],
            ["#alerts", "Alerts"],
            ["#hud", "HUD"],
            ["#icons", "Icons"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily: "var(--nes-font-display)",
                fontSize: "var(--nes-text-xs)",
                color: "var(--nes-fg)",
                textDecoration: "none",
                padding: "var(--nes-space-1) var(--nes-space-2)",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <main
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "var(--nes-space-5) var(--nes-space-3)",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "var(--nes-space-6)" }}>
          <h1
            style={{
              fontFamily: "var(--nes-font-display)",
              fontSize: "var(--nes-text-3xl)",
              color: "var(--nes-fg)",
              marginBottom: "var(--nes-space-2)",
            }}
          >
            NES Arcade UI Kit
          </h1>
          <p
            style={{
              fontFamily: "var(--nes-font-body)",
              fontSize: "var(--nes-text-base)",
              color: "var(--nes-muted)",
              lineHeight: "var(--nes-leading-normal)",
              maxWidth: 600,
            }}
          >
            A reusable component reference kit styled in NES / 8-bit arcade
            aesthetics. Built on NES.css, Press Start 2P, and pixelarticons.
          </p>
        </header>

        {/* ── Typography ───────────────────────────────── */}
        <Section id="typography" title="Typography">
          <SubSection title="Headings (Press Start 2P)">
            <div style={{ display: "grid", gap: "var(--nes-space-3)" }}>
              <h1
                style={{
                  fontFamily: "var(--nes-font-display)",
                  fontSize: "var(--nes-text-3xl)",
                }}
              >
                H1 — Quest Title
              </h1>
              <h2
                style={{
                  fontFamily: "var(--nes-font-display)",
                  fontSize: "var(--nes-text-2xl)",
                }}
              >
                H2 — Section
              </h2>
              <h3
                style={{
                  fontFamily: "var(--nes-font-display)",
                  fontSize: "var(--nes-text-xl)",
                }}
              >
                H3 — Subsection
              </h3>
              <h4
                style={{
                  fontFamily: "var(--nes-font-display)",
                  fontSize: "var(--nes-text-lg)",
                }}
              >
                H4 — Detail Label
              </h4>
            </div>
          </SubSection>

          <SubSection title="Body Text (Inter / system-ui)">
            <p
              style={{
                fontFamily: "var(--nes-font-body)",
                fontSize: "var(--nes-text-base)",
                lineHeight: "var(--nes-leading-normal)",
                maxWidth: 600,
                marginBottom: "var(--nes-space-2)",
              }}
            >
              Body copy uses a readable sans-serif font at 14px with generous
              1.6 line-height. Pixel fonts should only be used for headings,
              badges, and short labels — never for long paragraphs.
            </p>
            <p
              style={{
                fontFamily: "var(--nes-font-body)",
                fontSize: "var(--nes-text-sm)",
                lineHeight: "var(--nes-leading-normal)",
                color: "var(--nes-muted)",
              }}
            >
              Small text (12px) for captions and secondary info.
            </p>
          </SubSection>

          <SubSection title="Code (JetBrains Mono)">
            <NesPanel title="Code Block">
              <pre
                style={{
                  fontFamily: "var(--nes-font-mono)",
                  fontSize: "var(--nes-text-sm)",
                  lineHeight: "var(--nes-leading-loose)",
                  color: "var(--nes-success)",
                  margin: 0,
                  overflow: "auto",
                }}
              >
                {`def hello_world():
    print("Hello, adventurer!")
    return 42

# Run the quest
result = hello_world()`}
              </pre>
            </NesPanel>
          </SubSection>
        </Section>

        {/* ── Buttons ──────────────────────────────────── */}
        <Section id="buttons" title="Buttons">
          <SubSection title="Variants">
            <DemoRow>
              <NesButton>Default</NesButton>
              <NesButton variant="primary">Primary</NesButton>
              <NesButton variant="success">Success</NesButton>
              <NesButton variant="warning">Warning</NesButton>
              <NesButton variant="error">Error</NesButton>
              <NesButton disabled>Disabled</NesButton>
            </DemoRow>
          </SubSection>

          <SubSection title="Use Cases">
            <DemoRow>
              <NesButton variant="primary">Start Quest</NesButton>
              <NesButton variant="success">Run Code</NesButton>
              <NesButton variant="warning">Use Hint</NesButton>
              <NesButton variant="error">Reset</NesButton>
            </DemoRow>
          </SubSection>
        </Section>

        {/* ── Panels ───────────────────────────────────── */}
        <Section id="panels" title="Panels / Cards">
          <div style={{ display: "grid", gap: "var(--nes-space-3)" }}>
            <NesPanel title="Quest Brief">
              <p
                style={{
                  fontFamily: "var(--nes-font-body)",
                  fontSize: "var(--nes-text-base)",
                  lineHeight: "var(--nes-leading-normal)",
                }}
              >
                The village printer is broken! Write a function called{" "}
                <code
                  style={{
                    fontFamily: "var(--nes-font-mono)",
                    color: "var(--nes-success)",
                  }}
                >
                  fix_printer()
                </code>{" "}
                that returns the string{" "}
                <code
                  style={{
                    fontFamily: "var(--nes-font-mono)",
                    color: "var(--nes-warning)",
                  }}
                >
                  &quot;Hello World&quot;
                </code>
                .
              </p>
            </NesPanel>

            <NesPanel title="Dialog Box">
              <p
                style={{
                  fontFamily: "var(--nes-font-body)",
                  fontSize: "var(--nes-text-base)",
                  lineHeight: "var(--nes-leading-normal)",
                  marginBottom: "var(--nes-space-3)",
                }}
              >
                You found a{" "}
                <span style={{ color: "var(--nes-warning)" }}>Golden Key</span>!
                This unlocks the next chapter of your adventure.
              </p>
              <DemoRow>
                <NesButton variant="primary">Continue</NesButton>
                <NesButton>Close</NesButton>
              </DemoRow>
            </NesPanel>

            <NesPanel title="No Title Panel Example" dark={true}>
              <p
                style={{
                  fontFamily: "var(--nes-font-body)",
                  fontSize: "var(--nes-text-base)",
                  lineHeight: "var(--nes-leading-normal)",
                }}
              >
                A dark panel without a visible title bar, useful for content
                areas and sidebars.
              </p>
            </NesPanel>
          </div>
        </Section>

        {/* ── Badges ───────────────────────────────────── */}
        <Section id="badges" title="Badges / Chips">
          <SubSection title="Variants">
            <DemoRow>
              <NesBadge variant="primary">INFO</NesBadge>
              <NesBadge variant="success">+50 XP</NesBadge>
              <NesBadge variant="warning">NEW</NesBadge>
              <NesBadge variant="error">LOCKED</NesBadge>
            </DemoRow>
          </SubSection>
          <SubSection title="Contextual">
            <DemoRow>
              <NesBadge variant="success">COMPLETE</NesBadge>
              <NesBadge variant="primary">LV 5</NesBadge>
              <NesBadge variant="warning">HINT</NesBadge>
              <NesBadge variant="error">3 ERRORS</NesBadge>
            </DemoRow>
          </SubSection>
        </Section>

        {/* ── Progress / XP ────────────────────────────── */}
        <Section id="progress" title="Progress / XP Bars">
          <div style={{ display: "grid", gap: "var(--nes-space-3)" }}>
            <NesProgressBar
              value={75}
              max={100}
              variant="primary"
              label="XP: 75 / 100"
            />
            <NesProgressBar
              value={3}
              max={5}
              variant="success"
              label="Quests: 3 / 5"
            />
            <NesProgressBar
              value={1}
              max={3}
              variant="warning"
              label="Hints: 1 / 3"
            />
            <NesProgressBar
              value={90}
              max={100}
              variant="error"
              label="Boss HP: 90 / 100"
            />
          </div>
        </Section>

        {/* ── Forms ────────────────────────────────────── */}
        <Section id="forms" title="Forms">
          <NesPanel title="Login Form">
            <div style={{ display: "grid", gap: "var(--nes-space-3)" }}>
              <div className="nes-field">
                <label
                  htmlFor="sg-username"
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    display: "block",
                    marginBottom: "var(--nes-space-1)",
                  }}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="sg-username"
                  className="nes-input is-dark"
                  placeholder="Enter your hero name"
                />
              </div>

              <div className="nes-field">
                <label
                  htmlFor="sg-password"
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    display: "block",
                    marginBottom: "var(--nes-space-1)",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="sg-password"
                  className="nes-input is-dark"
                  placeholder="Secret passphrase"
                />
              </div>

              <div className="nes-field">
                <label
                  htmlFor="sg-difficulty"
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    display: "block",
                    marginBottom: "var(--nes-space-1)",
                  }}
                >
                  Difficulty
                </label>
                <div className="nes-select is-dark">
                  <select id="sg-difficulty" defaultValue="normal">
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    className="nes-checkbox is-dark"
                    defaultChecked
                  />
                  <span
                    style={{
                      fontFamily: "var(--nes-font-body)",
                      fontSize: "var(--nes-text-base)",
                      marginLeft: "var(--nes-space-2)",
                    }}
                  >
                    Remember me
                  </span>
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="radio"
                    className="nes-radio is-dark"
                    name="sg-class"
                    defaultChecked
                  />
                  <span
                    style={{
                      fontFamily: "var(--nes-font-body)",
                      fontSize: "var(--nes-text-base)",
                      marginLeft: "var(--nes-space-2)",
                    }}
                  >
                    Warrior
                  </span>
                </label>
                <label style={{ marginLeft: "var(--nes-space-3)" }}>
                  <input
                    type="radio"
                    className="nes-radio is-dark"
                    name="sg-class"
                  />
                  <span
                    style={{
                      fontFamily: "var(--nes-font-body)",
                      fontSize: "var(--nes-text-base)",
                      marginLeft: "var(--nes-space-2)",
                    }}
                  >
                    Mage
                  </span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="sg-notes"
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    display: "block",
                    marginBottom: "var(--nes-space-1)",
                  }}
                >
                  Notes
                </label>
                <textarea
                  id="sg-notes"
                  className="nes-textarea is-dark"
                  placeholder="Any notes for the guild master?"
                  rows={3}
                />
              </div>

              <DemoRow>
                <NesButton variant="primary">Login</NesButton>
                <NesButton>Cancel</NesButton>
              </DemoRow>
            </div>
          </NesPanel>
        </Section>

        {/* ── Alerts ───────────────────────────────────── */}
        <Section id="alerts" title="Alerts / Toasts">
          <div style={{ display: "grid", gap: "var(--nes-space-3)" }}>
            <NesAlert variant="success">
              Quest complete! You earned <strong>+100 XP</strong> and a{" "}
              <strong>Bronze Badge</strong>.
            </NesAlert>
            <NesAlert variant="warning">
              Careful! You have only <strong>1 hint</strong> remaining.
            </NesAlert>
            <NesAlert variant="error">
              <strong>SyntaxError</strong> on line 3: unexpected indent. Check
              your spacing and try again.
            </NesAlert>
          </div>
        </Section>

        {/* ── HUD Widgets ──────────────────────────────── */}
        <Section id="hud" title="HUD Widgets">
          <SubSection title="Full HUD Bar">
            <NesHud
              hearts={2}
              maxHearts={3}
              xp={75}
              xpMax={100}
              level={3}
              coins={42}
            />
          </SubSection>

          <SubSection title="Full Health">
            <NesHud
              hearts={5}
              maxHearts={5}
              xp={0}
              xpMax={200}
              level={1}
              coins={0}
            />
          </SubSection>

          <SubSection title="Low Health / High Level">
            <NesHud
              hearts={1}
              maxHearts={5}
              xp={180}
              xpMax={200}
              level={12}
              coins={999}
            />
          </SubSection>
        </Section>

        {/* ── Icons ────────────────────────────────────── */}
        <Section id="icons" title="Icons (pixelarticons)">
          <SubSection title="NES.css Built-in Icons">
            <p
              style={{
                fontFamily: "var(--nes-font-body)",
                fontSize: "var(--nes-text-sm)",
                color: "var(--nes-muted)",
                marginBottom: "var(--nes-space-2)",
                lineHeight: "var(--nes-leading-normal)",
              }}
            >
              NES.css includes pixel-art icons via CSS. These are used for
              hearts, coins, stars, and other game-themed indicators.
            </p>
            <DemoRow>
              <span>
                <i className="nes-icon heart" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    marginLeft: "var(--nes-space-2)",
                  }}
                >
                  heart
                </span>
              </span>
              <span>
                <i className="nes-icon heart is-empty" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    marginLeft: "var(--nes-space-2)",
                  }}
                >
                  empty
                </span>
              </span>
              <span>
                <i className="nes-icon star" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    marginLeft: "var(--nes-space-2)",
                  }}
                >
                  star
                </span>
              </span>
              <span>
                <i className="nes-icon star is-empty" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    marginLeft: "var(--nes-space-2)",
                  }}
                >
                  empty
                </span>
              </span>
              <span>
                <i className="nes-icon coin" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    marginLeft: "var(--nes-space-2)",
                  }}
                >
                  coin
                </span>
              </span>
              <span>
                <i className="nes-icon trophy" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--nes-font-display)",
                    fontSize: "var(--nes-text-xs)",
                    marginLeft: "var(--nes-space-2)",
                  }}
                >
                  trophy
                </span>
              </span>
            </DemoRow>
          </SubSection>

          <SubSection title="pixelarticons (SVG — via NesIcon)">
            <p
              style={{
                fontFamily: "var(--nes-font-body)",
                fontSize: "var(--nes-text-sm)",
                color: "var(--nes-muted)",
                marginBottom: "var(--nes-space-2)",
                lineHeight: "var(--nes-leading-normal)",
              }}
            >
              pixelarticons provides 480+ pixel-art SVG icons. Use the{" "}
              <code
                style={{
                  fontFamily: "var(--nes-font-mono)",
                  color: "var(--nes-success)",
                }}
              >
                NesIcon
              </code>{" "}
              component with size variants: sm (16px), md (24px), lg (32px), xl
              (48px). Icons inherit <code style={{ fontFamily: "var(--nes-font-mono)", color: "var(--nes-success)" }}>currentColor</code>.
            </p>
            <NesPanel title="Sizing Guide">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "var(--nes-space-3)",
                }}
              >
                {(["sm", "md", "lg", "xl"] as const).map((size) => (
                  <div
                    key={size}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "var(--nes-space-1)",
                    }}
                  >
                    <PixelIcon size={size} />
                    <span
                      style={{
                        fontFamily: "var(--nes-font-display)",
                        fontSize: "var(--nes-text-xs)",
                        color: "var(--nes-muted)",
                      }}
                    >
                      {size} ({size === "sm" ? 16 : size === "md" ? 24 : size === "lg" ? 32 : 48}px)
                    </span>
                  </div>
                ))}
              </div>
            </NesPanel>
          </SubSection>
        </Section>

        {/* ── Footer ───────────────────────────────────── */}
        <footer
          style={{
            borderTop: "4px solid var(--nes-border)",
            paddingTop: "var(--nes-space-4)",
            marginTop: "var(--nes-space-6)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--nes-font-display)",
              fontSize: "var(--nes-text-xs)",
              color: "var(--nes-muted)",
              textAlign: "center",
            }}
          >
            NES Arcade UI Kit — Code Quest Python
          </p>
          <p
            style={{
              fontFamily: "var(--nes-font-body)",
              fontSize: "var(--nes-text-sm)",
              color: "var(--nes-muted)",
              textAlign: "center",
              marginTop: "var(--nes-space-1)",
              lineHeight: "var(--nes-leading-normal)",
            }}
          >
            NES.css (MIT) + Press Start 2P (OFL) + pixelarticons (MIT) + Kenney
            assets (CC0)
          </p>
        </footer>
      </main>
    </div>
  );
}

/**
 * Inline pixel-art icon rendered as a static SVG for the sizing guide.
 * Uses a simple shield shape drawn inline to avoid async loading in the demo.
 */
function PixelIcon({ size }: { size: "sm" | "md" | "lg" | "xl" }) {
  const px = { sm: 16, md: 24, lg: 32, xl: 48 }[size];
  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: "var(--nes-primary)" }}
      aria-hidden="true"
    >
      {/* pixelarticons "shield" path */}
      <path d="M3 3h18v2h-2v2h-2v2h-2v2h-2v2h-2v2H9v2H7v2H5V3zm16 0v16h-2v-2h-2v-2h-2v-2h-2v-2H9V9H7V7H5V5H3V3h16z" />
    </svg>
  );
}

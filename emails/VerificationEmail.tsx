import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>GAMIX Verification Code</title>

        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrKOB5-KpZf4g.woff2",
            format: "woff2",
          }}
          fontWeight={400}
        />
      </Head>

      {/* Email preview text */}
      <Preview>Your GAMIX verification code is {otp}</Preview>

      {/* Background */}
      <Section
        style={{
          background: "linear-gradient(180deg, #0b0b12, #10101f)",
          padding: "40px 0",
        }}
      >
        {/* Main Card */}
        <Section
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            background: "#0f1320",
            padding: "36px 30px",
            borderRadius: "14px",
            border: "1px solid #1f2a38",
            boxShadow: "0px 0px 18px rgba(45, 212, 191, 0.15)",
          }}
        >
          {/* GAMIX Title */}
          <Heading
            as="h2"
            style={{
              textAlign: "center",
              fontSize: "30px",
              fontWeight: 800,
              marginBottom: "8px",
              letterSpacing: "2px",
              color: "#2DD4BF",
              textShadow: "0px 0px 12px rgba(45, 212, 191, 0.45)",
            }}
          >
            GAMIX
          </Heading>

          {/* Subtitle */}
          <Text
            style={{
              textAlign: "center",
              fontSize: "15px",
              marginBottom: "22px",
              color: "#b5c7d9",
            }}
          >
            Secure Account Verification
          </Text>

          {/* Greeting */}
          <Text
            style={{
              fontSize: "16px",
              color: "#d7e2ec",
              marginBottom: "16px",
            }}
          >
            Hello <strong style={{ color: "#2DD4BF" }}>{username}</strong>,
          </Text>

          {/* Main message */}
          <Text
            style={{
              fontSize: "15px",
              color: "#cdd7e5",
              lineHeight: "22px",
              marginBottom: "20px",
            }}
          >
            Thank you for creating your account on <strong>GAMIX</strong>.  
            Use the verification code below to complete your login:
          </Text>

          {/* OTP Display */}
          <Section
            style={{
              textAlign: "center",
              margin: "32px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "16px 22px",
                borderRadius: "12px",
                fontSize: "34px",
                fontWeight: 700,
                letterSpacing: "8px",
                color: "#2DD4BF",
                background: "rgba(45, 212, 191, 0.08)",
                border: "1px solid rgba(45, 212, 191, 0.35)",
                boxShadow: "0 0 18px rgba(45, 212, 191, 0.35)",
              }}
            >
              {otp}
            </div>
          </Section>

          {/* Button (Same as Sign In Button from your UI) */}
          {/* <Section style={{ textAlign: "center", marginTop: "12px" }}>
            <Button
              href="https://fictional-giggle-69p5r5rrw4qxh46px-3000.app.github.dev/sign-up"
              style={{
                padding: "12px 24px",
                background: "#2DD4BF",
                borderRadius: "10px",
                color: "#0b0b12",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "15px",
                border: "1px solid #2DD4BF",
                boxShadow: "0 0 12px rgba(45, 212, 191, 0.45)",
              }}
            >
              Continue to Login
            </Button>
          </Section> */}

          {/* Notice */}
          <Text
            style={{
              marginTop: "30px",
              fontSize: "14px",
              color: "#9aa8b8",
              textAlign: "center",
              lineHeight: "22px",
            }}
          >
            If you did not request this code, you can safely ignore this email.
          </Text>

          {/* Footer */}
          <Text
            style={{
              marginTop: "28px",
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7b8f",
            }}
          >
            © {new Date().getFullYear()} GAMIX. All rights reserved.
          </Text>
        </Section>
      </Section>
    </Html>
  );
}

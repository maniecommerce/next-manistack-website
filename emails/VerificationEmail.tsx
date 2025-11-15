import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
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
        <title>Manistack Verification Code</title>

        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrKOB5-KpZf4g.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      {/* Email Preview Line */}
      <Preview>Your Manistack verification code is {otp}</Preview>

      {/* Main Container */}
      <Section
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "32px 28px",
          borderRadius: "12px",
          border: "1px solid #e5e5e5",
        }}
      >
        {/* Brand Name */}
        <Heading
          as="h2"
          style={{
            textAlign: "center",
            fontSize: "26px",
            marginBottom: "10px",
            fontWeight: 700,
            color: "#333",
          }}
        >
          Manistack
        </Heading>

        {/* Subtitle */}
        <Text
          style={{
            textAlign: "center",
            fontSize: "15px",
            marginBottom: "22px",
            color: "#555",
          }}
        >
          Secure Account Verification
        </Text>

        {/* Greeting */}
        <Text
          style={{
            fontSize: "16px",
            color: "#444",
            marginBottom: "16px",
          }}
        >
          Hello <strong>{username}</strong>,
        </Text>

        {/* Message */}
        <Text
          style={{
            fontSize: "15px",
            color: "#444",
            lineHeight: "22px",
          }}
        >
          Thank you for registering with <strong>Manistack</strong>.  
          Please use the verification code below to complete your sign-up:
        </Text>

        {/* OTP Box */}
        <Section
          style={{
            margin: "28px 0",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              fontSize: "32px",
              fontWeight: 700,
              letterSpacing: "6px",
              padding: "12px 18px",
              background: "#f7faff",
              borderRadius: "10px",
              display: "inline-block",
              border: "1px solid #dce8ff",
              color: "#1a73e8",
            }}
          >
            {otp}
          </Text>
        </Section>

        {/* Footer Text */}
        <Text
          style={{
            fontSize: "14px",
            color: "#777",
            lineHeight: "22px",
          }}
        >
          If you did not request this code, you can safely ignore this email.
        </Text>

        <Text
          style={{
            marginTop: "32px",
            textAlign: "center",
            fontSize: "13px",
            color: "#999",
          }}
        >
          © {new Date().getFullYear()} Manistack. All rights reserved.
        </Text>
      </Section>
    </Html>
  );
}

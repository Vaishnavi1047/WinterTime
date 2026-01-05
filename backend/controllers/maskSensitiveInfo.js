function maskSensitiveInfo(text) {
  if (!text) return text;

  let masked = text;

  // Email
  masked = masked.replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[EMAIL REDACTED]"
  );

  // Phone (India + generic)
  masked = masked.replace(
    /\b(\+91[\s-]?)?[6-9]\d{9}\b/g,
    "[PHONE REDACTED]"
  );

  // Aadhaar (optional)
  masked = masked.replace(
    /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
    "[ID REDACTED]"
  );

  // PAN (optional)
  masked = masked.replace(
    /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g,
    "[ID REDACTED]"
  );

  return masked;
}

module.exports = maskSensitiveInfo;

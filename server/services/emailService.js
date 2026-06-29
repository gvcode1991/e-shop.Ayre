import nodemailer from "nodemailer";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendAccountConfirmationEmail(user, token) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "missing-smtp" };
  }

  const appUrl = process.env.PUBLIC_APP_URL || "https://e-shop-ayre.onrender.com";
  const confirmUrl = `${appUrl}/api/users/confirm/${token}`;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: "Confirma tu cuenta AyRe",
    text: `Hola ${user.name}, confirma tu cuenta para poder comprar en AyRe: ${confirmUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#241913">
        <h1>Confirma tu cuenta AyRe</h1>
        <p>Hola ${user.name}, necesitamos confirmar tu email para activar tu cuenta y habilitar tus compras.</p>
        <p><a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#9b7350;color:white;text-decoration:none">Activar cuenta</a></p>
        <p>Si el boton no funciona, copia este enlace:</p>
        <p>${confirmUrl}</p>
      </div>
    `,
  });

  return { sent: true };
}

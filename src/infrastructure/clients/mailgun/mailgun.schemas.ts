import { z } from 'zod';

export const mailgunConfigSchema = z.object({
  apiKey: z.string(),
  domain: z.string(),
  username: z.string(),
  defaultFrom: z.string(),
});

const receiverSchema = z.union([z.string().email(), z.array(z.string().email())]);

export const mailgunSendEmailSchema = z.object({
  from: z.string().email().optional(),
  to: receiverSchema,
  cc: receiverSchema.optional(),
  bcc: receiverSchema.optional(),
  subject: z.string(),
  content: z
    .object({
      text: z.string().optional(),
      html: z.string().optional(),
      mime: z.union([z.instanceof(Blob), z.instanceof(Buffer)]).optional(),
    })
    .refine((data) => data.text || data.html || data.mime, {
      message: 'At least one of text, html, or mime must be defined',
    })
    .refine(
      (data) => {
        const definedFields = [data.text, data.html, data.mime].filter(Boolean).length;
        return definedFields === 1;
      },
      {
        message: 'Only one of text, html, or mime must be defined',
      },
    ),
});

export type MailgunConfig = z.infer<typeof mailgunConfigSchema>;
export type MailgunSendEmailParams = z.infer<typeof mailgunSendEmailSchema>;

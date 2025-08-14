const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, filename } = req.body || {};
        const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (!email || !emailRegex.test(email)) {
            res.statusCode = 400;
            return res.json({ error: 'Invalid email' });
        }
        if (!filename) {
            res.statusCode = 400;
            return res.json({ error: 'Missing filename' });
        }

        const filePath = path.join(process.cwd(), filename);
        if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            return res.json({ error: 'File not found' });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const resend = new Resend(re_fDieNjhs_F9ULL5i8UFKdAfFujPKLNtZ3);
        await resend.emails.send({
            from: process.env.FROM_EMAIL || 'byyaha@resend.dev',
            to: email,
            subject: `Your requested PDF: ${filename}`,
            html: `<p>Thanks for requesting the PDF. It's attached to this email.</p>` +
                `<p>If you can't open the attachment, you can also download it here: <a href="${req.headers.origin || ''}/${encodeURIComponent(filename)}">Download link</a></p>`,
            attachments: [
                {
                    filename,
                    content: fileBuffer.toString('base64'),
                    contentType: 'application/pdf',
                },
            ],
        });

        res.statusCode = 200;
        return res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        return res.json({ error: 'Failed to send email' });
    }
};



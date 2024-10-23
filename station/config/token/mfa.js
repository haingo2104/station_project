import speakeasy from 'speakeasy';
import qrcode from 'qrcode';


export const generateMfaSecret = () => {
    return speakeasy.generateSecret({ length: 20 });
};

export const verifyMfaToken = (secret, token) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
    });
};

export const generateQrCode = async (secret, email) => {
    const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: `YourApp:${email}`,
        issuer: 'YourApp'
    });
    return await qrcode.toDataURL(otpauthUrl);
};

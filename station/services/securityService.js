// import { ClientError } from "../utils/errors/errorResponse.js"
// import { loginSchema, registerSchema } from "../utils/validators/securityValidator.js"
// import bcrypt from "bcryptjs"
// import prisma from "../config/prisma.js"

// export const registerService = async ({ fullname, email, confirmation, password }) => {
//     const { error, value } = registerSchema.validate({ fullname, email, confirmation, password })
//     if (error) {
//         throw new ClientError(error.message)
//     }
//     const user = await prisma.users.findUnique({ where: { email: value.email } })

//     if (user) {
//         throw new ClientError("invalida email adress")
//     }

//     return await prisma.users.create({
//         data: {
//             fullname: value.fullname,
//             email: value.email,
//             password: bcrypt.hashSync(value.password, bcrypt.genSaltSync(12))
//         }
//     })
// }

// export const loginService = async ({ email, password }) => {
//     const { error, value } = loginSchema.validate({ email, password })
//     if (error) {
//         throw new ClientError(error.message)
//     }
//     const user = await prisma.users.findUnique({ where: { email: value.email } })

//     if (!user) {
//         throw new ClientError("invalida email adress")
//     }
//     return user
// }

import { generateMfaSecret, verifyMfaToken, generateQrCode } from '../config/token/mfa.js';
import { ClientError } from "../utils/errors/errorResponse.js";
import { loginSchema, registerSchema } from "../utils/validators/securityValidator.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../config/prisma.js";
import sendMfaCode from '../config/mailer.js';
import { getAccessToken, verifyrefreshToken } from '../config/token/index.js';

// export const registerService = async ({ fullname, email, confirmation, password }) => {
//     const { error, value } = registerSchema.validate({ fullname, email, confirmation, password });
//     if (error) throw new ClientError(error.message);

//     const user = await prisma.users.findUnique({ where: { email: value.email } });
//     if (user) throw new ClientError("Invalid email address");

//     const secret = generateMfaSecret();
//     const qrCode = await generateQrCode(secret, value.email);

//     const newUser = await prisma.users.create({
//         data: {
//             fullname: value.fullname,
//             email: value.email,
//             password: bcrypt.hashSync(value.password, bcrypt.genSaltSync(12)),
//             mfaSecret: secret.base32
//         }
//     });

//     return { newUser, qrCode };
// };

export const registerService = async ({ fullname, email, confirmation, password, permissions }) => {
    const { error, value } = registerSchema.validate({ fullname, email, confirmation, password })
    if (error) {
        throw new ClientError(error.message)
    }
    const user = await prisma.users.findUnique({ where: { email: value.email } })

    if (user) {
        throw new ClientError("invalid email adress")
    }

    const newUser = await prisma.users.create({
        data: {
            fullname: value.fullname,
            email: value.email,
            password: bcrypt.hashSync(value.password, bcrypt.genSaltSync(12))
        }
    })

    if (permissions && permissions.length > 0) {
        const newPermissions = permissions.map(permissionId => ({
            user_id: newUser.user_id,
            permission_id: permissionId,
        }));

        await prisma.userPermissions.createMany({
            data: newPermissions,
        });
    }

    return newUser;
}

export const getUserPermissions = async (userId) => {
    try {
        const userPermissions = await prisma.userPermissions.findMany({
            where: { user_id: parseInt(userId) },
            include: { permission: true }, // Inclure les détails de la permission si nécessaire
        });

        return userPermissions.map(item => item.permission.name);
    } catch (error) {
        console.error('Erreur lors de la récupération des permissions:', error);
        throw new Error('Erreur lors de la récupération des permissions');
    }
}

export const getAllPermissions = async () => {
    try {
        return await prisma.permissions.findMany()
    } catch (error) {
        console.error('Erreur lors de la recupération des permissions:', error);
        throw new Error('Erreur lors de la recupération des permissions');
    }
}

export const updateUserPermissions = async (userId, permissions) => {
    try {
        await prisma.$transaction(async (prisma) => {
            // Supprimer toutes les permissions actuelles de l'utilisateur
            await prisma.userPermissions.deleteMany({
                where: { user_id:  parseInt(userId) },
            });

            // Ajouter les nouvelles permissions si elles existent
            if (permissions && permissions.length > 0) {
                const newPermissions = permissions.map(permissionId => ({
                    user_id:  parseInt(userId),
                    permission_id: permissionId,
                }));

                await prisma.userPermissions.createMany({
                    data: newPermissions,
                });
            }
        });

        return { message: 'Permissions mises à jour avec succès' };
    } catch (error) {
        console.error('Erreur lors de la mise à jour des permissions:', error);
        throw new Error('Erreur lors de la mise à jour des permissions');
    }
};


export const loginService = async ({ email, password }) => {
    // Recherche de l'utilisateur par email
    const user = await prisma.users.findUnique({ where: { email } });

    // Vérification des identifiants
    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Email ou mot de passe incorrect');
    }

    // Génération d'un code MFA aléatoire (6 chiffres)
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Mise à jour du code MFA dans la base de données
    await prisma.users.update({
        where: { email },
        data: { mfaCode }
    });

    // Envoi du code MFA par email
    await sendMfaCode(email, mfaCode);

    return { user, mfaRequired: true }; // Retourne l'utilisateur et signale que le MFA est requis
};


export const verifyMfaService = async ({ email, mfaCode }) => {
    // Recherche de l'utilisateur par email
    const user = await prisma.users.findUnique({ where: { email } });

    // Validation du code MFA
    if (!user || !user.mfaCode || user.mfaCode !== mfaCode) {
        throw new Error('Code MFA incorrect');
    }

    // Suppression du code MFA pour des raisons de sécurité
    await prisma.users.update({
        where: { email },
        data: { mfaCode: null }
    });

    return user; // Retourne l'utilisateur après vérification
};


export const refreshAccessToken = async (refreshToken) => {
    try {
        // Vérifier le refresh token
        const decodedRefresh = verifyrefreshToken(refreshToken);
        
        if (!decodedRefresh) {
            throw new Error('Invalid refresh token');
        }

        // Créer un nouveau access token en utilisant l'ID de l'utilisateur
        const newAccessToken = getAccessToken({ id: decodedRefresh.id });
        return newAccessToken;
        
    } catch (error) {
        throw new Error('Failed to refresh access token');
    }
};

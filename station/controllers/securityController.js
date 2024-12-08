// import { Router } from "express";
import { adminOnly, ConnectedOnly, nonConnectedOnly } from "../config/authorization/index.js";
// import { getAccessToken, getRefreshToken } from "../config/token/index.js";
// import { loginService, registerService } from "../services/securityService.js";

// export const securityRoute = Router()

// securityRoute.post('/register', async (req, res) => {
//     const user = await registerService(req.body)
//     return res
//         .status(201)
//         .cookie('access_token', getAccessToken(user), { httpOnly: true,secure : false, maxAge: 15*60*1000})
//         .cookie('refresh_token', getRefreshToken({ id: user.user_id }), { httpOnly: true,secure : false, maxAge: 24 * 3600 * 1000 })
//         .json({ user })
        
// })



// securityRoute.post('/login',async (req, res) => {
//     const user = await loginService(req.body)
//     return res
//         .status(200)
//         .cookie('access_token', getAccessToken(user), { httpOnly: true, secure: false, maxAge: 15*60*1000 })
//         .cookie('refresh_token', getRefreshToken({ id: user.user_id }), { httpOnly: true, secure: false, maxAge: 24 * 3600 * 1000 })
//         .json({ user })
        
// })

// securityRoute.delete('/logout', ConnectedOnly ,async(req, res) => {
//     return res
//         .status(200)
//         .clearCookie("access_token")
//         .clearCookie("refresh_token")
//         .json({message:"logged out"})
       
// })

import { Router } from "express";
import { registerService, loginService, verifyMfaService, refreshAccessToken, updateUserPermissions, getAllPermissions, getUserPermissions } from "../services/securityService.js";
import { getAccessToken, getRefreshToken } from "../config/token/index.js";

export const securityRoute = Router();

// securityRoute.post('/register', async (req, res) => {
//     const { newUser, qrCode } = await registerService(req.body);
//     return res
//         .status(201)
//         .cookie('access_token', getAccessToken(newUser), { httpOnly: true, secure: false, maxAge: 15 * 60 * 1000 })
//         .cookie('refresh_token', getRefreshToken({ id: newUser.user_id }), { httpOnly: true, secure: false, maxAge: 24 * 3600 * 1000 })
//         .json({ user: newUser, qrCode });
// });

securityRoute.post('/register', async (req, res) => {
    const user = await registerService(req.body)
    return res
        .status(201)
        .cookie('access_token', getAccessToken(user), { httpOnly: true,secure : false, maxAge: 15*60*1000})
        .cookie('refresh_token', getRefreshToken({ id: user.user_id }), { httpOnly: true,secure : false, maxAge: 24 * 3600 * 1000 })
        .json({ user })
        
})

securityRoute.get('/permissions', async (req, res) => {
    try {
        return res.status(200).json({ permissions: await getAllPermissions() })
    } catch (error) {
        next(error)
    }
})

securityRoute.get('/permissions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        return res.status(200).json({ permissions: await getUserPermissions(userId) })
    } catch (error) {
        next(error)
    }
})

securityRoute.post('/users/:userId/permissions', async (req, res) => {
    const { userId } = req.params;
    const { permissions } = req.body;

    try {
        const result = await updateUserPermissions(userId, permissions);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

securityRoute.put('/users/:userId/permissions', async (req, res) => {
    const { userId } = req.params;
    const { permissions } = req.body;
    
    if (!Array.isArray(permissions)) {
        return res.status(400).json({ error: "Le format des permissions est invalide" });
    }
    try {
        const result = await updateUserPermissions(userId, permissions);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

securityRoute.post('/login', async (req, res) => {
    try {
        const { user, mfaRequired } = await loginService(req.body);

        if (mfaRequired) {
            return res.status(200).json({
                mfaRequired: true, // Signale que le MFA est nécessaire
                message: 'Code MFA envoyé',
            });
        }

        return res
            .status(200)
            .cookie('access_token', getAccessToken(user), { httpOnly: false, secure: false, maxAge: 60 * 60 * 1000 })
            .cookie('refresh_token', getRefreshToken({ id: user.user_id }), { httpOnly: false, secure: false, maxAge: 24 * 3600 * 1000 })
            .json({ user });
    } catch (error) {
        console.error('Erreur de connexion:', error.message);
        return res.status(400).json({ error: error.message });
    }
});



securityRoute.post('/verify-mfa', async (req, res) => {
    const { email, mfaCode } = req.body;

    try {
        const user = await verifyMfaService({ email, mfaCode });

        return res
            .status(200)
            .cookie('access_token', getAccessToken(user), { httpOnly: false, secure: false, maxAge: 60 * 60 * 1000 })
            .cookie('refresh_token', getRefreshToken({ id: user.user_id }), { httpOnly: false, secure: false, maxAge: 24 * 3600 * 1000 })
            .json({ message: 'MFA verified', user });
    } catch (error) {
        console.error('Erreur de vérification du code MFA :', error.message);
        return res.status(400).json({ error: 'Code MFA incorrect' });
    }
});



securityRoute.delete('/logout', ConnectedOnly, async (req, res) => {
    return res
        .status(200)
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .json({ message: "Logged out" });
});

securityRoute.get('/profile', ConnectedOnly ,async(req, res) => {
    console.log("User from req:", req.user);
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.json({ user: req.user });
  });

  securityRoute.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }
    try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        return res
            .status(200)
            .cookie('access_token', newAccessToken, { httpOnly: false, secure: false, maxAge: 60 * 60 * 1000 })
            .json({ message: 'Access token refreshed' });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});




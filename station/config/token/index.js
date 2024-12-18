import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()
const accessKey = process.env.ACCESS_KEY || "edrter"
const refreshKey = process.env.REFRESH_KEY || "sdfgsdfgdf"


export const getAccessToken = (payload) => {
    return jwt.sign(payload, accessKey, { expiresIn: "60m" }); 
};

export const getRefreshToken = (payload) => {
    return jwt.sign(payload, refreshKey, { expiresIn: "30d" }); 
};


export const verifyAccessToken = (token) => {
    // jwt.verify(token, accessKey, (error, encoded) => {
    //     if (error) {
    //         throw new Error(error.message)
    //     } else {
    //         return encoded
    //     }
    // })
    return new Promise((resolve, reject) => {
        jwt.verify(token, accessKey, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
}

export const verifyrefreshToken = (token) => {
    // jwt.verify(token, refreshKey, (error, encoded) => {
    //     if (error) {
    //         throw new Error(error.message)
    //     } else {
    //         return encoded
    //     }
    // })
    return new Promise((resolve, reject) => {
        jwt.verify(token, refreshKey, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
}


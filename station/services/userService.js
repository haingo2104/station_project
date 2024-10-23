import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { registerSchema } from "../utils/validators/securityValidator.js"
import bcrypt from "bcryptjs"



export const ObtenirTousLesUtilisateurs = async() => {
    return await prisma.users.findMany(
        {
            include: {
                permissions: {
                    include: {
                        permission: { // Relation vers le modèle Permissions pour obtenir le nom
                            select: {
                                id : true ,
                                name: true // Sélectionner le nom de la permission
                            }
                        }
                    }
                }
            }
        }
    )
}

export const ObtenirUnUtilisateur = async(id) =>{
    const utilisateur = await prisma.users.findUnique({where : {user_id:id}})
    if(!utilisateur) {
        throw new NotFoundError("utilisateur not found or don't exist")
    }
    return utilisateur
}

export const SupprimerUtilisateur = async(id)=>{
    const utilisateur = await prisma.users.findUnique({where : {user_id:id}})
    if(!utilisateur) {
        throw new NotFoundError("utilisateur not found or don't exist")
    }
    await prisma.userPermissions.deleteMany({ where: { user_id: id } })
    return await prisma.users.delete({where : {user_id:id}})
}

export const ModifierUtilisateur = async(id, fullname, email , password, confirmation) =>{
    const utilisateur = await prisma.users.findUnique({where : {user_id:id}})
    if(!utilisateur) {
        throw new NotFoundError("utilisateur not found or don't exist")
    }
    const {error, value} = registerSchema.validate({fullname, email , password , confirmation})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.users.update({
        data : {
           fullname : value.fullname,
           email : value.email,
           password: bcrypt.hashSync(value.password, bcrypt.genSaltSync(12))

        },
        where : {
            user_id : id
        }
    })
}


export const ModifierRoleUtilisateur = async (id, role) => {
    const utilisateur = await prisma.users.findUnique({ where: { user_id: id } });
    if (!utilisateur) {
        throw new NotFoundError("Utilisateur non trouvé ou n'existe pas");
    }

    if (role !== 'USER' && role !== 'ADMIN') {
        throw new ClientError("Rôle invalide");
    }

    return await prisma.users.update({
        data: {
            role: role
        },
        where: {
            user_id: id
        }
    });
};
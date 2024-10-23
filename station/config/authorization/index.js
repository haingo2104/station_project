
export const ConnectedOnly =(req, res , next) =>{
    console.log('Middleware ConnectedOnly called');
    console.log('User in request:', req.user);

    if (!req.user) {
        console.log('No user found, sending 401');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('User found, proceeding to next middleware');
    next();
}

export const nonConnectedOnly = (req, res , next) =>{
    const user = req.user
    if(user){
        return res.status(401).json({message : "Unauthorized"})
    }
    next()

}

export const adminOnly =(req, res , next) =>{
    const user = req.user
    if (!user){
        return res.status(401).json({message : 'Unauthorized'})
    }
    if (!user.roles.includes('admin')) {
        return res.status(403).json({message : 'forbiden'})
    }
    next()
}

export const validateUserData = (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).send('Invalid user data');
    }
    next();
};
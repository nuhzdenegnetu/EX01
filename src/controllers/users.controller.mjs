export const getUsers = (req, res) => {
    res.send('List of users');
};

export const getUserById = (req, res) => {
    const { userId } = req.params;
    res.send(`User with ID: ${userId}`);
};
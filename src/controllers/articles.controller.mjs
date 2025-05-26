export const getArticles = (req, res) => {
    res.send('List of articles');
};

export const getArticleById = (req, res) => {
    const { articleId } = req.params;
    res.send(`Article with ID: ${articleId}`);
};
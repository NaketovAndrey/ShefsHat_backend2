import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    const postId = req.params.id;

    try {
        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true } // Получаем обновленный документ
        ).populate({ path: "user", select: ["fullName", "avatarUrl"] });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }
        
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось вернуть статью',
        });
    }
};

export const remove = async (req, res) => {
    const postId = req.params.id;

    try {
        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            ingredients: req.body.ingredients,
            description: req.body.description,
            time: req.body.time,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;


        await PostModel.updateOne(
            {
            _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageIrl: req.body.imageUrl,
                user: req.userId,
                ingredients: req.body.ingredients,
                description: req.body.description,
                time: req.body.time,
            },
        );
        
        res.json({
            success:true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    } 

};
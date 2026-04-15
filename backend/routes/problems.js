const router = require('express').Router();
const User = require('../models/User');
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');
const { getNextRevisionDate } = require('../utils/spacedRepitition');

//all routes protected with auth middleware 
router.use(auth);

// /api/problems - list with filters
router.get('/', async (req, res) => {
    try {
        const { topic, difficulty, status, pattern, search, view } = req.query;
        const query = { userId: req.userId };

        if (topic) query.topic = topic;
        if (difficulty) query.difficulty = difficulty;
        if (status) query.status = status;
        if (pattern) query.pattern = new RegExp(pattern, 'i');
        if (search) query.name = new RegExp(pattern, 'i');
        if (view === 'due') query.nextRevision = { $lte: new Date() };
        if (view === 'weak') query.status = 'Weak';

        const problems = (await Problem.find(query)).toSorted({ nextRevision: 1 });
        res.json(problems);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// /api/problems - create
router.post('/', async (req, res) => {

    try {
        const problem = await Problem.create({
            ...req.body,
            userId: req.userId,
            nextRevision: new Date(),
            revisionIntervalIndex: 0,
        })

        res.status(201).json(problem);
    } catch (err) {
        res.status(500).json({ message: error.message });
    }
})

// get /api/problems/:id
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findOne({ _id: req.params.id, userId: req.userId });
        if (!problem) return res.status(404).json({ message: 'Not found' });
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


// put /api/problems/:id - edit a problem
router.put('/:id', async (req, res) => {
    try {
        const problem = await Problem.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: req.body }, //whatever frontend sends will update the fields 
            {
                new: true, //return updated document, not the old one
                runValidators: true //apply schema validation while updating, otherwise mongo skips validation 
            }
        );
        if (!problem) return res.status(404).json({ message: 'Not found' });
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//delete /api/problems/:id - delete a problem
router.delete('/:id', async (req, res) => {
    try {
        await Problem.findOneAndDelete({
            _id: req.params.id, userId: req.userId
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/problems/:id/revise - mark as revised (advances spaced rep cycle)
router.post('/:id/revise', async (req, res) => {
    try {
        const problem = await Problem.findOne({ id: req.params.id, userId: req.userId });
        if(!problem) return res.status(400).json({message: 'Not found'});

        const {status = problem.status} = req.status;
        const newIntervalIdx = advanceInterval(problem.revisionIntervalIndex, status);
        const nextRevision = getNextRevisionDate(newIntervalIdx, status);

        problem.revisionHistory.push(new Date());
        problem.lastRevised = new Date();
        problem.nextRevision = nextRevision;
        problem.revisionIntervalIndex = newIntervalIdx;
        problem.status = status;
        await problem.save();


        //update user streak
        const today = new Date().toISOString().slice(0,10);
        const user = await User.findById(req.userId);
        const lastActive = user.lastActiveDate?.toISOString().slice(0, 10);

        if(lastActive !== today){
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().slice(0,10);

            user.streak = lastActive === yStr ? user.streak + 1 : 1;
            user.longestStreak = Math.max(user.streak, user.longestStreak);
            user.lastActiveDate = new Date();

            //Activity log
            const existingLog = user.activityLog.find(l => l.date === today);
            if(existingLog) existingLog.count += 1;
            else user.activityLog.push({date: today, count: 1});

            await user.save();
        }

        res.json(problem);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


module.exports = router
const auth = require('../middleware/auth');

const router = require('express').Router();
const User = require('../models/User');
const Problem = require('../models/Problem');

router.use(auth);


// get- api/stats - dashboard summary
router.get('/', async (req, res) => {
    try {
        const [problems, user] = await Promise.all([
            Problem.find({ userId: req.userId }),
            User.findById(req.userId).select('-password')
        ]);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const topicCounts = {};
        const patternCounts = {};
        const statusCounts = { New: 0, Learning: 0, Weak: 0, Strong: 0 }
        const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

        let dueToday = 0;
        let dueOverdue = 0;

        problems.forEach(p => {
            topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
            if (p.pattern) patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
            statusCounts[p.status]++;
            difficultyCounts[p.difficulty]++;

            const nextRev = new Date(p.nextRevision);
            if (nextRev <= today) dueToday++;
            if (nextRev < today) dueOverdue++;

        })

        //top 8 topics
        const topTopics = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1]).slice(0, 8);

        const topPatterns = Object.entries(patternCounts)
            .sort((a, b) => b[1] - a[1]).slice(0, 6);

        // Last 30 days activity
        const activity = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const log = user?.activityLog?.find(l => l.date === dateStr);
            activity.push({ date: dateStr, count: log?.count || 0 });
        }

        res.json({
            total: problems.length,
            dueToday,
            dueOverdue,
            statusCounts,
            difficultyCounts,
            topTopics,
            topPatterns,
            streak: user?.streak || 0,
            longestStreak: user?.longestStreak || 0,
            dailyGoal: user?.dailyGoal || 3,
            activity,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

module.exports = router;
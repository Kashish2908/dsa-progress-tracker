const INTERVALS = [1,3,7,15,30,60,120]; //DAYS

/**
 * Calculate next revision date based on current interval index and status
 * If status is weak, reset cycle and return today
 */

function getNextRevisionDate(intervalIndex, status){
    if(status === 'Weak') return new Date(); //due immediately

    const idx = Math.min(intervalIndex, INTERVALS.length - 1 );
    const days = INTERVALS[idx];
    const next = new Date();
    next.setDate(next.getDate() + days);
    return next;
}

/**
 * Advance interval index after successful revision
 * Resets to 0 if marked Weak
 */
function advanceInterval(currentIndex, newStatus){
    if(newStatus === 'Weak') return 0;
    return Math.min(currentIndex + 1, INTERVALS.length - 1);
}

module.exports = {getNextRevisionDate, advanceInterval, INTERVALS};
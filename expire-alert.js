const moment = require('moment');

class ExpireAlertResult {
    constructor(message) {
        this.message = message;
    }
    exists() {
        return this.message !== '';
    }
    getMessage() {
        return this.message;
    }
}
class ExpireAlert {
    constructor(domain, now) {
        this.domain = domain;
        this.now = now;
    }

    getAlert() {
        const result = {};
        if ( ! ('expire' in this.domain)) {
            return new ExpireAlertResult(`ドメインの有効期限が未取得です。${this.domain.domain}`);
        }
        if ( ! this.domain.expire) {
            return new ExpireAlertResult(`ドメインの有効期限が取得できませんでした。${this.domain.domain}`);
        }
        if (this.domain.expire.trim() === '') {
            return new ExpireAlertResult(`ドメインの有効期限が取得できませんでした。${this.domain.domain}`);
        }
        const expire = moment(this.domain.expire);
        let last_checked = moment('2000-01-01');
        if ('last_checked' in this.domain) {
            last_checked = moment(this.domain.last_checked);
        }

        const days_last = expire.diff(last_checked, 'days');
        const days = expire.diff(this.now, 'days');

        return this.checkDays(days_last, days, expire);
        result.hasNotify = days < 30;
        return result;
    }

    checkDays(days_last, days, expire) {
        const thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 170];
        const matchThreshold = thresholds.find(threshold => {
            console.log('days_last', days_last, 'days', days, 'threshold', threshold);
            if (days_last < threshold) {
                return false;
            }
            return days < threshold;
        });
        if (matchThreshold > 0) {
            return new ExpireAlertResult(`ドメインの有効期限まで、${matchThreshold}日を切りました。${this.domain.domain} 有効期限: ${expire.format('YYYY-MM-DD hh:mm:ss')}`);
        }
        return new ExpireAlertResult(``);
    }
    


};


module.exports = ExpireAlert;
// vim: set expandtab ts=4 sts=4 sw=4:

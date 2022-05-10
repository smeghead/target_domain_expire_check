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
        if ( ! ('domain_expire' in this.domain)) {
            return new ExpireAlertResult(`ドメインの有効期限が未取得です。${this.domain.domain}`);
        }
        if (this.domain.domain_expire.trim() === '') {
            return new ExpireAlertResult(`ドメインの有効期限が取得できませんでした。${this.domain.domain}`);
        }
        const domain_expire = moment(this.domain.domain_expire);
        let last_checked = moment('2000-01-01');
        if ('last_checked' in this.domain) {
            last_checked = moment(this.domain.last_checked);
        }

        const days_last = domain_expire.diff(last_checked, 'days');
        const days = domain_expire.diff(this.now, 'days');

        return this.checkDays(days_last, days, domain_expire);
        result.hasNotify = days < 30;
        return result;
    }

    checkDays(days_last, days, domain_expire) {
        const thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30];
        const matchThreshold = thresholds.find(threshold => {
            console.log('days_last', days_last, 'days', days, 'threshold', threshold);
            if (days_last < threshold) {
                return false;
            }
            return days < threshold;
        });
        if (matchThreshold > 0) {
            return new ExpireAlertResult(`ドメインの有効期限まで、${matchThreshold}日を切りました。${this.domain.domain} 有効期限: ${domain_expire.format('YYYY-MM-DD hh:mm:ss')}`);
        }
        return new ExpireAlertResult(``);
    }
    


};


module.exports = ExpireAlert;
// vim: set expandtab ts=4 sts=4 sw=4:

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
    static empty(alerts) {
        return ! alerts.some(alert => alert.exists());
    }
    static formatBody(alerts) {
        const existAlerts = alerts.filter(alert => alert.exists());
        const message = existAlerts.map(alert => alert.getMessage()).join('\n');
        return `ドメイン/SSLの有効期限通知です。

${message}

有効期限が切れる前に更新処理をお願いします。
`;
    }
}
class ExpireAlert {
    constructor(domain, now) {
        this.domain = domain;
        this.now = now;
    }
    getTypeName() {
        switch (this.domain.check_type) {
            case 'domain':
                return 'ドメイン';
            case 'ssl':
                return 'SSL証明書';
        }
    }

    getAlert() {
        const result = {};
        if ( ! ('expire' in this.domain)) {
            return new ExpireAlertResult(`${this.domain.domain} ${this.getTypeName()}の有効期限が未取得です。`);
        }
        if ( ! this.domain.expire) {
            return new ExpireAlertResult(`${this.domain.domain} ${this.getTypeName()}の有効期限が取得できませんでした。`);
        }
        if (this.domain.expire.trim() === '') {
            return new ExpireAlertResult(`${this.domain.domain} ${this.getTypeName()}の有効期限が取得できませんでした。`);
        }
        const expire = moment(this.domain.expire);
        let last_checked = moment('2000-01-01');
        if ('last_checked' in this.domain) {
            last_checked = moment(this.domain.last_checked);
        }

        const days_last = expire.diff(last_checked, 'days');
        const days = expire.diff(this.now, 'days');

        return this.checkDays(days_last, days, expire);
    }

    checkDays(days_last, days, expire) {
        const thresholds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 60, 90, 120, 150];
        const matchThreshold = thresholds.find(threshold => {
            if (days_last < threshold) {
                return false;
            }
            return days < threshold;
        });
        if (matchThreshold > 0) {
            return new ExpireAlertResult(`${this.domain.domain} ${this.getTypeName()}の有効期限まで、${matchThreshold}日を切りました。有効期限: ${expire.format('YYYY-MM-DD hh:mm:ss')}`);
        }
        return new ExpireAlertResult(``);
    }
};

module.exports = {
    ExpireAlert,
    ExpireAlertResult,
};
// vim: set expandtab ts=4 sts=4 sw=4:

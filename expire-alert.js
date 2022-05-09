const moment = require('moment');

const expire_alert = (domain, now) => {
    const result = {};
    if ( ! 'domain_expire' in domain) {
        result.hasNotify = true;
        return result;
    }
    const domain_expire = moment(domain.domain_expire);
    let last_checked = moment('2000-01-01');
    if ( ! 'last_checked' in domain) {
        last_checked = moment(domain.last_checked);
    }

    const days = domain_expire.diff(now, 'days');
    result.hasNotify = days < 30;
    return result;
};


module.exports = expire_alert;
// vim: set expandtab ts=4 sts=4 sw=4:

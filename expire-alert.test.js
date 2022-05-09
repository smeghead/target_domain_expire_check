const moment = require('moment');
const expire_alert = require('./expire-alert');

test('domain_expireが無いためアラートを出す', () => {
    const domain = {
        domain: 'example.com',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const result = expire_alert(domain, now);
    expect(result.hasNotify).toBe(true);
});
test('30日を切ったらアラートを出す', () => {
    const domain = {
        domain: 'example.com',
        domain_expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const result = expire_alert(domain, now);
    expect(result.hasNotify).toBe(true);
});
test('30日を切ってなければアラートなし', () => {
    const domain = {
        domain: 'example.com',
        domain_expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-24T13:49:26+00:00');
    const result = expire_alert(domain, now);
    expect(result.hasNotify).toBe(false);
});
// vim: set expandtab ts=4 sts=4 sw=4:

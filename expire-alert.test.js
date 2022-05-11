const moment = require('moment');
const ExpireAlert = require('./expire-alert');

test('expireが無いためアラートを出す', () => {
    const domain = {
        domain: 'example.com',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('ドメインの有効期限が未取得です。example.com');
});
test('expireがnullの場合、アラートを出す', () => {
    const domain = {
        domain: 'example.com',
        expire: null,
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('ドメインの有効期限が取得できませんでした。example.com');
});
test('expireが空の場合、アラートを出す', () => {
    const domain = {
        domain: 'example.com',
        expire: '',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('ドメインの有効期限が取得できませんでした。example.com');
});
test('30日を切ったらアラートを出す', () => {
    const domain = {
        domain: 'example.com',
        expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('ドメインの有効期限まで、30日を切りました。example.com 有効期限: 2022-05-25 02:07:08');
});
test('30日を切ってなければアラートなし', () => {
    const domain = {
        domain: 'example.com',
        expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-24T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(false);
});
test('20日を切ったらアラートを出す', () => {
    const domain = {
        domain: 'example.com',
        expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-05-01T13:49:26+00:00',
    };
    const now = moment('2022-05-05T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('ドメインの有効期限まで、20日を切りました。example.com 有効期限: 2022-05-25 02:07:08');
});
// vim: set expandtab ts=4 sts=4 sw=4:

const moment = require('moment');
const { ExpireAlert, ExpireAlertResult } = require('./expire-alert');

test('expireが無いためアラートを出すSSL証明書', () => {
    const domain = {
        domain: 'example.com',
        check_type: 'ssl',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('example.com SSL証明書の有効期限が未取得です。');
});
test('expireが無いためアラートを出す', () => {
    const domain = {
        domain: 'example.com',
        check_type: 'domain',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('example.com ドメインの有効期限が未取得です。');
});
test('expireがnullの場合、アラートを出す', () => {
    const domain = {
        domain: 'example.com',
        check_type: 'domain',
        expire: null,
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('example.com ドメインの有効期限が取得できませんでした。');
});
test('expireが空の場合、アラートを出す', () => {
    const domain = {
        domain: 'example.com',
        check_type: 'domain',
        expire: '',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('example.com ドメインの有効期限が取得できませんでした。');
});
test('30日を切ったらアラートを出す', () => {
    const domain = {
        domain: 'example.com',
        check_type: 'domain',
        expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-04-24T13:49:26+00:00',
    };
    const now = moment('2022-04-27T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('example.com ドメインの有効期限まで、30日を切りました。有効期限: 2022-05-25 02:07:08');
});
test('30日を切ってなければアラートなし', () => {
    const domain = {
        domain: 'example.com',
        check_type: 'domain',
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
        check_type: 'domain',
        expire: '2022-05-25T02:07:08Z',
        last_checked: '2022-05-01T13:49:26+00:00',
    };
    const now = moment('2022-05-05T13:49:26+00:00');
    const expire_alert = new ExpireAlert(domain, now);
    const result = expire_alert.getAlert();
    expect(result.exists()).toBe(true);
    expect(result.getMessage()).toBe('example.com ドメインの有効期限まで、20日を切りました。有効期限: 2022-05-25 02:07:08');
});

test('alerts にメッセージがあるかどうか。無い場合', () => {
    const alerts = [
        new ExpireAlertResult(''),
        new ExpireAlertResult(''),
        new ExpireAlertResult(''),
    ];

    expect(ExpireAlertResult.empty(alerts)).toBe(true);
});
test('alerts にメッセージがあるかどうか。ある場合', () => {
    const alerts = [
        new ExpireAlertResult(''),
        new ExpireAlertResult(''),
        new ExpireAlertResult('exist message.'),
    ];

    expect(ExpireAlertResult.empty(alerts)).toBe(false);
});
test('通知メールの本文の整形', () => {
    const alerts = [
        new ExpireAlertResult(''),
        new ExpireAlertResult('exist message1'),
        new ExpireAlertResult('exist message2'),
    ];

    const body = `ドメイン/SSLの有効期限通知です。

exist message1
exist message2

有効期限が切れる前に更新処理をお願いします。
`;
    expect(ExpireAlertResult.formatBody(alerts)).toBe(body);
});
// vim: set expandtab ts=4 sts=4 sw=4:

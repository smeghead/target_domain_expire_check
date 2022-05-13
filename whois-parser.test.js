const moment = require('moment');
const WhoisParser = require('./whois-parser');

test('正しくパースされている場合', () => {
    const whois = {
        'Registry Expiry Date': '2023-03-11T10:14:10Z',
    };
    const who = new WhoisParser(whois);
    expect(who.getExpire()).toBe('2023-03-11T10:14:10Z');
});
test('[有効期限]として定義されている場合', () => {
    const whois = {
        '_raw': 'hoge' +
            '[有効期限]                      2022/10/31',
    };
    const who = new WhoisParser(whois);
    expect(who.getExpire()).toBe('2022-10-31T00:00:00+00:00');
});
test('[Expiration Time]として定義されている場合', () => {
    const whois = {
        'Expiration Time': '2023-12-03 00:00:00',
        '_raw': 'hoge' +
            '[有効期限]                      2022/10/31',
    };
    const who = new WhoisParser(whois);
    expect(who.getExpire()).toBe('2023-12-03 00:00:00');
});
//   '[有効期限]                      2022/10/31\r\n' +
//
// vim: set expandtab ts=4 sts=4 sw=4:

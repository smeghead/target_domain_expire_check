const moment = require('moment');
const guessFormat = require('moment-guess');

class WhoisParser {
    constructor(whois) {
        this.whois = whois;
    }
    getExpire() {
        if ('Registry Expiry Date' in this.whois) {
            return this.whois['Registry Expiry Date'];
        }
        if ('Expiration Time' in this.whois) {
            return this.whois['Expiration Time'];
        }
        const raw = this.whois._raw;
        console.log(raw);
        const lines = raw.split("\r\n");

        const regexps = [
            /\[有効期限\]\s*(\S+)/,
        ];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let timestampExpression = '';
            regexps.forEach(regex => {
                const matches = line.match(regex);
                if (matches) {
                    timestampExpression = matches[1];
                }
            });
            if (timestampExpression) {
                const expire = moment(timestampExpression, guessFormat(timestampExpression));
                return expire.format();
            }
        }
        return '';
    }
}
module.exports = WhoisParser;
// vim: set expandtab ts=4 sts=4 sw=4:

const config = {
    TOPIC_ARN: process.env.TOPIC_ARN,
    DYNAMODB_TABLENAME: process.env.DYNAMODB_TABLENAME,
};
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const whois = require('whois-light');
const checkCertExpiration = require('check-cert-expiration');
const moment = require('moment');
const { ExpireAlert, ExpireAlertResult } = require('./expire-alert');
const WhoisParser = require('./whois-parser');


const notify = async (alerts) => {
    if (ExpireAlertResult.empty(alerts)) {
        return;
    }
    const params = {
        TopicArn: config.TOPIC_ARN,
        Subject: '👺ドメイン/SSL 有効期限チェック結果',
        Message: ExpireAlertResult.formatBody(alerts),
    };

    console.log('publish', params);
    await sns.publish(params).promise();
};
const check_expire = async domain => {
    switch (domain.check_type) {
        case 'domain':
            const who = await whois.lookup({format: true}, domain.domain);
            const whois_parser = new WhoisParser(who);
            domain.expire = whois_parser.getExpire();
            break;
        case 'ssl':
            const result = await checkCertExpiration(domain.domain);
            console.log(result);
            domain.expire = result.valid_to;
            break;
    }

    const now = moment();
    const expire_alert = new ExpireAlert(domain, now);
    const alert_ = expire_alert.getAlert();
    if (alert_.exists()) {
        console.log('ALERT', alert_.getMessage());
    }

    domain.last_checked = moment().format();
    return {
        Item: domain,
        Alert: alert_,
    };
};

exports.handler = async (event) => {
    const target = await dynamo.scan({ TableName: config.DYNAMODB_TABLENAME }).promise();

    const alerts = [];
    await Promise.all(target.Items.map(async domain => {
        console.log(domain);
        const result = await check_expire(domain);
        console.log('result', result);
        await dynamo
            .put({
                TableName: config.DYNAMODB_TABLENAME,
                Item: result.Item,
            })
            .promise();
        alerts.push(result.Alert);
    }));
    console.log('put');

    await notify(alerts);

    const response = {
        statusCode: 200,
        body: JSON.stringify(alerts),
    };
    return response;
};
// vim: set expandtab ts=4 sts=4 sw=4:

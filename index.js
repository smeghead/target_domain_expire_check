const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const whois = require('whois-light');
const moment = require('moment');

const check_expire = async domain => {
    console.log('whois execute!!!!!');
    const who = await whois.lookup({format: true}, domain.domain);

    console.log('who', who['Registry Expiry Date']);
    domain.domain_expire = who['Registry Expiry Date'];

    domain.last_checked = moment().format();

    return domain;
};

exports.handler = async (event) => {
    let body;
    const domains = await dynamo.scan({ TableName: "target_domain" }).promise();

    await Promise.all(domains.Items.map(async domain => {
        console.log(domain);
        const result = await check_expire(domain);
        console.log('result', result);
        await dynamo
            .put({
                TableName: "target_domain",
                Item: result,
            })
            .promise();
    }));
    console.log('put');

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};
// vim: set expandtab ts=4 sts=4 sw=4:

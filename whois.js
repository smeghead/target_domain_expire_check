const whois = require('whois-light');

const main = async () => {
	const data = await whois.lookup({format: true}, 'ntt.jp');
	console.log('complete');
	console.log(data);
};
main();

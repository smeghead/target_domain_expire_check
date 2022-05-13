#!/bin/bash
rm -rf node_modules/*
npm install --production
rm target_domain_expire_check.zip
zip -r target_domain_expire_check.zip index.js expire-alert.js whois-parser.js node_modules package-lock.json package.json

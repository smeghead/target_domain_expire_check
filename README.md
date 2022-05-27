# target_domain_expire_check #

ドメインの有効期限とSSL証明書の有効期限をチェックして、有効期限が迫ってきたら更
新を促すメール通知を行ないます。

## 利用サービス ##

* AWS Lambda
* DynamoDB
* Amazon SNS

## 設定 ##

### DynamoDB ###

テーブルを作成します。

以下の項目を含む

* domain (string) パーティションキー
* check_type (string) domain/ssl ソートキー

### Lambda ###

./make-zip.sh で作成したzipファイルをコードとしてアップロードします。

Lambdaの環境変数に、以下を設定する必要があります。

* TOPIC_ARN: SNSのトピックARN
* DYNAMODB_TABLENAME: DynamoDBのテーブル名

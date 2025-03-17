import { Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoService {
  private readonly dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({
      region: 'us-west-2',
      endpoint: 'http://dynamodb:8000',
      credentials: {
        accessKeyId: 'local', // Фейкові ключі для локального використання
        secretAccessKey: 'local',
      },
    });
    this.dynamoDbClient = DynamoDBDocumentClient.from(client);
  }

  async putItem(tableName: string, item: Record<string, any>) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    return this.dynamoDbClient.send(command);
  }
}
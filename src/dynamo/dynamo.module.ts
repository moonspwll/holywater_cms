import { Module } from '@nestjs/common';
import { DynamoService } from '@app/dynamo/dynamo.service';

@Module({
    controllers: [],
    providers: [DynamoService],
    exports: [DynamoService],
})
export class DynamoModule {};
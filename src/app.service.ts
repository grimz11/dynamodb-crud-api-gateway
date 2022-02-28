import { Injectable } from '@nestjs/common';
import {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { client } from './@core/config/db';

@Injectable()
export class AppService {
  getPost = async (payload) => {
    const response: any = { statusCode: 200 };

    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ postId: payload }),
      };
      const { Item } = await client.send(new GetItemCommand(params));

      console.log({ Item });
      response.body = JSON.stringify({
        message: 'Successfully retrieved post.',
        data: Item ? unmarshall(Item) : {},
        rawData: Item,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: 'Failed to get post.',
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  createPost = async (payload) => {
    const response: any = { statusCode: 200 };

    try {
      const body = payload;
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: marshall(body || {}),
      };
      const createResult = await client.send(new PutItemCommand(params));

      response.body = JSON.stringify({
        message: 'Successfully created post.',
        createResult,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: 'Failed to create post.',
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  updatePost = async (payload) => {
    const response: any = { statusCode: 200 };

    try {
      const body = JSON.parse(payload.body);
      const objKeys = Object.keys(body);
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ postId: payload.pathParameters.postId }),
        UpdateExpression: `SET ${objKeys
          .map((_, index) => `#key${index} = :value${index}`)
          .join(', ')}`,
        ExpressionAttributeNames: objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`#key${index}`]: key,
          }),
          {},
        ),
        ExpressionAttributeValues: marshall(
          objKeys.reduce(
            (acc, key, index) => ({
              ...acc,
              [`:value${index}`]: body[key],
            }),
            {},
          ),
        ),
      };
      const updateResult = await client.send(new UpdateItemCommand(params));

      response.body = JSON.stringify({
        message: 'Successfully updated post.',
        updateResult,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: 'Failed to update post.',
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  deletePost = async (payload) => {
    const response: any = { statusCode: 200 };

    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ postId: payload.pathParameters.postId }),
      };
      const deleteResult = await client.send(new DeleteItemCommand(params));

      response.body = JSON.stringify({
        message: 'Successfully deleted post.',
        deleteResult,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: 'Failed to delete post.',
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  getAllPosts = async () => {
    const response: any = { statusCode: 200 };

    try {
      const { Items } = await client.send(
        new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME }),
      );

      response.body = JSON.stringify({
        message: 'Successfully retrieved all posts.',
        data: Items.map((item) => unmarshall(item)),
        Items,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: 'Failed to retrieve posts.',
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };
}

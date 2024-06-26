import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "./ddbDocClient.js";

export const getTables = async () => {
  try {
    const data = await ddbDocClient.send(new ListTablesCommand({}));
    return data;
  } catch (err) {
    console.error(err);
  }
};


export const runQuery = async (building, startTime, endRange, dayCondition) => {
    const params = {
        KeyConditionExpression: "#meetingDay = :m AND #buildingDescriptionStartTime BETWEEN :b AND :r",
        ExpressionAttributeNames: {
            "#buildingDescriptionStartTime": "buildingDescription-startTime",
            "#meetingDay": dayCondition
        },
        ExpressionAttributeValues: {
            ":m": "True",
            ":b": building.concat('-', startTime),
            ":r": building.concat('-', endRange)
        },
        TableName: "class_schedule",
        IndexName: `${dayCondition}-buildingDescription-startTime-index`,
        ProjectionExpression: "displayName, title, description, locationDescription, startTime, endTime, course_id"
      };
    try {
      const data = await ddbDocClient.send(new QueryCommand(params));
      return data.Items;
    } catch (err) {
      console.error(err);
    }
  };

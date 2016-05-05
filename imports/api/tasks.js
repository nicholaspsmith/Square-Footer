import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

// { "_id" : "r3DYRZswErRMM75Ty",
// "width" : "120",
// "length" : "90",
// "squareFeet" : 74.999952,
// "createdAt" : ISODate("2016-05-05T02:43:49.006Z") }

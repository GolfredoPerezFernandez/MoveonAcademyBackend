/* eslint-disable no-else-return */
/* eslint-disable guard-for-in */
import  Parse  from 'parse/node';


export async function parseUpdate(tableName, object) {
  // Check if object exists in db

  const query = new Parse.Query(tableName);
  query.equalTo('transaction_hash', object.transaction_hash);
  const result = await query.first({ useMasterKey: true });
  if (result) {
    // Loop through object's keys
    for (const key in object) {
      result.set(key, object[key]);
    }
    return result?.save(null, { useMasterKey: true });
  } else {
    // Create new object
    const newObject = new Parse.Object(tableName);
    for (const key in object) {
      newObject.set(key, object[key]);
    }
    return newObject.save(null, { useMasterKey: true });
  }
}
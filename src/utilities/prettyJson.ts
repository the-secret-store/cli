/**
 * Returns a prettified string representation of the object
 */
export default function prettyJson(jsonObject: object, removeQuotes = false) {
  const prettifiedJson = JSON.stringify(jsonObject, null, '\t');
  return removeQuotes
    ? prettifiedJson.replace(/(?<!\\)"/g, '').replace(/\\(?!!")/g, '')
    : prettifiedJson;
}

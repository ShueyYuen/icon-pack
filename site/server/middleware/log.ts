export default defineEventHandler((event) => {
  console.log(
    'Date',
    new Date(),
    event.node.req.method,
    'request:',
    getRequestURL(event).toString()
  );
});

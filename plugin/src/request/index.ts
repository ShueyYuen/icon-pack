export * from './interceptor';

export function post(url: string, data: any) {
  return new Promise((resolve, reject) => {
    $.post({
      url: `${process.env.ICON_PLUGIN_BACKEND}${url}`,
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

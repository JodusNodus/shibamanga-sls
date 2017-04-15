export default (ms:number):Promise<any> =>
  new Promise<any>((res) => {
    setTimeout(res, ms);
  });

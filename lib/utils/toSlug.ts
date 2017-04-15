const toSlug = (str:string):string => str
.trim()
.toLowerCase()
.replace(/[^a-zA-Z0-9]/g, "")

export default toSlug;

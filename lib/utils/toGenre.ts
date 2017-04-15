import cleanText from "./cleanText";

export default (str:string):string => cleanText(str)
.toLowerCase()
.replace(/[^a-zA-Z0-9\ ]/g, "")
.replace(/\ /g, "-");

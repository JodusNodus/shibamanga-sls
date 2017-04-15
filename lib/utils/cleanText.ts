import { Html5Entities as Entities } from "html-entities";

const entities = new Entities();

export default (str:string):string => entities.decode(str.trim());

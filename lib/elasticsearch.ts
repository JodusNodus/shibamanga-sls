import * as elasticsearch from "elasticsearch";
import { ELASTICSEARCH_HOST } from "./constants";

const client = new elasticsearch.Client({ host: ELASTICSEARCH_HOST });
export default client;

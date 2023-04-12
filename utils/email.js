const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
  email: "codeaprogram@gmail.com",
  name: "Sridhar C @ fullapp",
};

module.exports = { tranEmailApi, sender };

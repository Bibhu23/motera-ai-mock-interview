import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")   // ✅ exact region endpoint
    .setProject("69004ea2002014ba9cb9");               // ✅ your Appwrite project ID

export const account = new Account(client);

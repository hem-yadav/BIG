import Graph from "../utils/graph-client";
import { User } from "@microsoft/microsoft-graph-types";
import Helpers from "./Helpers";
import { credentials } from "../config/azureConfig";

export default class Users {
  async getUsersAll(): Promise<User[]> {
    try {
      const result = await Graph.api("/users/")
        .select(
          "displayName,id,identities," + Helpers.parseAttributeName("Location")
        )
        .get();
      return result.value as User[];
    }
    catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async createUser(): Promise<User> {
    try {
      const user = {
        accountEnabled: true,
        displayName: "[Test] Adele Vance",
        mailNickname: "AdeleV",
        userPrincipalName: "AdeleV@" + credentials.TENANT_ID,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: "Test@1234",
        },
        [Helpers.parseAttributeName("Location")]: "Jaipur",
      };

      const result = await Graph.api("/users/").post(user);

      return result.value as User;

    }
    catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(): Promise<void> {
    try {
      const userId = "6cb73344-84db-421b-8ae8-acf8524e6ab8";
      const user = {
        businessPhones: ["+1 425 555 0109"],
        officeLocation: "18/2111",
        [Helpers.parseAttributeName("Location")]: "Jaipur",
      };

      await Graph.api("/users/" + userId).update(user);
    }
    catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

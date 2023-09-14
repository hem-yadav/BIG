import Graph from "../utils/graph-client"; // Import the corrected Graph class
import { User } from "@microsoft/microsoft-graph-types";
import Helpers from "./Helpers";
import { credentials } from "../config/azureConfig";

export default class Users {
  async getUsersAll(): Promise<User[]> {
    try {
      // Fetch users from Microsoft Graph API
      const result = await Graph.api("/users/") // Use the Graph instance
        //.filter("displayName eq 'Adele Vance'")
        .select(
          "displayName,id,identities," + Helpers.parseAttributeName("Location")
        )
        //.orderby('displayName') // Sorting not supported for current query.
        .get();

      return result.value as User[];
    } catch (error) {
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
        userPrincipalName: "AdeleV@" + credentials.TENANT_ID, // Use tenant id to create an internal Azure Active Directory user
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: "Test@1234",
        },
        [Helpers.parseAttributeName("Location")]: "Jaipur",
      };

      // Create user through Microsoft Graph API
      const result = await Graph.api("/users/").post(user); // Use the Graph instance

      return result.value as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(): Promise<void> {
    try {
      const userId = "6cb73344-84db-421b-8ae8-acf8524e6ab8"; // TODO: pass the existing user id
      const user = {
        businessPhones: ["+1 425 555 0109"],
        officeLocation: "18/2111",
        [Helpers.parseAttributeName("Location")]: "Jaipur",
      };

      // Create user through Microsoft Graph API
      await Graph.api("/users/" + userId).update(user); // Use the Graph instance
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

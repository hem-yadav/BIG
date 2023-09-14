import { credentials } from "../config/azureConfig";

class Helpers {
    static parseAttributeName(attributeName: string): string {
      const b2cExtensionAppClientId: string | undefined = credentials.B2C_EXTENSION_APP_CLIENT_ID;
      
      if (!b2cExtensionAppClientId) {
        throw new Error('B2C_EXTENSION_APP_CLIENT_ID is not defined in the environment.');
      }
  
      const formattedB2cExtensionAppClientId = b2cExtensionAppClientId.replace(/-/g, "");
      return "extension_" + formattedB2cExtensionAppClientId + "_" + attributeName;
    }
  }
  
  export default Helpers;
  
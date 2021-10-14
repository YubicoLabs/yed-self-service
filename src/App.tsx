import { withAuthenticator } from "@aws-amplify/ui-react";
import { Container, CircularProgress } from "@material-ui/core";
import Amplify, { Auth } from "aws-amplify";
import React, { Suspense } from "react";
import { Provider } from "react-redux";

import awsconfig from "./aws-exports";
import AppRoutes from "./routes/app-routes";
import { changeLanguage, initI18n } from "./services/i18n";
import { rootStore } from "./store/root.store";

Amplify.configure(awsconfig);

const defaultLanguage = "en-US";
initI18n(process.env.PUBLIC_URL + "/i18n/{{lng}}.json", defaultLanguage);
changeLanguage(defaultLanguage);

Auth.currentAuthenticatedUser({
  bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
})
  .then((user) => console.log(user))
  .catch((err) => console.log(err));

function App() {
  return (
    <Container maxWidth="lg">
      <Suspense fallback={<CircularProgress />}>
        <Provider store={rootStore}>
          <AppRoutes />
        </Provider>
      </Suspense>
    </Container>
  );
}
export default withAuthenticator(App);

<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Apache-2.0][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="https://assets.brandfolder.com/q2tsde-8kenzk-4cg1pz/v/8222261/original/Yubico%20Logo%20Big%20(PNG).png" alt="Logo" width="363" height="100">
  </a>

<h3 align="center">YED Self Service Portal</h3>

  <p align="center">
    Create a web portal driven by the YubiEnterprise API that allows your customers to order from your organization's inventory
    <br />
    <a href="https://github.com/YubicoLabs/yed-self-service/tree/master#about-the-project"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/YubicoLabs/yed-self-service/issues">Report Bug</a>
    ·
    <a href="https://github.com/YubicoLabs/yed-self-service/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#reference-architecture">Reference Architecture</a>
    </li>
    <li>
      <a href="#built-with">Built With</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#configuring-your-deployment-environment">Configuring Your Deployment Environment</a></li>
    <li><a href="#about-the-lambda-logic">About the Lambda Logic</a></li>
    <li><a href="#about-the-react-app">About the React App</a></li>
    <li><a href="#next-steps">Next Steps</a></li>
    <li><a href="#faqs-and-common-issues">FAQs and Common Issues</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

YubiEnterprise Delivery is a cloud-based service that enables streamlined distribution of YubiKeys to end-users’ offices or residential addresses, both domestic and international.

While YubiEnterprise Delivery (YED) can be driven entirely through the pre-built console, it comes with an API that allows for the ability to extend the functionality. This will allow your organization's developers to integrate the API into custom solutions that further meet the requirements of your business.

This example will demonstrate an end-to-end solution demonstrating the ability to integrate the YED API into a web application that users in your enterprise (or beyond) could use to create YubiKey orders from your organizations inventory.

In this project you will

- Stand up an environment in AWS to handle the server side operations for the YED API and for handling user authentication/authorization
- Use the YED API to create, delete, edit, and retrieve shipments as well as verify a shipment address
- Create a front end application for your end users to order a YubiKey that has been defaulted by your organization

**Disclaimer** - This project is not meant to act as a production ready solution for **all** organizations. It is meant to demonstrate a reference architecture for how the YED API can be integrated into a custom application.

<p align="right">(<a href="#top">back to top</a>)</p>

## Reference Architecture

![Reference Architecture](/docs/images/arch-diagram.png)

Here is a description of each of the components above, and why they are included in this project

1. **YubiKey Ordering Web App** - The client for your application which will allow your end users to create, manage, and track their personal shipment
2. **OpenID Connect Identity Provider** - Used to establish the identity of your user. In this project it is currently used to pull the JWT token to authorize the user, and track their shipments anonymously in the database. It is expected that you will eventually use your organizations IdP - which you can extend to automatically pull user claims (email, name, address)
3. **API Gateway** - Manages your API that your client will use to make calls to your backend service, which will relay orders to YED
4. **Order Management Service** - This is the core of your backend logic - This is where you will configure how your app will handle user requests and send them to YED. It also provides a way to abstract away the YED API secret from the client
5. **Order Database** - Used to track the relationship between a user and their shipment IDs
6. **YED API** - Your organizations instance of YED
7. **Email / SMS Notification** - An example is included that can send an email alert to an admin if the amount of inventory remaining falls under a specified threshold

## Built With

- [YubiEnterprise Delivery](https://console.yubico.com/help/introduction.html)
- [YubiEnterprise API](https://console.yubico.com/apidocs/#operation/CreateShipmentExact)
- [React.js](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Formik](https://formik.org/)
  - [This tutorial](https://javascript.plainenglish.io/step-to-step-guide-on-building-a-checkout-form-in-react-5f28af1c1fdf) and [this repository](https://github.com/xiongemi/react-checkout-form) are good primers for how the Form and Order Flow were created for this site

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

- YubiEnterprise Delivery Instance
  - For an API key contact your organization's Yubico Owner or your [Yubico sales contact](https://pages.yubico.com/contact)
  - Ensure you also have the API URL for your instance of YED
- [AWS Account](https://aws.amazon.com/free/)
  - The AWS CLI requires specific IAM permissions to perform various actions needed to deploy your application. Please ensure your AWS account has all the permissions listed in [this guide](https://docs.amplify.aws/cli/reference/iam/)
- Install the AWS CLI v2
  - [Download link here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
  - Ensure the CLI is configured to your AWS Account
- Install the AWS Amplify CLI
  - [Download link here](https://docs.amplify.aws/cli/)
  - Ensure you have configured the Amplify CLI ([Instructions here](https://docs.amplify.aws/cli/start/install/))
- AWS SNS Instance
  - Amplify is unable to create the SNS resource required to send alerts for low inventory. Follow these instructions to create an SNS resource:
    1. Open AWS SNS
    2. In the section labeled "Topics" click **Create Topic**
    3. Name the topic **inv-monitor** - Keep the default setting
    4. Once created go into "Subscriptions"
    5. Set protocol to **Email**, and on Endpoint enter the email address of your YED Admin to receive inventory alerts
    6. Ensure that you confirm the email in your inbox to continue to begin to receive alerts from AWS SNS
  - You are now ready to send alerts through this application

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:YubicoLabs/yed-self-service.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Configuring Your Deployment Environment

There are a few different options for creating your backend environment using Amplify. The following three sections outline the steps for creating your environment. Below is an overview of the options

- [Automatically Configure Your Amplify Environment](#automatically-configure-your-amplify-environment) - Single button offered by Amplify to build and configure your full environment
- [Using This Repository to Deploy Your Amplify Environment](#using-this-repository-to-deploy-your-amplify-environment) - **This is the recommended option** - Clone this repo directly, and enter a few commands to deploy the environment using CloudFormation and to configure your application secret

<p align="right">(<a href="#top">back to top</a>)</p>

## Automatically Configure Your Amplify Environment

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/YubicoLabs/yed-self-service)

<p align="right">(<a href="#top">back to top</a>)</p>

## Using This Repository to Deploy Your Amplify Environment

If the Amplify CLI detects an Amplify project in your directory, you only need to run a few commands to deploy and configure the environment. This option has less overhead than the Manual option.

1. Ensure that you have cloned this repository - Open the terminal in the root of your project directory and run the following command
   ```sh
   amplify init
   ```
2. Use the following values to initialize your Amplify environment
<<<<<<< HEAD
    - Do you want to use an existing environment? No
    - Environment Name: yeddev
    - Default Editor: Make your personal selection
    - Authentication Method: AWS Profile -> Select your personal profile
    - **Give the terminal a moment to initialize the project, there are more prompts**
    - Select Update Secret Values Now
      - Select yedselfsvcex
      - Update a secret
      - YED_API_TOKEN
      - Enter your API token from the YED console
    - Select I'm done
3. Add your environment variables
    - Once your project has finished initializing run the following command
    ```sh
    amplify update function
    ```
    - Select yedselfsvcex
    - Select 'Environment variables configuration'
    - You will now create the first env variable for your YED API URL. *Please note* - These env variable names are case sensitive
      - Variable Name - YED_API_URL
      - Variable Value - https://api.console.yubico.com/v1
    - We will now create the env variable to set the default product used by the application
      - Add new environment variable
      - Variable Name - DEFAULT_PRODUCT_ID
      - Variable Value - 5
    - Select 'I'm done'
    - Select 'N' when asked if you want to update the local lambda function
4. All that is left is to publish your Amplify Env using the following command
    ```sh
    amplify publish
    ```
5. Your website is ready to use, now run the following command
    ```sh
    npm start
    ```
<p align="right">(<a href="#top">back to top</a>)</p>

## Manually Configure Your Amplify Environment

Amplify provides a set of tools that will allow us to quickly provision cloud resources in AWS to begin quickly building and deploying our application. For this tutorial we will create the following Amplify Resources -

- API - Using API Gateway and Lambda
- Authentication - Using Cognito
- Storage - Using DynamoDB

### Initialize your Amplify environment

1. Open the terminal in the root of your project directory and run the following command
   ```sh
   amplify init
   ```
2. Use the following values to initialize your Amplify environment
   - Enter a name for the project (react-amplified): yed-example
   - Enter a name for the environment (dev): dev
   - Choose the type of app that you're building (javascript): react
   - Use default values for the other configurations

### Initialize Cognito for authentication

**Note:** The default configurations created here are not recommended for a production environment. It is expected that you will replace this module with the identity provider used by your organization

1. Run the following command

   ```sh
   amplify add auth

=======
   - Do you want to use an existing environment? No
   - Environment Name: yeddev
   - Default Editor: Make your personal selection
   - Authentication Method: AWS Profile -> Select your personal profile
   - **Give the terminal a moment to initialize the project, there are more prompts**
   - Select Update Secret Values Now
     - Select yedselfsvcex
     - Update a secret
     - YED_API_TOKEN
     - Enter your API token from the YED console
     - Select 'I'm done' and perform the same steps for the resource yedselfserviceinv
     - yedselfserviceinv will also require a secret variable for the AWS SNS resource - Please ensure you follow these steps, or set the secret after the lambda function is initialized
   - Select I'm done
3. All that is left is to publish your Amplify Env using the following command
   ```sh
>>>>>>> 27da279fe80b8ccb21a87a929139c65b58e23036
   amplify push
   ```
   - In this step you will be prompted to add your environment variables. Ensure you add environment variables for the -
     - yedselfserviceinv - YED_API_URL: https://api.console.yubico.com/v1
     - yedselfserviceinv - INV_THRESHOLD: 500 (or whatever number works for your inventory quantities)
     - yedselfserviceex - YED_API_URL: https://api.console.yubico.com/v1
     - yedselfserviceex - DEFAULT_PRODUCT_ID: 5
   - **If your initial build fails, run the amplify push command another time**
4. Your website is ready to use, now run the following command

```sh
npm start
```

<p align="right">(<a href="#top">back to top</a>)</p>

## About the Lambda Logic

The Lambda resource is where your backend logic will reside - This is important as this is where your application will be calling directly to the YED API to create, manage, and get orders (and perform other operations like address validate).

The current application does not have a corresponding endpoint to every operation in YED. If additional functionality is required, use the code as a template for calling the other YED endpoints

**Where is my lambada logic?** - You don't need to go into the Lambda resource directly to edit your lambda, it can be done directly from your project. The Lambda index can be found in the directory **amplify > backend > function > yedselfsvcex > src > index.js**

### On using Env and Secret Variables

At the top of the file there are some definitions that are generated based on configurations you have made using the Amplify CLI. If your code isn't working for some reason, make sure that you followed the same naming convention that was used.

### How is the code structured

There are three tiers to the entire example

- Definition of variables
- Logic to call to YED or to Storage
- exports.handler which acts as the "main" whenever this function is called

### About exports.handler

As noted about it acts as the "main" of the application. It has four primary responsibilities

- Gets the Secret Variables from the AWS SSM
- Takes the JWT token passed by the user, and gets the user_sub. This will be used to identify the user
- Switch/Case that reacts to the particular operation + path called by the user
- Returns the response to the client

### About the YED Calls

Every method essentially calls to the YED API in the same manner - The call is made and the data from the response is sent directly to the client.

There are some checks on top of some of the calls to check if the user has permission to CRUD to the shipment.

There is a 1:1 relationship between the operations + paths defined in exports,handler, and a method that calls to YED. There are a few helper methods if something needs to be done with the storage resource.

<p align="right">(<a href="#top">back to top</a>)</p>

## About the Inventory Alert

The second lambda function, yedselfserviceinv, introduces the functionality to alert an administrator if your YubiKey quantity falls below a specific threshold.

The current logic compares ALL the items of your inventory from a result of a GET /inventory API call. This lambda is also set to run once a day, and on each run will send low quantity products to all the subscribers to your AWS SNS topic.

**Where is my lambada logic?** - You don't need to go into the Lambda resource directly to edit your lambda, it can be done directly from your project. The Lambda index can be found in the directory **amplify > backend > function > yedselfserviceinv > src > index.js**

### On using Env and Secret Variables

At the top of the file there are some definitions that are generated based on configurations you have made using the Amplify CLI. If your code isn't working for some reason, make sure that you followed the same naming convention that was used.

### About exports.handler

As noted about it acts as the "main" of the application. It has four primary responsibilities

- Gets the Secret Variables from the AWS SSM
- Takes the JWT token passed by the user, and gets the user_sub. This will be used to identify the user
- Switch/Case that reacts to the particular operation + path called by the user
- Returns the response to the client

<p align="right">(<a href="#top">back to top</a>)</p>

## About the React App

There are a few things that should be noted about the React App itself - While this tutorial is more focused on the big picture architecture, it is important to know how the front end is interacting with the backend to fully understand how YED is being used.

### Src > Pages > Order

This is where you will find the majority of the logic needed for this application

- Components - If you are familiar with React you will expect to find the various high level pages in this area, the components will be broken down in more detail shortly
- Routes - These are the routes that are **specific** to the order form. This project has one major route schema in the high level app (Order route). Within this folders route folder you will find the definitions for how the routes are configured for each form step
- Store - This will be extremely to understand, so be sure you peek under the hood. This is the area that will persist data through a users experience. This allows a user to jump between form stages, as well as being used by the app to determine **what** the user is trying to do in the form (create or edit)

### Src > Pages > Components

In this section we will walk through what each component is responsible for, and some details to note - For further detail please go into the component and read the comment details

- **address** - This is the form component that allows the user to input their shipping information. This is primarily built using Formik. There are some items in here that allow you to control the form schema such as field lengths. This component is not used directly by the flow, instead it is built into the **delivery** component
- **confirmation** - This is the page where the user gets an overview of their order before they submit it. There is logic in this page that switches the context between a user creating a new order, or editing an existing order
- **delivery** - This is where the user performs two actions: Sets their shipping information, and ensures that their shipping address is valid. Once a user fills out the form they submit the form, but instead of routing to the next page, the form calls to the YED API's /validate-address endpoint to ensure that Yubico can deliver to the address. If the address is not valid the shipment errors are returned back to the user to make the corrections, they will need to validate the address again before continuing.
- **key-default** - This page is just a loading screen that calls to the backend using the /defaultinventory logic. This essentially preselects a key for your user, and moves them to the Delivery Component. Every component has a check, if a key has not been set, the user will be redirected to this component for a key to be chosen for them. You can extend this component to act as a catalog for your user to select the key they want
- **order-history** - This shows all of a users personal orders. If a order is below shipping state 10, then they will be able to edit and delete the order. Otherwise the buttons will disappear. When tracking information becomes available it will be displayed to the user
- **order-stepper** - This controls the form stepper you see at the top of the flow. It highlights what stage the user is in. Links were added to the delivery and order history step to allow a user to quickly create a new order, or see their previous order

### Inventory Config

In the code you may see references to inv-config. This was created to help your organization easily manage details that you want to use for your catalog. You can set your own custom image to be displayed, and your own custom description to guide your users into selecting the correct key. For this example there is only information about the YubiKey 5Ci, but you can follow the same schema for other keys (this is based on your requirements)

### Translations

You might notice that the rendering components don't contain any actual words, but instead are filled with items that look like {t["something"]}. This is used to act as an easy way to consistently configure different languages in your application. The English values can be found in **public > i18n > en-US.json**

<p align="right">(<a href="#top">back to top</a>)</p>

## Next Steps

Because this application is meant to act as a demo, there are a few items that need to be considered to make your deployment "production ready".

### Policies to prevent abuse

his application will allow a user to order as many keys as they desire. Additional logic will need to be built in to limit the number of orders based on your requirements

### Configuration based on your security requirements

This includes swapping the system out to use your identity provider, secrets management in AWS Lambda, and other controls used by your organization

### Auto-filling information

You can extend this application to allow it to automatically pull user claims through an ID token, or a user service

### Selectable Security Key

Right now the application will default to the Yubikey 5Ci. You can extend this application’s flow to allow a user to select a key based on your YED inventory

### People and Process Impacts to Customer Service

If your application is purposed for external end users then your internal CX team needs to be prepared to handle YED/YubiKey specific inquiries. Either an internal team should be established and trained to handle these items OR you can determine if Yubico Professional Services is the preferred option.

### Multi-Region PO support

The current demo is configured for a single region PO. You will need to use the proper API token for the user’s region, e.g. North America / Canada is one region, EMEA is a different region and each have their own associated API token.

More information can be found [here](#multi-region-purchase-orders--organizations)

<p align="right">(<a href="#top">back to top</a>)</p>

## FAQs and Common Issues

### Multi-Region Purchase Orders / Organizations

If organizations are shipping keys to both the US/Canada and to EMEA, two API tokens are required, as both regions are treated as different organizations.

A user will not be able to perform operations in a EU YED instance while logged in to their US/CAN instance (the same is true of the inverse).

Before implementing a solution you should consider how many YED organizations your company will be utilizing, and how to guide your users to the appropriate portal with the correct API key for their region.

This site will be updated in the future with Multi-Region PO Support.

More information on this can be found [here](https://console.yubico.com/help/api-req.html#users-roles-and-organizations)

### aws-exports.js file missing

This will occur if you initiated your environment, but did not push/publish - Make sure you call

```sh
amplify push

or

amplify publish
```

aws.exports.js should automatically be generated

### My API calls to YED are failing

There might be two reasons for this - You might not have configured your API secret, or your YED API URL is incorrect. See this section on [configuring your Environment and Secret Variables](#create-the-api-and-lambda-resource)

### I made a change to my API using amplify update API and now everything is broken

This is going to be your most annoying error, I would suggest not tweaking the API very often, but if it needs to be done then ensure you do the following steps

First off, what is happening? Every time you make a local change to the API, an automatically created file is altered in **amplify > backend > api > yedselfsvcex > yedselfsvcex-cloudformation-template.json**

There are special configurations in this file that allow the resource to talk to Cognito, that seem to be overridden every time the API is updated. Luckily the template that we have provided will create the API resource, with the needed parameters to take in Auth values, but again these get overridden.

To troubleshoot ensure the following are in the file listed above

```json
"Parameters": {
    ...
    "AuthCognitoUserPoolId": {
          "Type": "String",
          "Description": "The id of an existing User Pool to connect. If this is changed, a user pool will not be created for you.",
          "Default": "NONE"
        }
}
...
"Resources": {
    "paths": {
        "/your-new-path": {
            ...
            "parameters": [
                ...,
                {
                    "name": "Authorization",
                    "in": "header",
                    "required": false,
                    "type": "string"
                }
            ],
            "security": [
                {
                "Cognito": []
                }
            ],
            ...
        },
        "/your-new-path/{proxy+}": {
            ...
            "parameters": [
                ...,
                {
                    "name": "Authorization",
                    "in": "header",
                    "required": false,
                    "type": "string"
                }
            ],
            "security": [
                {
                "Cognito": []
                }
            ],
        },
    },
    "securityDefinitions": {
        "Cognito": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "x-amazon-apigateway-authtype": "cognito_user_pools",
            "x-amazon-apigateway-authorizer": {
            "type": "cognito_user_pools",
            "providerARNs": [
                {
                "Fn::Join": [
                    "",
                    [
                    "arn:aws:cognito-idp:",
                    {
                        "Ref": "AWS::Region"
                    },
                    ":",
                    {
                        "Ref": "AWS::AccountId"
                    },
                    ":userpool/",
                    {
                        "Ref": "AuthCognitoUserPoolId"
                    }
                    ]
                ]
                }
            ]
            }
        }
        },
}
```

If you ever get lost, or want to revert back to before you made a breaking change then come back to this [file](https://github.com/YubicoLabs/yed-self-service/blob/master/amplify/backend/api/yedselfsvcex/yedselfsvcex-cloudformation-template.json), and replace it with your changes.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[Yubico Developer Program](https://developers.yubico.com/)

Project Link: [https://github.com/YubicoLabs/yed-self-service](https://github.com/YubicoLabs/yed-self-service)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/YubicoLabs/yed-self-service.svg?style=for-the-badge
[contributors-url]: https://github.com/YubicoLabs/yed-self-service/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/YubicoLabs/yed-self-service.svg?style=for-the-badge
[forks-url]: https://github.com/YubicoLabs/yed-self-service/network/members
[stars-shield]: https://img.shields.io/github/stars/YubicoLabs/yed-self-service.svg?style=for-the-badge
[stars-url]: https://github.com/YubicoLabs/yed-self-service/stargazers
[issues-shield]: https://img.shields.io/github/issues/YubicoLabs/yed-self-service.svg?style=for-the-badge
[issues-url]: https://github.com/YubicoLabs/yed-self-service/issues
[license-shield]: https://img.shields.io/github/license/YubicoLabs/yed-self-service.svg?style=for-the-badge
[license-url]: https://github.com/YubicoLabs/yed-self-service/blob/master/LICENSE

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
    <a href="https://github.com/YubicoLabs/yed-self-service#about-the-lambda-logic"><strong>Explore the docs »</strong></a>
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
    <li><a href="#automatically-configure-your-amplify-environment">Automatically Configure your Amplify Environment</a></li>
    <li><a href="#manually-configure-your-amplify-environment">Manually Configure your Amplify environment</a></li>
    <li><a href="#about-the-lambda-logic">About the Lambda Logic</a></li>
    <li><a href="#about-the-react-app">About the React App</a></li>
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
* Stand up an environment in AWS to handle the server side operations for the YED API and for handling user authentication/authorization
* Use the YED API to create, delete, edit, and retrieve shipments as well as verify a shipment address
* Create a front end application for your end users to order a YubiKey that has been defaulted by your organization

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
7. **Email / SMS Notification** - Not included in this example, but this code should be extended to send notifications to users based on their shipments status

## Built With

* [YubiEnterprise Delivery](https://console.yubico.com/help/introduction.html)
* [YubiEnterprise API](https://console.yubico.com/apidocs/#operation/CreateShipmentExact)
* [React.js](https://reactjs.org/)
* [Material UI](https://mui.com/)
* [AWS Amplify](https://aws.amazon.com/amplify/)
* [Formik](https://formik.org/)
    * [This tutorial](https://javascript.plainenglish.io/step-to-step-guide-on-building-a-checkout-form-in-react-5f28af1c1fdf) and [this repository](https://github.com/xiongemi/react-checkout-form) are good primers for how the Form and Order Flow were created for this site

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* YubiEnterprise Delivery Instance
    * For an API key contact your organization's Yubico Owner or your [Yubico sales contact](https://pages.yubico.com/contact))
* [AWS Account](https://aws.amazon.com/free/)
* Install the AWS CLI v2
    * [Download link here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
    * Ensure the CLI is configured to your AWS Account
* Install the AWS Amplify CLI
    * [Download link here](https://docs.amplify.aws/cli/)
    * Ensure you have configured the Amplify CLI ([Instructions here](https://docs.amplify.aws/cli/start/install/))

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

## Automatically Configure your Amplify Environment
[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/YubicoLabs/yed-self-service)

<p align="right">(<a href="#top">back to top</a>)</p>

## Manually Configure your Amplify environment
Amplify provides a set of tools that will allow us to quickly provision cloud resources in AWS to begin quickly building and deploying our application. For this tutorial we will create the following Amplify Resources -
* API - Using API Gateway and Lambda
* Authentication - Using Cognito
* Storage - Using DynamoDB

### Initialize your Amplify environment

1. Open the terminal in the root of your project directory and run the following command
    ```sh
    amplify init
    ```
2. Use the following values to initialize your Amplify environment
    * Enter a name for the project (react-amplified): yed-example
    * Enter a name for the environment (dev): dev
    * Choose the type of app that you're building (javascript): react
    * Use default values for the other configurations

### Initialize Cognito for authentication
**Note:** The default configurations created here are not recommended for a production environment. It is expected that you will replace this module with the identity provider used by your organization

1. Run the following command
    ```sh
    amplify add auth

    amplify push
    ```
* To view your Cognito service at a later time please run
    ```sh
    amplify console
    ```

### Initialize your API and Lambda function
Luckily Amplify allows you to configure your API in one step. To keep this example simple we are only using one API Gateway resource, and one Lambada function for all operations, though you can split this in a variety of different ways based on your requirements.

#### Create the API and Lambda resource
1. Run the following command
    ```sh
    amplify add api
    ```
2. Use the following values to initialize your API
    * Service: REST
    * Friendly Name for the label: yedselfsvcex
    * Path: /yed
    * Lambda source: Create a new Lambda function
    * AWS Lambda function name: yedselfsvcex
    * Runtime: NodeJS
    * Function template: Hello World
    * Do you want to configure advanced settings: No
        * We will edit the Secret and Environment Variables in the following step
    * Do you want to edit the local code now: No

#### Create the Lambda environment and secret variables
Now we will add the secret and environment variables for your lambda. The secret will be used for your YED API key, and the environment variable will be used for YED API URL
1. Run the following command
    ```sh
    amplify update function
    ```
2. Select the Lambda to update: yedselfsvcex
3. Choose Environment variables configuration
4. Choose Add new environment variables
5. Create the variable with the following details
    * Name: YED_API_URL
    * Value: {your YED API URL}
3. Repeat this step for another environment variable
    * Name: DEFAULT_PRODUCT_ID
    * Value: 5
    * This second variable is used to create a default product ID for this example, you can remove this from the code, or prevent the front end from calling the /inventorydefault URL, and instead allow the user to select their own key
6. Now to create your secret variable for your YED API Key - This one is not set as an env variable, but instead within AWS Secret manager
7. Run the following command
    ```sh
    amplify update function
    ```
2. Select the Lambda to update: yedselfsvcex
3. Choose Environment variables configuration
4. Choose Secret values configuration
5. Create the variable with the following details
    * Name: YED_API_TOKEN
    * Value: {your YED API Secret}

#### Configure the API paths
We will now configure the paths needed by the API. These various paths are defined in the Lambda code, so ensure that all the paths required are created.

1. Run the following command
    ```sh
    amplify update api
    ```
2. Service: REST
3. REST API: yedselfsvcex
4. Add another path
5. Create a path with the following values
    * Path: /address
    * Lambda source: Use a Lambda function already added in the current Amplify project
    * Lambda source: yedselfsvcex
    * Restrict API access Yes
    * Who should have access: Authenticated users only
    * What kind of access: Create, Read, Update, Delete
6. Repeat the step above for the following paths (all should be restricted to authenticated users)
    * /inventory
    * /order/{isbn}
    * /defaultinventory
    * /orders

Your Lambda and API has now been created. Your new Lambda environment will not have the source code that came with this project so replace the file in your directory **amplify > backend ? function > yedselfsvcex > src > index.js** with the code found in [this file](https://github.com/YubicoLabs/yed-self-service/blob/master/amplify/backend/function/yedselfsvcex/src/index.js)

Once completed run
```sh
amplify publish
```

### Initialize your data store
In this section you will use Amplify to create persistent storage for your application using DynamoDB

**Why do you need persistent storage?** We will be using this to store the relationship between a users identity and the shipment requests that they have created, something that is not available in the YED service. Consider the following example

| User | Shipment ID |
| ----- | -----| 
| User 1 | Shipment 1 |
| User 1 | Shipment 2 |
| User 2 | Shipment 3 |

If you are User 1, you should only have Read/Update/Delete permissions for Shipments 1 and 2, and should not be able to perform actions on Shipment 3. For User 2, you should only be able to perform actions on Shipment 3, and **not** on Shipments 1 and 2

Complete the following to create your storage resource:
1. Run the following command
    ```sh
    amplify add storage
    ```
2. Use the following values to initialize your resource:
    * Storage service: NoSQL Database
    * Project Name: Yedselfsvcdb
    * Ensure you create **two** columns
        * user_sub
        * shipment_id
        * **Caution** you do not change these column names, otherwise you will need to retry, or modify the Lambda source code
    * Partition Key: shipment_id
    * Select No for the remainder of the prompts
    * Amplify will ask if you wish to edit your code, select **no**

<p align="right">(<a href="#top">back to top</a>)</p>

## About the Lambda Logic
The Lambda resource is where your backend logic will reside - This is important as this is where your application will be calling directly to the YED API to create, manage, and get orders (and perform other operations like address validate).

The current application does not have a corresponding endpoint to every operation in YED. If additional functionality is required, use the code as a template for calling the other YED endpoints

**Where is my lambada logic?** - You don't need to go into the Lambda resource directly to edit your lambda, it can be done directly from your project. The Lambda index can be found in the directory **amplify > backend > function > yedselfsvcex > src > index.js**

### On using Env and Secret Variables
At the top of the file there are some definitions that are generated based on configurations you have made using the Amplify CLI. If your code isn't working for some reason, make sure that you followed the same naming convention that was used.

### How is the code structured
There are three tiers to the entire example 

* Definition of variables
* Logic to call to YED or to Storage
* exports.handler which acts as the "main" whenever this function is called

### About exports.handler
As noted about it acts as the "main" of the application. It has four primary responsibilities
* Gets the Secret Variables from the AWS SSM
* Takes the JWT token passed by the user, and gets the user_sub. This will be used to identify the user
* Switch/Case that reacts to the particular operation + path called by the user
* Returns the response to the client

### About the YED Calls
Every method essentially calls to the YED API in the same manner - The call is made and the data from the response is sent directly to the client.

There are some checks on top of some of the calls to check if the user has permission to CRUD to the shipment. 

There is a 1:1 relationship between the operations + paths defined in exports,handler, and a method that calls to YED. There are a few helper methods if something needs to be done with the storage resource.

<p align="right">(<a href="#top">back to top</a>)</p>

## About the React App
There are a few things that should be noted about the React App itself - While this tutorial is more focused on the big picture architecture, it is important to know how the front end is interacting with the backend to fully understand how YED is being used.

### Src > Pages > Order
This is where you will find the majority of the logic needed for this application
* Components - If you are familiar with React you will expect to find the various high level pages in this area, the components will be broken down in more detail shortly
* Routes - These are the routes that are **specific** to the order form. This project has one major route schema in the high level app (Order route). Within this folders route folder you will find the definitions for how the routes are configured for each form step
* Store - This will be extremely to understand, so be sure you peek under the hood. This is the area that will persist data through a users experience. This allows a user to jump between form stages, as well as being used by the app to determine **what** the user is trying to do in the form (create or edit)

### Src > Pages > Components
In this section we will walk through what each component is responsible for, and some details to note - For further detail please go into the component and read the comment details
* **address** - This is the form component that allows the user to input their shipping information. This is primarily built using Formik. There are some items in here that allow you to control the form schema such as field lengths. This component is not used directly by the flow, instead it is built into the **delivery** component
* **confirmation** - This is the page where the user gets an overview of their order before they submit it. There is logic in this page that switches the context between a user creating a new order, or editing an existing order
* **delivery** - This is where the user performs two actions: Sets their shipping information, and ensures that their shipping address is valid. Once a user fills out the form they submit the form, but instead of routing to the next page, the form calls to the YED API's /validate-address endpoint to ensure that Yubico can deliver to the address. If the address is not valid the shipment errors are returned back to the user to make the corrections, they will need to validate the address again before continuing.
* **key-default** - This page is just a loading screen that calls to the backend using the /defaultinventory logic. This essentially preselects a key for your user, and moves them to the Delivery Component. Every component has a check, if a key has not been set, the user will be redirected to this component for a key to be chosen for them. You can extend this component to act as a catalog for your user to select the key they want
* **order-history** - This shows all of a users personal orders. If a order is below shipping state 10, then they will be able to edit and delete the order. Otherwise the buttons will disappear. When tracking information becomes available it will be displayed to the user
* **order-stepper** - This controls the form stepper you see at the top of the flow. It highlights what stage the user is in. Links were added to the delivery and order history step to allow a user to quickly create a new order, or see their previous order

### Inventory Config
In the code you may see references to inv-config. This was created to help your organization easily manage details that you want to use for your catalog. You can set your own custom image to be displayed, and your own custom description to guide your users into selecting the correct key. For this example there is only information about the YubiKey 5Ci, but you can follow the same schema for other keys (this is based on your requirements)

### Translations
You might notice that the rendering components don't contain any actual words, but instead are filled with items that look like {t["something"]}. This is used to act as an easy way to consistently configure different languages in your application. The English values can be found in **public > i18n > en-US.json**

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
[product-screenshot]: images/screenshot.png

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
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">YED Self Service Portal</h3>

  <p align="center">
    Create a web portal driven by the YubiEnterprise API that allows your customers to order from your organization's inventory
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
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
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

YubiEnterprise Delivery is a cloud-based service that enables streamlined distribution of YubiKeys to end-users’ offices or residential addresses, both domestic and international.

While YubiEnterprise Delivery (YED) can be driven entirely through the pre-built console, it comes with an API that allows for the ability to extend the functionality. This will allow your organization's developers to integrate the API into custom solutions that further meet the requirements of your business.

This example will demonstrate an end-to-end solution demonstrating the ability to integrate the YED API into a web application that users in your enterprise (or beyond) could use to create YubiKey orders from your organizations inventory.

In this project you will 
* Stand up an environment in AWS to handle the server side operations for the YED API and for handling user authentication/authorization
* Use the YED API to create, delete, edit, and retrieve shipments as well as verify a shipment address
* Create a front end application for your end users to order a YubiKey that has been defaulted by your organization

**Disclaimer** - This project is not meant to act as a production ready solution for **all** organizations. It is meant to demonstrate a reference architecture for how the YED API can be integrated into a custom application.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [YubiEnterprise Delivery](https://console.yubico.com/help/introduction.html)
* [YubiEnterprise API](https://console.yubico.com/apidocs/#operation/CreateShipmentExact)
* [React.js](https://reactjs.org/)
* [Material UI](https://mui.com/)
* [AWS Amplify](https://aws.amazon.com/amplify/)
* [Formik](https://formik.org/)

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

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone git@github.com:YubicoLabs/yed-self-service.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Automatically Configure your Amplify Environment
**Will put button here later**

If you wish to manually configure your Amplify environment, please proceed to the next section

## Manually Configure your Amplify Environment
Amplify provides a set of tools that will allow us to quickly provision cloud resources in AWS to begin quickly building and deploying our application. For this tutorial we will create the following Amplify Resources -
* API - Using API Gateway and Lambda
* Authentication - Using Cognito
* Storage - Using DynamoDB

### Initialize your Amplify Environment

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



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [] Feature 1
- [] Feature 2
- [] Feature 3
    - [] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

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

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

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
[license-url]: https://github.com/YubicoLabs/yed-self-service/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
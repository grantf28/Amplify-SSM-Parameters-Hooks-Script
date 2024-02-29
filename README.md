# Amplify SSM Parameters Hooks Script

![GitHub last commit](https://img.shields.io/github/last-commit/grantf28/Amplify-SSM-Parameters-Hooks-Script)
![GitHub issues](https://img.shields.io/github/forks/grantf28/Amplify-SSM-Parameters-Hooks-Script)

A utility script for managing AWS Amplify environment variables using AWS Systems Manager (SSM) Parameter Store in pre and post-deployment hooks.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

AWS Amplify is a powerful platform for building scalable and secure cloud-powered web and mobile applications. This script enhances Amplify's capabilities by providing a solution for managing environment variables securely using AWS Systems Manager Parameter Store.

## Features

- **Pre and Post Deployment Hooks:** Easily integrate the script into Amplify's deployment process with pre and post-deployment hooks.
- **SSM Parameter Store Integration:** Store environment variables securely in AWS Systems Manager Parameter Store.
- **Automatic Parameter Updates:** Automatically update the parameters on changes, ensuring your application always uses the latest configuration.

## Getting Started

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/grantf28/Amplify-SSM-Parameters-Hooks-Script.git
    cd Amplify-SSM-Parameters-Hooks-Script
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

## Usage

1. **Add Pre or Post Deployment Hook in Amplify:**
    In your `amplify.yml` file, add the script as a pre or post deployment hook.

    ```yaml
    preDeploy:
      - command: npm run amplify-ssm-pre-deploy
    postDeploy:
      - command: npm run amplify-ssm-post-deploy
    ```

2. **Deploy Your Amplify App:**
    ```bash
    amplify push
    ```

3. **Monitor Logs:**
    Monitor the logs to ensure the script is executing correctly.

## Contributing

Contributions are welcome! Please check the [contribution guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the [MIT License](LICENSE).

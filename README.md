# MUJ Tasks
A centralized platform for MUJ students to request and receive assistance with assignments, lab manuals & CSE projects.

## Project Overview
MUJ Tasks connects students who need help with their academic work to skilled writers/developer who can complete these tasks for a fee. The platform facilitates the entire process from request submission to delivery.

## Features
- Request Submission: Students can submit assignment/projects requests with detailed requirements

- Writer Application: Talented students can apply to join as writers and earn money

- Transparent Process: Clear information about how the service works

- Mobile Responsive: Fully functional on all device sizes

## Prerequisites

- Knowladge of Next.js
- Knowladge of MongoDB
- Knowladge of Google Cloud Console

## How to use

- Open [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
- Enable the Google Drive API and create a new service account.
- Create a google drive and share it with the service account email as editor.
- Download the service account key and fill data in the `.env.local` file.
- In the drive link `drive.google.com/drive/u/1/folders/abc` abc is your `GDRIVE_SHARED_DRIVE_ID`
- Create a mongodb database.
- Get the mongodb uri and fill it in the `.env.local` file.
- Run `yarn ; yarn dev` to install dependencies and run.

## ENV Template
```env
GDRIVE_CLIENT_EMAIL="some@thing.iam.gserviceaccount.com"
GDRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----"
GDRIVE_SERVICE_ACCOUNT_CLIENT_ID="12345678990123456"

ASSIGNMENTFORM_GDRIVE_SHARED_DRIVE_ID=""
PROJECTASSISTANCE_GDRIVE_SHARED_DRIVE_ID=""

MONGODB_URI="mongodb+src://somethingsomethihng/MUJTasks?retryWrites=true&w=majority&appName=ClusterName"
```

## Introduction

This is a medical application to connect patients directly to doctors. It's a single page React website with a Django backend. Users can be either patients or doctors. Patients can request appointments using this and the doctors can accept or reject them.

## Distinctiveness

This project is distinct from the others mainly because it's trying to solve a different problem but also because its structure, the frontend and backend are decoupled in this. The previous projects used Django for the frontend too but in this it's only used in the backend. This project also has two types of users (doctors and patients) and the UI has to adapt to each of them.

## Complexity

The frontend is much more complex because

- it's an SPA so all the everything user directly interact with had to be handled only with JavaScript. So routing is done with `react-router`.
- the UI has to adapt based on which kind of user is logged in.
- when the current user is a patient, they can see a list of doctors with whom they don't have an appointment with and can request a new appointment, editing an appointment which hasn't been accepted or rejected by the doctor, and delete a pending or rejected appointment.
- when the current user is a doctor, they can see a list of requested appointments and can accept or reject them. There is also a separate list of accepted appointments.
- the styling is completely custom; I haven't used any styling library like Bootstrap.

The backend is more complex because

- the account system is more powerful; users can upload profile pictures in this app.
- the two types of users have different needs so more views had to be made for that.
- an appointment has fields like a patient specified date and doctors chosen start time, the validation of those is more complicated compared to what was present in previous projects.

## File Contents

### frontend

`frontend` is the Django app which serves the index page which is stored in the `frontend/templates` directory. The React app is compiled and bundled by webpack to `frontend/static/main.js` which is the JavaScript file the index page links to. The SCSS and CSS files are in `frontend/static/css`. All the React files like components and `index.js` are in `frontend/src`.

`frontend/webpack.config.js`, `frontend/package.json` and `frontend/babel.config.json` are for configuring webpack bundler. `frontend/package.json` also contains the dependencies.

### api

`api` is the Django app which handles the API endpoints. It has a conventional structure, `api/urls.py` contains the URL paths, `api/views.py` contains the API views, and `api/models.py` contains all the Django models.

`media` is where the profile pictures users upload is stored.

## How to run this application

To migrate changes to the database, in the base directory run:
```
python manage.py makemigrations
python manage.py migrate
```

Since a build of the frontend is present the application can be started just by running the server. To start the server, in the base directory run:

```
python manage.py runserver
```

To make changes to the frontend first `cd` into `frontend` and run:

```
npm install
```

to install `react`, `react-dom` and `react-router`

To make changes appear while editing, `cd` into `frontend` in a separate terminal and run:

```
npm run dev
```

or after making changes run:

```
npm run build
```

To change the styling `cd` into `frontend/static/css` and run:

```
sass index.scss:index.css --watch
```

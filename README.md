## Django Medical App

This is a medical application to connect patients directly to doctors. It's a single page React website with a Django backend. Users can be either patients or doctors. Patients can request appointments using this and the doctors can accept or reject them.

![UI on a PC](./desktop_screenshot.jpeg)
\
\
\
![UI on a phone](./mobile_screenshot.jpeg)


## Deploy to Heroku
After creating a Heroku app add that url to `ALLOWED_HOSTS` in `medical_app/settings.py`, then deploy and finally run:
```
heroku run python3 manage.py migrate
```

## Making changes to the frontend

first `cd` into `frontend` in a separate terminal and  run:

```
npm install
```

to install `react`, `react-dom` and `react-router`

To make changes appear while editing, run:

```
npm run dev
```

or after making changes run:

```
npm run build
```

To change the styling, `cd` into `frontend/static/css` and run:

```
sass index.scss:index.css --watch
```

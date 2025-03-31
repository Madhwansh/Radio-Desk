# Radio-Desk

## Project Overview

Radio-Desk is a desktop application built with Electron for the frontend and FastAPI for the backend. The project aims to provide a seamless and efficient user experience for managing radio-related tasks.

## Frontend

The frontend is developed using [Electron](https://www.electronjs.org/), which allows for building cross-platform desktop applications with web technologies.

### Features

- Cross-platform compatibility (Windows, macOS, Linux)
- Responsive and user-friendly interface
- Integration with the backend API

### Setup Instructions

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Electron application:

```bash
npm start
```

## Backend

The backend is powered by [FastAPI](https://fastapi.tiangolo.com/), a modern, fast (high-performance) web framework for building APIs with Python.

### Features

- High-performance API endpoints
- Easy integration with the frontend
- Scalable and maintainable architecture

### Setup Instructions

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

- On Windows:
  ```bash
  venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Start the FastAPI server:

```bash
uvicorn main:app --reload
```

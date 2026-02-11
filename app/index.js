const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Despliegue Exitoso</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 90%;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 2.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          background: #fff;
          color: #764ba2;
          padding: 10px 20px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: bold;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .footer {
          margin-top: 20px;
          font-size: 0.9rem;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 ¡Despliegue Exitoso!</h1>
        <p>Esta aplicación ha sido desplegada automáticamente usando <strong>Ansible</strong> y <strong>GitHub Actions</strong>.</p>
        <p>Preparado por: <strong>Tu Nombre</strong></p>
        <a href="#" class="btn">Ver Documentación</a>
        <div class="footer">
          <p>Examen de Automatización - 2026</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`App escuchando en el puerto ${port}`);
});

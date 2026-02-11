# Guía de Preparación para el Examen de Ansible

Esta guía detalla exactamente qué archivos y líneas debes modificar para cumplir con los requisitos que mencionaste para tu examen.

## 0. **¿Es AWS? (Puntos Clave)**

Como tu máquina cliente es AWS, ten en cuenta esto **antes de empezar**:

- **Usuario:** En AWS, si usas Ubuntu, el usuario es `ubuntu`. Si usas Amazon Linux, es `ec2-user`.
- **Llave SSH (.pem):** Necesitarás el archivo `.pem` que te dé el profesor o AWS.
  - **GitHub Secret:** Debes pegar el CONTENIDO de tu archivo `.pem` en un "Secret" de GitHub llamado `AWS_SSH_KEY` (`Settings` -> `Secrets and variables` -> `Actions`).
- **Security Groups:** Asegúrate de que la máquina AWS tenga el **puerto 22 (SSH)** abierto para que GitHub Actions pueda entrar.

---

## 1. Automatizar en otro repositorio (Cambiar el repositorio)

Esta es la parte **más importante** y donde suele haber errores.

Si el profesor te pide que uses un "Nuevo Repositorio" para automatizar:

1.  **Crea el Nuevo Repo:** Sube tu código de Ansible allí.
2.  **Configura los Secretos:** **SÍ, EL NUEVO REPO NECESITA LA CLAVE SSH.**
    - Sin la `AWS_SSH_KEY` en los `Settings` -> `Secrets` del **Nuevo Repo**, GitHub Actions fallará al intentar conectar.

### CHECKLIST CRÍTICO: Evita fallos de "index.js no encontrado"

Antes de poner la URL del nuevo repo en Ansible, **abre ese repo en GitHub y mira dónde está el archivo `index.js`**.

- **Caso A: Tiene carpeta `app/`** (Ej: `NuevoRepo/app/index.js`)
  - **NO tocas nada:** Ansible ya espera esta estructura por defecto.
  - Solo cambia la URL y listo.

- **Caso B: NO tiene carpeta `app/`** (Ej: `NuevoRepo/index.js` está en la raíz)
  - **Debes modificar Ansible:**
    1.  **En `ansible/roles/node_app/tasks/deploy.yml`:**
        - Línea 21 (`npm install`): Cambia `path: .../myapp/app` por `path: .../myapp`.
    2.  **En `ansible/roles/node_app/templates/node-app.service.j2`:**
        - Línea 8: `WorkingDirectory=/home/{{ ansible_user }}/apps/myapp` (quita `/app`).
        - Línea 9: `ExecStart=.../apps/myapp/index.js` (quita `/app`).

### Configuración en Ansible

Debes decirle a Ansible que descargue **ESTE** Nuevo Repositorio.

- **Archivo a modificar:** `ansible/roles/node_app/tasks/deploy.yml`
- **Línea:** 12
- **Acción:** Cambia la URL por la de tu Nuevo Repo.

```yaml
- name: Checkout app code from repo
  git:
    repo: "https://github.com/TU_USUARIO/TU_NUEVO_REPO.git" # <--- ¡IMPORTANTE!
    dest: /home/{{ ansible_user }}/apps/myapp
    version: "{{ git_ref | default('main') }}"
```

> **Resumen:** Si cambias de repo, **tienes que actualizar la URL en `deploy.yml`** Y **copiar los Secretos (Key) al nuevo repo en GitHub**.

---

## 2. PUERTO

Aquí hay dos interpretaciones posibles (pregunta al profesor si tienes duda):

### A. Puerto de la Aplicación (Node.js)

Si te piden cambiar el puerto donde escucha tu aplicación web (actualmente 8080):

- **Archivo a modificar:** `app/index.js`
- **Línea:** 3
- **Acción:** Cambia `const port = 8080;` por el nuevo puerto (ej. 8080).

```javascript
const port = 8080; // <--- CAMBIAR AQUÍ
```

- **Nota AWS:** Recuerda abrir este puerto (8080) en el **Security Group** de AWS para verlo desde el navegador.

### B. Puerto SSH (Conexión al Servidor)

Si te piden conectar al servidor por un puerto SSH distinto al 22 (raro en AWS por defecto, pero posible):

- **Archivo a modificar:** `ansible/inventories/production.yml`
- **Acción:** Agrega la variable `ansible_port` debajo de `web1`.

```yaml
web1:
  ansible_host: ...
  ansible_user: ...
  ansible_port: 2222 # <--- AGREGAR SI ES NECESARIO
```

- **Archivo a modificar:** `.github/workflows/deploy.yml`
- **Línea:** 34 y 35 (verificación con `nc`)
- **Acción:** Cambia el `22` por el nuevo puerto.

## 3. USUARIO

Si te dan un usuario distinto a `ubuntu` (por ejemplo, `admin` o `ec2-user`):

- **Archivo a modificar:** `ansible/inventories/production.yml`
- **Línea:** 17
- **Acción:** Cambia `ansible_user: ubuntu` por el nuevo usuario.

```yaml
ansible_user: ec2-user # <--- CAMBIAR AQUÍ (ejemplo para Amazon Linux)
```

## 4. IP

Cuando te den la IP pública de la máquina AWS del examen:

### Parte A: En el inventario de Ansible

- **Archivo a modificar:** `ansible/inventories/production.yml`
- **Línea:** 12
- **Acción:** Cambia la IP actual por la nueva URL o IP.

```yaml
ansible_host: 54.123.45.67 # <--- CAMBIAR AQUÍ
```

### Parte B: En el Workflow de GitHub

Este paso es CRÍTICO porque el workflow hace comprobaciones de conectividad antes de ejecutar Ansible.

- **Archivo a modificar:** `.github/workflows/deploy.yml`
- **Líneas:** 34, 35 y 40
- **Acción:** Reemplaza `52.87.54.252` por la nueva IP en **todos** estos lugares.

```yaml
# Línea 34
echo "Checking connectivity to NUEVA_IP:22..."
# Línea 35
if ! nc -zv -w 5 NUEVA_IP 22; then
# ...
# Línea 40
ssh-keyscan -H NUEVA_IP >> ~/.ssh/known_hosts
```

## 5. CONTENIDO

Si te piden cambiar "lo que muestra la página web":

- **Archivo a modificar:** `app/index.js`
- **Línea:** 6
- **Acción:** Modifica el texto dentro de `res.send(...)`.

```javascript
app.get("/", (req, res) => {
  res.send("<h1>Examen Aprobado!</h1><p>Nombre: Tu Nombre</p>"); // <--- CAMBIAR AQUÍ
});
```

- **Importante:** Haz `git push` para que Ansible descargue el cambio.

## 6. GITHUB (Workflow)

El archivo que "automatiza" todo con GitHub Actions es:

- **Archivo a modificar:** `.github/workflows/deploy.yml`

Si te piden cambiar la rama que dispara el despliegue:

- **Archivo a modificar:** `.github/workflows/deploy.yml`
- **Línea:** 5
- **Acción:** Cambia `main` por la rama que desees.

```yaml
on:
  push:
    branches: [develop] # <--- CAMBIAR SI ES NECESARIO
```

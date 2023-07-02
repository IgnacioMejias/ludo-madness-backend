# Documentación backend LUDO-MADNESS
## Instalación

Hola! A continuación se detallarán las indicaciones para instalar las dependencias de nuestra API. 

Para ejecutar este proyecto, necesitas tener instalado lo siguiente: 
- Node.js 
-  Yarn 
- PostgreSQL 
- Sequelize
- Sequelize-cli

Si aún no tiene estos instalados, puede obtenerlos de los siguientes enlaces: 
- [Node.js](https://nodejs.org/) 
-  [Yarn](https://yarnpkg.com/) 
-  [PostgreSQL](https://www.postgresql.org/) 
-  [Sequelize](https://www.npmjs.com/package/sequelize)
-  [Sequelize-cli](https://www.npmjs.com/package/sequelize-cli)

### Clonando el repositorio

Para obtener el código fuente en tu sistema local, puedes clonar el repositorio utilizando git:

```bash
git clone https://github.com/IIC2513/grupo-mejistrudel-backend.git
```
### Instalación de dependencias 

Una vez clonado el repositorio, accede a la carpeta del proyecto e instala las dependencias necesarias con yarn:

```bash
cd grupo-mejistrudel-backend
yarn
```

Asi, instalarás todas las dependencias listadas en el archivo `package.json`.

Si tienes problemas con la versión de `node`, cambia la versión a la 16.18.0. Esto, lo puedes hacer así: 
```bash
nvm install 16.18.0
nvm use 16.18.0
```
Ahora, al ejecutar nuevamente ```yarn```, debiera funcionar :)

## Modelación y explicación de las entidades 

Teniendo en consideración que buscamos implementar una variación del juego Ludo, se explicarán las entidades creadas, y las relaciones que poseen entre sí. 

1.  **User:** Este modelo representa a los usuarios de la aplicación. Los atributos para este modelo son `name`, `password`, y `email`. Cada `User` puede tener muchos `Player` (una relación uno a muchos).
2.  **Player:** Este modelo representa a los jugadores en un juego de Ludo. Cada `Player` está asociado a un `User` y puede participar en múltiples juegos a través del modelo `Participant`. Además, cada `Player` puede tener muchas (exactamente 4 para este caso) `Piece` (una relación uno a muchos).
3. **Participant:** Este modelo representa la participación de un `Player` en un `Game`. Cada `Participant` está asociado a un `Player` y un `Game`. Cada `Participant` posee además un `number` y un `color`. 
4. **Game:** Este modelo representa una instancia de un juego de Ludo. Cada `Game` puede tener múltiples `Participant`. También, un `Game` puede tener una referencia a un `Player` que es el ganador del juego. Esta referencia se guarda como `winner_id`. 
5. **Piece:** Este modelo representa a las fichas que cada jugador tiene en un juego. Cada `Piece` está asociada a un `Player` y a un `Game`, y tiene atributos como `position`, `status` y `number`. También posee más atributos específicos para realizar operaciones según su posición en el tablero, como `base_position`, `enter_position`, y `left_to_finish`. Posee un `number` para reconocer qué pieza es, y un `status` para saber en qué parte del tablero se encuentra. 
6. **Move:** Este modelo representa los movimientos realizados durante el juego. Cada `Move` está asociado a un `Player` y a una `Piece`, y tiene los atributos `position` y `dice_value`.

## Configuración de la base de datos

Primero, será necesario que tengas un archivo `.env`. Este, debe ser de la siguiente forma: 
```dotenv
DB_USERNAME=tu_nombre_en_postgres
DB_PASSWORD=tu_contraseña
DB_NAME=backendweb
DB_HOST='localhost'
```

### Levantar Postgresql 

Antes, de seguir, debes levantar postgresql. Para esto, debes ejecutar el siguiente comando: 
```bash
sudo service postgresql start
```

### Creación de la base de datos

Este proyecto utiliza Sequelize como ORM para manejar las operaciones de la base de datos, por lo que los comandos serán todos manejados con esto. 

Para crear la base de datos necesaria para este proyecto, puedes usar el comando de sequelize:
```bash
yarn sequelize-cli db:create
```

### Migraciones

Para crear las tablas necesarias en tu base de datos, debes ejecutar las migraciones de Sequelize. Puedes hacerlo con el siguiente comando:
```bash
yarn sequelize-cli db:migrate
```
### Semillas

Se tendrá una semilla de usuarios. Esto, para simular aquellas personas que crearon una cuenta en nuestra App. Para ejecutar esta semilla, puedes hacerlo con el siguiente comando: 
```bash
yarn sequelize-cli db:seed:all 
```

### Iniciar el servidor 

Una vez que todas las dependencias están instaladas y la base de datos está configurada, puedes iniciar el servidor con el siguiente comando:
```bash
yarn dev
```
Esto inicia el servidor de Koa en el puerto especificado en tu archivo de configuración o en el puerto 3000 por defecto.

## Documentación de la API

A continuación, se documentarán los endpoints de nuestra API. Estos se documentarán en el flujo lógico que la aplicación espera recibir. 

### <u> Crear un nuevo jugador (player) </u>

**Endpoint:** `POST /players`

**Descripción:** Crea un nuevo jugador. 

#### Parámetros de entrada (request body)
```json
{
  "user_id": 1
}
```
#### Respuestas

**201 Created**

Crea un nuevo jugador y devuelve un objeto JSON con la información de este.

Formato del objeto retornado:

```json
{
  "id": 9,
  "user_id": 5,
  "score": 0,
  "updatedAt": "2023-06-03T16:29:15.808Z",
  "createdAt": "2023-06-03T16:29:15.808Z"
}
```

Si el jugador ya existe en la base de datos, se devuelve un objeto JSON con el mensaje de error.

**400  Bad Request**   
```json
{
  "error": "Player already exists"
}
```
 
###  <u> Crear un nuevo juego (Game)  </u>

**Endpoint:** `POST /games`

**Descripción:** Crea un nuevo juego.

#### Parámetros de entrada (request body)

```json
{
  "user_id": 1
}
```


#### Respuestas

**201 Created**

Crea un nuevo juego y devuelve un objeto JSON con la información del juego.

Formato del objeto retornado:

```json
{
  "id": 5,
  "updatedAt": "2023-06-03T17:05:48.250Z",
  "createdAt": "2023-06-03T17:05:48.250Z",
  "winner_id": null
}
```

###  <u>Unirse a un juego ya creado  </u>

**Endpoint:** `POST /games/gameId/participants`

**Descripción:** Crea un nuevo juego.

#### Parámetros de entrada (request body)

```json
{
  "playerId": 2
}
```

#### Respuestas

**201 Created**

Une a un jugador a un juego. Devuelve un objeto JSON con la información del nuevo jugador de la partida. 

Formato del objeto retornado:

```json
{
  "player_id": 8,
  "game_id": 5,
  "number": 2,
  "color": "blue",
  "updatedAt": "2023-06-03T17:11:42.483Z",
  "createdAt": "2023-06-03T17:11:42.483Z"
}
```

###  <u> Efectuar un movimiento  </u>


**Endpoint:** `POST /games/:gameId/moves`

**Descripción:** Efectúa un movimiento. Esto quiere decir, un jugador mueve una ficha según el resultado obtenido en el dado. 

#### Parámetros de entrada (request body)

```json
{
  "playerId": 1,
  "pieceId": 1, 
  "diceValue": 6
}
```

#### Respuestas

**201 Created**

Ejecuta el movimiento de la pieza. Devuelve un objeto JSON con la información de este, y de la pieza que movió.  

Formato del objeto retornado:

```json
{
  "piece": {
    "id": 1,
    "player_id": 1,
    "game_id": 1,
    "base_position": 1,
    "enter_position": 51,
    "position": 1,
    "status": "safe",
    "left_to_finish": 5,
    "number": 1,
    "createdAt": "2023-06-03T19:56:21.886Z",
    "updatedAt": "2023-06-03T19:58:22.295Z"
  },
  "move": {
    "id": 1,
    "player_id": 1,
    "piece_id": 1,
    "position": 1,
    "dice_value": 6,
    "updatedAt": "2023-06-03T19:58:22.300Z",
    "createdAt": "2023-06-03T19:58:22.300Z"
  }
}
```


En el caso mostrado a continuación, se mueve la pieza y además esta se devora a una pieza enemiga correctamente. Esto se refleja en el apartado del mensaje que dice "pieceEated", donde la pieza devorada es devuelta a su base "status": "home". 

Formato del objeto retornado: 

```json
{
  "piece": {
    "id": 5,
    "player_id": 2,
    "game_id": 1,
    "base_position": 14,
    "enter_position": 12,
    "position": 26,
    "status": "onBoard",
    "left_to_finish": 5,
    "number": 1,
    "createdAt": "2023-06-03T21:31:30.939Z",
    "updatedAt": "2023-06-03T22:33:23.463Z"
  },
  "move": {
    "id": 32,
    "player_id": 2,
    "piece_id": 5,
    "position": 26,
    "dice_value": 6,
    "updatedAt": "2023-06-03T22:33:23.485Z",
    "createdAt": "2023-06-03T22:33:23.485Z"
  },
  "pieceEated": {
    "id": 3,
    "player_id": 1,
    "game_id": 1,
    "base_position": 1,
    "enter_position": 51,
    "position": 0,
    "status": "home",
    "left_to_finish": 5,
    "number": 3,
    "createdAt": "2023-06-03T21:31:21.871Z",
    "updatedAt": "2023-06-03T22:33:23.463Z"
  }
}
```
**400  Bad Request** 

Si la pieza está en la base y no salió un 6, se arroja el siguiente mensaje:
```json
{
  "message": "La ficha está en la base y no ha salido un 6 en el dado."
}
```

Supongamos un juego de dos participantes, uno azul y uno verde. Si la ficha del azul intenta comerse a la ficha del verde, mientras que la del verde está en su base. Al ser esta una jugada no permitida, se arroja un error: 
```json
{
  "message": "La ficha intentó devorar a una ficha que está en su safe position."
}
```

###  <u> Obtener el estado de una partida  </u>

**Endpoint:** `GET /games/gameId`

**Descripción:** Se obtiene el estado de una partida en curso, es decir, entrega un listado de jugadores, y dentro de cada jugador un listado de sus piezas y el estado de cada una. 

#### Parámetros de entrada (request body)

No posee


#### Respuestas

**201 Created**

Formato del objeto retornado:

```json
{
  "state": {
    "player1": {
      "piece1": {
        "piece": {
          "id": 2,
          "player_id": 1,
          "game_id": 1,
          "base_position": 1,
          "enter_position": 51,
          "position": 0,
          "status": "home",
          "left_to_finish": 5,
          "number": 2,
          "createdAt": "2023-06-03T19:56:21.892Z",
          "updatedAt": "2023-06-03T19:56:21.892Z"
        }
      },
      "piece2": {
        "piece": {
          "id": 3,
          "player_id": 1,
          "game_id": 1,
          "base_position": 1,
          "enter_position": 51,
          "position": 0,
          "status": "home",
          "left_to_finish": 5,
          "number": 3,
          "createdAt": "2023-06-03T19:56:21.896Z",
          "updatedAt": "2023-06-03T19:56:21.896Z"
        }
      },
      "piece3": {
        "piece": {
          "id": 4,
          "player_id": 1,
          "game_id": 1,
          "base_position": 1,
          "enter_position": 51,
          "position": 0,
          "status": "home",
          "left_to_finish": 5,
          "number": 4,
          "createdAt": "2023-06-03T19:56:21.900Z",
          "updatedAt": "2023-06-03T19:56:21.900Z"
        }
      },
      "piece4": {
        "piece": {
          "id": 1,
          "player_id": 1,
          "game_id": 1,
          "base_position": 1,
          "enter_position": 51,
          "position": 18,
          "status": "onBoard",
          "left_to_finish": 5,
          "number": 1,
          "createdAt": "2023-06-03T19:56:21.886Z",
          "updatedAt": "2023-06-03T22:03:18.100Z"
        }
      }
    },
    "player2": {
      "piece1": {
        "piece": {
          "id": 6,
          "player_id": 3,
          "game_id": 1,
          "base_position": 14,
          "enter_position": 12,
          "position": 0,
          "status": "home",
          "left_to_finish": 5,
          "number": 2,
          "createdAt": "2023-06-03T21:58:56.198Z",
          "updatedAt": "2023-06-03T21:58:56.198Z"
        }
      },
      "piece2": {
        "piece": {
          "id": 7,
          "player_id": 3,
          "game_id": 1,
          "base_position": 14,
          "enter_position": 12,
          "position": 0,
          "status": "home",
          "left_to_finish": 5,
          "number": 3,
          "createdAt": "2023-06-03T21:58:56.201Z",
          "updatedAt": "2023-06-03T21:58:56.201Z"
        }
      },
      "piece3": {
        "piece": {
          "id": 8,
          "player_id": 3,
          "game_id": 1,
          "base_position": 14,
          "enter_position": 12,
          "position": 0,
          "status": "home",
          "left_to_finish": 5,
          "number": 4,
          "createdAt": "2023-06-03T21:58:56.205Z",
          "updatedAt": "2023-06-03T21:58:56.205Z"
        }
      },
      "piece4": {
        "piece": {
          "id": 5,
          "player_id": 3,
          "game_id": 1,
          "base_position": 14,
          "enter_position": 12,
          "position": 14,
          "status": "safe",
          "left_to_finish": 5,
          "number": 1,
          "createdAt": "2023-06-03T21:58:56.194Z",
          "updatedAt": "2023-06-03T22:05:19.520Z"
        }
      }
    }
  },
  "status": 201
}
```

###  <u> Obtener los usuarios de la base de datos  </u>

**Endpoint:** `GET /users`

**Descripción:** Se obtiene un listado de los usuarios de la base de datos.

#### Parámetros de entrada (request body)

No posee


#### Respuestas

**201 Created**
```json
[
  {
    "id": 1,
    "name": "mejis",
    "email": "imejiass@uc.cl",
    "password": "1234",
    "createdAt": "2023-06-03T18:42:17.283Z",
    "updatedAt": "2023-06-03T18:42:17.283Z"
  },
  {
    "id": 2,
    "name": "fudi",
    "email": "rfuchslocher@uc.cl",
    "password": "5678",
    "createdAt": "2023-06-03T18:42:17.283Z",
    "updatedAt": "2023-06-03T18:42:17.283Z"
  }
]
```

###  <u> Obtener un usuario especifico de la base de datos</u>

**Endpoint:** `GET /users/userId`

**Descripción:** Se obtiene un usuario especifico de la base de datos, detallado en la ruta. 

#### Parámetros de entrada (request body)

No posee


#### Respuestas

**201 Created**

```json
{
  "id": 1,
  "name": "mejis",
  "email": "imejiass@uc.cl",
  "password": "1234",
  "createdAt": "2023-06-03T18:42:17.283Z",
  "updatedAt": "2023-06-03T18:42:17.283Z"
}
```

###  <u> Crear un usuario </u>

**Endpoint:** `POST /users`

**Descripción:** Se crea e inserta un usuario nuevo en la base de datos

#### Parámetros de entrada (request body)

```json
{  
  "name": "Fernando",
  "email": "fsmith@uc.cl",
  "password": "1234"
}
```


#### Respuestas

**201 Created**

```json
{
  "id": 4,
  "name": "Fernando",
  "email": "fsmith@uc.cl",
  "password": "1234",
  "updatedAt": "2023-06-03T23:43:59.464Z",
  "createdAt": "2023-06-03T23:43:59.464Z"
}
```

**400 Bad Request** 

Se manejan los casos en que se intente crear un usuario con un email ya existente. 

```json
{
  "name": "SequelizeUniqueConstraintError",
  "errors": [
    {
      "message": "email must be unique",
      "type": "unique violation",
      "path": "email",
      "value": "fsmith@uc.cl",
      "origin": "DB",
      "instance": {
        "id": null,
        "name": "fernando",
        "email": "fsmith@uc.cl",
        "password": "1234",
        "updatedAt": "2023-06-03T23:45:47.184Z",
        "createdAt": "2023-06-03T23:45:47.184Z"
      },
      "validatorKey": "not_unique",
      "validatorName": null,
      "validatorArgs": []
    }
  ],
  "parent": {
    "length": 204,
    "name": "error",
    "severity": "ERROR",
    "code": "23505",
    "detail": "Key (email)=(fsmith@uc.cl) already exists.",
    "schema": "public",
    "table": "Users",
    "constraint": "Users_email_key",
    "file": "nbtinsert.c",
    "line": "563",
    "routine": "_bt_check_unique",
    "sql": "INSERT INTO \"Users\" (\"id\",\"name\",\"email\",\"password\",\"createdAt\",\"updatedAt\") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING \"id\",\"name\",\"email\",\"password\",\"createdAt\",\"updatedAt\";",
    "parameters": [
      "fernando",
      "fsmith@uc.cl",
      "1234",
      "2023-06-03 23:45:47.184 +00:00",
      "2023-06-03 23:45:47.184 +00:00"
    ]
  },
  "original": {
    "length": 204,
    "name": "error",
    "severity": "ERROR",
    "code": "23505",
    "detail": "Key (email)=(fsmith@uc.cl) already exists.",
    "schema": "public",
    "table": "Users",
    "constraint": "Users_email_key",
    "file": "nbtinsert.c",
    "line": "563",
    "routine": "_bt_check_unique",
    "sql": "INSERT INTO \"Users\" (\"id\",\"name\",\"email\",\"password\",\"createdAt\",\"updatedAt\") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING \"id\",\"name\",\"email\",\"password\",\"createdAt\",\"updatedAt\";",
    "parameters": [
      "fernando",
      "fsmith@uc.cl",
      "1234",
      "2023-06-03 23:45:47.184 +00:00",
      "2023-06-03 23:45:47.184 +00:00"
    ]
  },
  "fields": {
    "email": "fsmith@uc.cl"
  },
  "sql": "INSERT INTO \"Users\" (\"id\",\"name\",\"email\",\"password\",\"createdAt\",\"updatedAt\") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING \"id\",\"name\",\"email\",\"password\",\"createdAt\",\"updatedAt\";"
}
```
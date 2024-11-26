# Rotas da API
### 1. `/anime`
#### GET /anime
Retorna todos os animes registrados no sistema.
- Respostas:
  - `200 OK` Lista de animes.
  ```json
    {
    "code": 200,
    "status": "success",
    "message": null,
    "animes": [
        {
            "id": "id anime",
            "title": "Titulo anime",
            "cover": "Capa do anime",
            "cratedAt": "Data de criação",
            "updateAt": "Data de atualização"
        }
    ]
    }
  ```

### 2. `/auth`
#### `POST /auth/login`
Verifica as credenciais do usuário e gera um token de autenticação.

- Corpo da requisição:
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

- Respostas:
  - `200 OK`: Autenticação bem-sucedida.
    ```json
    {
      "code": 200,
      "status": "success",
      "message": "Usuario logado com sucesso",
      "accessToken": "jwt-token-aqui",
      "user": {
        "user_id": "id do usuario",
        "name": "Nome do usuario",
        "email": "email do usuario",
        "animes": [
            {
                "id": "id anime",
                "title": "Titulo anime",
                "cover": "Capa do anime",
            }
        ]
      }
    }
    ```
    
  - `401 Unauthorized`: Credenciais inválidas.
    ```json
    {
      "code": 401,
      "status": "error",
      "message": "Erro no login"
    }
    ```

`POST /auth/register`
Cria um novo usuário no sistema.

- Corpo da requisição:
```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "password": "minhasenha123",
  "anime_preference": ["id_anime1", "id_anime2", "id_anime3"] // Aqui também aceita uma string normal EX: id_anime1
}
```

- Respostas:
  - `201 Created`: Usuário criado com sucesso.
  ```json
  {
    "code": 201,
    "status": "success",
    "message": "Usuário registrado com sucesso",
  }
  ```

  - `400 Bad Request`: Dados inválidos.
  ```json
  {
    "message": "Erro ao registrar usuário"
  }
  ```

### 3. /user
#### `GET /user`
Retorna os dados do usuário logado.

- Cabeçalho da requisição:
  - Authorization: `Bearer {token}`
 
- Respostas:
  - `200 OK`: Dados do usuário.
  ```json
  {
    "code": 200,
    "status": "success",
    "message": null,
    "uuid": "id do usuario",
    "name": "nome do usuario",
    "email": "example@email.com"
  }
  ```

  - `401 Unauthorized`: Token de autenticação inválido ou ausente.
  ```json
  {
    "message": "Acesso não autorizado"
  }
  ```
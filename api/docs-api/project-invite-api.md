# Project Invite API Documentation

## Base URL

```
/project-invites
```

---

## 1. Create Invite

- **Endpoint:** `POST /project-invites/projects/:projectId/invites`
- **Roles:** ADMIN, PM
- **Request Body:**

```json
{
  "invited_email": ["string (email, max 255)"],
  "role": "PROJECT_ROLE",
  "message": "string (optional, max 1000)"
}
```

- **Response:** `InviteResponseDto`

---

## 2. Get Members By Project

- **Endpoint:** `GET /project-invites/projects/:projectId/members`
- **Roles:** ADMIN, PM
- **Response:** `User[]` (structure depends on implementation)

---

## 3. Get My Invites

- **Endpoint:** `GET /project-invites/my-invites`
- **Roles:** Any
- **Response:** `InviteListResponseDto`

---

## 4. Get Invite By Token

- **Endpoint:** `GET /project-invites/invites/token/:token`
- **Roles:** Any
- **Response:** `InviteResponseDto`

---

## 5. Respond To Invite

- **Endpoint:** `POST /project-invites/invites/:token/respond`
- **Roles:** Any
- **Request Body:**

```json
{
  "action": "INVITE_STATUS"
}
```

- **Response:** `InviteResponseDto`

---

## DTOs

### InviteResponseDto

```json
{
  "id": "string",
  "project": {
    "id": "string",
    "name": "string"
  },
  "invited_by": {
    "id": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "fullName": "string"
  },
  "invited_email": "string",
  "role": "PROJECT_ROLE",
  "status": "INVITE_STATUS",
  "expired_at": "Date",
  "accepted_at": "Date",
  "rejected_at": "Date",
  "message": "string",
  "created_at": "Date"
}
```

### InviteListResponseDto

```json
{
  "data": [InviteResponseDto],
  "total": "number",
  "page": "number",
  "limit": "number",
  "total_pages": "number"
}
```

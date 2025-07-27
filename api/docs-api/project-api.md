# Project API Documentation

## Base URL

```
/projects
```

---

## 1. Create Project

- **Endpoint:** `POST /projects/`
- **Roles:** ADMIN, PM
- **Request Body:**

```json
{
  "name": "string (max 255)",
  "description": "string (max 3000, optional)",
  "tags": "string (optional)",
  "start_date": "ISO date string (optional)",
  "end_date": "ISO date string (optional)"
}
```

- **Response:** `ProjectResponseDto`

---

## 2. Get Projects

- **Endpoint:** `GET /projects/`
- **Roles:** Any
- **Query Params:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "status": "PROJECT_STATUS (optional)",
  "owner_id": "string (optional)",
  "member_id": "string (optional)",
  "page": "string (optional)",
  "limit": "string (optional)"
}
```

- **Response:** `ProjectResponseDto[]`

---

## 3. Get Projects I Am Member Of

- **Endpoint:** `GET /projects/member-of`
- **Roles:** Any
- **Response:**

```json
{
  "data": [ProjectResponseDto]
}
```

---

## 4. Get Project By ID

- **Endpoint:** `GET /projects/:id`
- **Roles:** Any
- **Response:** `ProjectResponseDto`

---

## 5. Get Project Stats

- **Endpoint:** `GET /projects/:id/stats`
- **Roles:** Any
- **Response:** `ProjectStatsResponseDto`

---

## 6. Update Project

- **Endpoint:** `PATCH /projects/:id`
- **Roles:** Any
- **Request Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "tags": "string (optional)",
  "status": "PROJECT_STATUS (optional)",
  "start_date": "ISO date string (optional)",
  "end_date": "ISO date string (optional)"
}
```

- **Response:** `ProjectResponseDto`

---

## 7. Delete Project

- **Endpoint:** `DELETE /projects/:id`
- **Roles:** Any
- **Response:** `204 No Content`

---

## DTOs

### ProjectResponseDto

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "tags": ["string"],
  "status": "PROJECT_STATUS",
  "start_date": "Date",
  "end_date": "Date",
  "owner": {
    "id": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "fullName": "string"
  },
  "created_at": "Date",
  "updated_at": "Date",
  "member_count": "number",
  "invite_count": "number"
}
```

### ProjectStatsResponseDto

```json
{
  "id": "string",
  "name": "string",
  "tags": ["string"],
  "member_count": "number",
  "invite_count": "number",
  "start_date": "Date",
  "end_date": "Date"
}
```

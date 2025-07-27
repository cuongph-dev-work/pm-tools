# Task Backlog API Documentation

## Overview
Task Backlog API cung cấp các endpoint để quản lý tasks, sprints và tags trong hệ thống quản lý dự án.

## Authentication
Tất cả API endpoints yêu cầu JWT Bearer token trong header:
```
Authorization: Bearer <token>
```

## Base URL
```
http://localhost:3000/api
```

---

## Task Management

### 1. Create Task
**POST** `/tasks`

Tạo task mới với thông tin chi tiết.

**Request Body:**
```json
{
  "title": "Thiết kế giao diện đăng nhập",
  "description": "Tạo wireframe và mockup cho trang đăng nhập với các yêu cầu UX/UI hiện đại",
  "type": "TASK",
  "status": "TODO",
  "priority": "HIGH",
  "estimate": 8,
  "due_date": "2024-01-15T00:00:00.000Z",
  "assignee_id": "user_id_here",
  "project_id": "project_id_here",
  "sprint_ids": ["sprint_id_1", "sprint_id_2"],
  "tag_ids": ["tag_id_1", "tag_id_2"],
  "parent_task_id": "parent_task_id_here"
}
```

**Response (201):**
```json
{
  "id": "task_id",
  "title": "Thiết kế giao diện đăng nhập",
  "description": "Tạo wireframe và mockup cho trang đăng nhập với các yêu cầu UX/UI hiện đại",
  "type": "TASK",
  "status": "TODO",
  "priority": "HIGH",
  "estimate": 8,
  "due_date": "2024-01-15T00:00:00.000Z",
  "assignee": {
    "id": "user_id",
    "email": "user@example.com",
    "first_name": "Nguyễn Văn",
    "last_name": "A",
    "fullName": "Nguyễn Văn A"
  },
  "sprints": [
    {
      "id": "sprint_id",
      "name": "Sprint 1 - Authentication",
      "description": "Sprint đầu tiên cho tính năng xác thực"
    }
  ],
  "project_id": "project_id",
  "tags": [
    {
      "id": "tag_id",
      "name": "Frontend",
      "description": "Frontend development"
    }
  ],
  "created_by": {
    "id": "user_id",
    "email": "creator@example.com",
    "fullName": "Creator Name"
  },
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Tasks
**GET** `/tasks`

Lấy danh sách tasks với filter, search và pagination.

**Query Parameters:**
- `search` (optional): Tìm kiếm theo title hoặc description
- `type` (optional): Filter theo loại task (TASK, BUG, FEATURE, etc.)
- `status` (optional): Filter theo trạng thái (TODO, IN_PROGRESS, DONE, etc.)
- `priority` (optional): Filter theo độ ưu tiên (LOW, MEDIUM, HIGH, CRITICAL)
- `assignee_id` (optional): Filter theo người thực hiện
- `sprint_id` (optional): Filter theo sprint
- `project_id` (optional): Filter theo project
- `tag_id` (optional): Filter theo tag
- `parent_task_id` (optional): Filter theo parent task
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng items per page (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "task_id",
      "title": "Thiết kế giao diện đăng nhập",
      "description": "Tạo wireframe và mockup cho trang đăng nhập",
      "type": "TASK",
      "status": "TODO",
      "priority": "HIGH",
      "estimate": 8,
      "due_date": "2024-01-15T00:00:00.000Z",
      "assignee": {
        "id": "user_id",
        "fullName": "Nguyễn Văn A"
      },
      "sprints": [
        {
          "id": "sprint_id",
          "name": "Sprint 1 - Authentication"
        }
      ],
      "project_id": "project_id",
      "tags": [
        {
          "id": "tag_id",
          "name": "Frontend"
        }
      ],
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

### 3. Get Task by ID
**GET** `/tasks/{id}`

Lấy chi tiết task theo ID.

**Response (200):**
```json
{
  "id": "task_id",
  "title": "Thiết kế giao diện đăng nhập",
  "description": "Tạo wireframe và mockup cho trang đăng nhập",
  "type": "TASK",
  "status": "TODO",
  "priority": "HIGH",
  "estimate": 8,
  "due_date": "2024-01-15T00:00:00.000Z",
  "assignee": {
    "id": "user_id",
    "fullName": "Nguyễn Văn A"
  },
  "sprints": [
    {
      "id": "sprint_id",
      "name": "Sprint 1 - Authentication"
    }
  ],
  "project_id": "project_id",
  "tags": [
    {
      "id": "tag_id",
      "name": "Frontend"
    }
  ],
  "parent_task": null,
  "sub_tasks": [],
  "created_by": {
    "id": "user_id",
    "fullName": "Creator Name"
  },
  "updated_by": {
    "id": "user_id",
    "fullName": "Updater Name"
  },
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Task
**PUT** `/tasks/{id}`

Cập nhật thông tin task.

**Request Body:**
```json
{
  "title": "Thiết kế giao diện đăng nhập - Updated",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "estimate": 12,
  "assignee_id": "new_assignee_id",
  "sprint_ids": ["new_sprint_id"],
  "tag_ids": ["new_tag_id"]
}
```

**Response (200):**
```json
{
  "id": "task_id",
  "title": "Thiết kế giao diện đăng nhập - Updated",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "estimate": 12,
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

### 5. Delete Task
**DELETE** `/tasks/{id}`

Xóa task (chỉ xóa được task không có sub-tasks).

**Response (204):** No Content

### 6. Get Tasks by Project
**GET** `/tasks/project/{projectId}`

Lấy danh sách tasks theo project.

**Response (200):**
```json
[
  {
    "id": "task_id",
    "title": "Task 1",
    "status": "TODO",
    "priority": "HIGH"
  }
]
```

### 7. Get Tasks by Sprint
**GET** `/tasks/sprint/{sprintId}`

Lấy danh sách tasks theo sprint.

**Response (200):**
```json
[
  {
    "id": "task_id",
    "title": "Task 1",
    "status": "TODO",
    "priority": "HIGH"
  }
]
```

### 8. Get Tasks by Assignee
**GET** `/tasks/assignee/{assigneeId}`

Lấy danh sách tasks theo người thực hiện.

**Response (200):**
```json
[
  {
    "id": "task_id",
    "title": "Task 1",
    "status": "TODO",
    "priority": "HIGH"
  }
]
```

---

## Sprint Management

### 1. Create Sprint
**POST** `/sprints`

Tạo sprint mới.

**Request Body:**
```json
{
  "name": "Sprint 1 - Authentication",
  "description": "Sprint đầu tiên cho tính năng xác thực",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-01-15T00:00:00.000Z",
  "project_id": "project_id_here"
}
```

**Response (201):**
```json
{
  "id": "sprint_id",
  "name": "Sprint 1 - Authentication",
  "description": "Sprint đầu tiên cho tính năng xác thực",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-01-15T00:00:00.000Z",
  "project_id": "project_id",
  "tasks": [],
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Sprints
**GET** `/sprints`

Lấy danh sách sprints với filter và pagination.

**Query Parameters:**
- `search` (optional): Tìm kiếm theo name hoặc description
- `project_id` (optional): Filter theo project
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng items per page (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "sprint_id",
      "name": "Sprint 1 - Authentication",
      "description": "Sprint đầu tiên cho tính năng xác thực",
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-01-15T00:00:00.000Z",
      "project_id": "project_id",
      "tasks": [
        {
          "id": "task_id",
          "title": "Task 1",
          "status": "TODO"
        }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

### 3. Get Sprint by ID
**GET** `/sprints/{id}`

Lấy chi tiết sprint theo ID.

**Response (200):**
```json
{
  "id": "sprint_id",
  "name": "Sprint 1 - Authentication",
  "description": "Sprint đầu tiên cho tính năng xác thực",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-01-15T00:00:00.000Z",
  "project_id": "project_id",
  "tasks": [
    {
      "id": "task_id",
      "title": "Task 1",
      "status": "TODO",
      "priority": "HIGH"
    }
  ],
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Sprint
**PUT** `/sprints/{id}`

Cập nhật thông tin sprint.

**Request Body:**
```json
{
  "name": "Sprint 1 - Authentication - Updated",
  "end_date": "2024-01-20T00:00:00.000Z"
}
```

**Response (200):**
```json
{
  "id": "sprint_id",
  "name": "Sprint 1 - Authentication - Updated",
  "end_date": "2024-01-20T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

### 5. Delete Sprint
**DELETE** `/sprints/{id}`

Xóa sprint.

**Response (204):** No Content

### 6. Get Sprints by Project
**GET** `/sprints/project/{projectId}`

Lấy danh sách sprints theo project.

**Response (200):**
```json
[
  {
    "id": "sprint_id",
    "name": "Sprint 1 - Authentication",
    "tasks": [
      {
        "id": "task_id",
        "title": "Task 1"
      }
    ]
  }
]
```

---

## Tag Management

### 1. Create Tag
**POST** `/tags`

Tạo tag mới.

**Request Body:**
```json
{
  "name": "Frontend",
  "description": "Frontend development tasks"
}
```

**Response (201):**
```json
{
  "id": "tag_id",
  "name": "Frontend",
  "description": "Frontend development tasks",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Tags
**GET** `/tags`

Lấy danh sách tags với search và pagination.

**Query Parameters:**
- `search` (optional): Tìm kiếm theo name hoặc description
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng items per page (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "tag_id",
      "name": "Frontend",
      "description": "Frontend development tasks",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

### 3. Get Tag by ID
**GET** `/tags/{id}`

Lấy chi tiết tag theo ID.

**Response (200):**
```json
{
  "id": "tag_id",
  "name": "Frontend",
  "description": "Frontend development tasks",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Tag
**PUT** `/tags/{id}`

Cập nhật thông tin tag.

**Request Body:**
```json
{
  "name": "Frontend Development",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": "tag_id",
  "name": "Frontend Development",
  "description": "Updated description",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

### 5. Delete Tag
**DELETE** `/tags/{id}`

Xóa tag.

**Response (204):** No Content

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Bad request",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Task not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Tag with this name already exists",
  "error": "Conflict"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Data Types

### Task Types
- `TASK`: Task thông thường
- `CHANGE_REQUEST`: Yêu cầu thay đổi
- `FEEDBACK`: Phản hồi
- `NEW_FEATURE`: Tính năng mới
- `SUB_TASK`: Task con
- `IMPROVEMENT`: Cải tiến
- `BUG`: Lỗi
- `BUG_CUSTOMER`: Lỗi từ khách hàng
- `LEAKAGE`: Lỗi bỏ sót

### Task Status
- `TODO`: Cần làm
- `IN_PROGRESS`: Đang thực hiện
- `DONE`: Hoàn thành
- `BLOCKED`: Bị chặn
- `REVIEW`: Đang review
- `CANCELLED`: Đã hủy

### Task Priority
- `LOW`: Thấp
- `MEDIUM`: Trung bình
- `HIGH`: Cao
- `CRITICAL`: Khẩn cấp 

# Database Entities

## Project Management Entities

### Project Entity

- **Table**: `project`
- **Purpose**: Lưu trữ thông tin cơ bản của project
- **Fields**:
  - `name`: Tên project (required)
  - `description`: Mô tả project (optional)
  - `owner`: Chủ sở hữu project (FK to User)
  - `status`: Trạng thái project (ACTIVE, INACTIVE, COMPLETED, CANCELLED)
  - `start_date`: Ngày bắt đầu project (optional)
  - `end_date`: Ngày kết thúc project (optional)

### Project Member Entity

- **Table**: `project_member`
- **Purpose**: Quản lý thành viên trong project với role cụ thể
- **Fields**:
  - `project`: Reference đến Project (FK)
  - `user`: Reference đến User (FK)
  - `role`: Role của thành viên trong project (OWNER, PROJECT_MANAGER, DEVELOPER, QA, QC, BRSE_COMTOR)
  - `status`: Trạng thái thành viên (ACTIVE, INACTIVE, LEFT)
  - `joined_at`: Ngày tham gia project
  - `left_at`: Ngày rời project (optional)
- **Constraints**: Unique constraint trên (project_id, user_id)

### Project Invite Member Entity

- **Table**: `project_invite_member`
- **Purpose**: Quản lý lời mời tham gia project
- **Fields**:
  - `project`: Reference đến Project (FK)
  - `invited_by`: User gửi lời mời (FK to User)
  - `invited_email`: Email của người được mời
  - `role`: Role sẽ được gán khi tham gia
  - `token`: Token duy nhất để xác thực lời mời
  - `status`: Trạng thái lời mời (PENDING, ACCEPTED, REJECTED, EXPIRED)
  - `expired_at`: Thời gian hết hạn lời mời
  - `accepted_at`: Thời gian chấp nhận (optional)
  - `rejected_at`: Thời gian từ chối (optional)
  - `message`: Tin nhắn kèm theo lời mời (optional)
- **Constraints**:
  - Unique constraint trên token
  - Unique constraint trên (project_id, invited_email)

## Enums

### PROJECT_ROLE

- `OWNER`: Chủ sở hữu project
- `PROJECT_MANAGER`: Quản lý project
- `DEVELOPER`: Lập trình viên
- `QUALITY_ASSURANCE`: Đảm bảo chất lượng
- `QUALITY_CONTROL`: Kiểm soát chất lượng
- `BRSE_COMTOR`: Bridge Software Engineer

### PROJECT_STATUS

- `ACTIVE`: Đang hoạt động
- `INACTIVE`: Không hoạt động
- `COMPLETED`: Đã hoàn thành
- `CANCELLED`: Đã hủy

### INVITE_STATUS

- `PENDING`: Đang chờ phản hồi
- `ACCEPTED`: Đã chấp nhận
- `REJECTED`: Đã từ chối
- `EXPIRED`: Đã hết hạn

### MEMBER_STATUS

- `ACTIVE`: Đang hoạt động
- `INACTIVE`: Không hoạt động
- `LEFT`: Đã rời project

## Relationships

### User Entity

- `owned_projects`: Danh sách project mà user sở hữu
- `project_memberships`: Danh sách project mà user tham gia
- `sent_invitations`: Danh sách lời mời mà user đã gửi

### Project Entity

- `owner`: Chủ sở hữu project
- `members`: Danh sách thành viên trong project
- `invites`: Danh sách lời mời project

## Usage Examples

### Tạo project mới

```typescript
const project = new Project();
project.name = 'My Project';
project.description = 'Project description';
project.owner = user;
project.status = PROJECT_STATUS.ACTIVE;
```

### Thêm thành viên vào project

```typescript
const member = new ProjectMember();
member.project = project;
member.user = user;
member.role = PROJECT_ROLE.DEVELOPER;
member.status = MEMBER_STATUS.ACTIVE;
```

### Tạo lời mời tham gia project

```typescript
const invite = new ProjectInviteMember();
invite.project = project;
invite.invited_by = currentUser;
invite.invited_email = 'user@example.com';
invite.role = PROJECT_ROLE.DEVELOPER;
invite.token = generateToken();
invite.expired_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
```

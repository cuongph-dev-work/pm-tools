# Yêu cầu So sánh Hình ảnh

Bạn được cung cấp hai hình ảnh đầu vào: **image\_A** và **image\_B**.

## Đặc điểm của hình ảnh đầu vào

* **Cùng khung nhìn (viewport):** Cả hai hình ảnh được chụp hoặc tạo ra từ cùng một góc nhìn hoặc khu vực hiển thị.
* **Cùng định dạng:** Cả hai hình ảnh có cùng định dạng tệp (ví dụ: PNG, JPEG, v.v.).

---

## Mục tiêu

Phân tích và so sánh image\_A và image\_B để xác định sự khác biệt và mức độ tương đồng giữa chúng.

### Các yếu tố cần xem xét khi so sánh (nếu có thể áp dụng)

* Thay đổi về pixel (màu sắc, vị trí).
* Thêm hoặc xóa các đối tượng.
* Thay đổi kích thước hoặc hình dạng của các đối tượng hiện có.
* Thay đổi văn bản.

---

## Quy Trình

SSIM + pixel-diff + AI prompt

---

## Đầu ra mong muốn

Một đối tượng **JSON** có định dạng như sau:

```json
{
  "diff": "string",
  "matchRate": "number"
}
```

### Mô tả các trường trong JSON

* **diff**: Một chuỗi mô tả ngắn gọn và rõ ràng về những điểm khác biệt chính giữa image\_A và image\_B. Nếu không có sự khác biệt đáng kể, hãy ghi "Không có sự khác biệt đáng kể.";
* **matchRate**: Một số thực (float) từ 0 đến 1, biểu thị tỷ lệ phần trăm giống nhau giữa hai hình ảnh.

**Lưu ý**: Nội dung diff hãy trả lời bằng tiếng Việt.

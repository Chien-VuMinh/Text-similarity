# Xây dựng hệ thống tương đồng đa văn bản
Đề tài tốt nghiệp **“Xây dựng hệ thống phát hiện tương đồng đa văn bản”** tập trung vào việc xây dựng một hệ thống cho phép người dùng tải lên văn bản cần kiểm tra và so sánh với một cơ sở dữ liệu văn bản có sẵn hoặc dữ liệu do người dùng tải lên, với trọng tâm tối ưu cho ngôn ngữ tiếng Việt cũng như hỗ trợ song ngữ (Việt-Anh). Hệ thống hướng tới việc phát hiện các cặp câu có nội dung tương đồng về mặt ý nghĩa, phục vụ trực tiếp cho bài toán kiểm tra đạo văn và phân tích nội dung. Cụ thể:
-	Xây dựng hệ thống phát hiện tương đồng văn bản đa cấp độ:
    - Cấp độ câu/văn bản
    - Cấp độ tài liệu
    - Cấp độ cơ sở dữ liệu
-	Ứng dụng nhiều mô hình embedding hiện đại trong Xử lý ngôn ngữ tự nhiên nhằm thử nghiệm và so sánh để đánh giá hiệu quả trong bài toán phát hiện tương đồng văn bản.
-	Thiết kế hệ thống cho phép người dùng tải lên văn bản hoặc so sánh với cơ sở dữ liệu văn bản có sẵn, kết hợp xử lý bất đồng bộ để cải thiện hiệu suất, nhằm phục vụ trực tiếp cho bài toán phát hiện đạo văn. 



---

### Thiết kế hệ thống



---
### Tính năng chính
- **Hệ thống hỗ trợ phát hiện tương đồng 3 cấp độ**: Cấp độ câu/văn bản, tài liệu, cơ sở dữ liệu
- **Giao diện người dùng**: Hiển thị kết quả qua highlight các cặp câu tương đồng, hiển thị biểu đồ số liệu thống kê
- **Local/Remote Embedding**: Hỗ trợ đa dạng mô hình embedding từ open-source đến mô hình trả phí như Gemini
- **Hỗ trợ song ngữ**: Hỗ trợ phân tích dữ liệu tiếng Anh lẫn tiếng Việt
- **Bảo mật**: Sử dụng API nội bộ để giao tiếp giữa front-end và back-end Python


---

### Yêu cầu hệ thống

- **Python**: Phiên bản 3.12.10
- **Ollama**: Phiên bản 0.11.7 dùng để host mô hình embedding
- **Node.js**: Phiên bản v22.19.0
- **Vector DB**: e.g., Pinecone (cloud) hoặc Chromadb (local) để lưu embeddings
- **Biến môi trường**: Cài đặt file .env cho cả NestJS và Python (ví dụ: API keys cho mô hình Gemini, Python API URL).
---

### Cài đặt

**Python Back-end**

1. Clone repository:
    ```bash
    git clone https://github.com/Chien-VuMinh/Text-similarity
    cd Text-similarity/back-end
    ```

2. Cài đặt thư viện:
    ```bash
    pip install uv
    uv init
    uv venv
    uv pip install -r requirements.txt
    ```

3. Cấu hình file .env

**React Front-end**

1. 
    ```bash
    cd ../front-end
    ```

2. Cài đặt thư viện:
    ```bash
    pnpm install
    ```

3. Cấu hình file .env

---

### Cách chạy chương trình

**Khởi động Python Back-end**
- Mở thư mục `back-end` và chạy:

    ```bash
    uv run python -m uvicorn main:app --reload
    ```

- Câu lệnh này dùng để chạy FastAPI server cho back-end trên localhost:8000.


**Khởi động React Front-end**
- Mở thư mục `front-end` và chạy:
    ```bash
    pnpm run dev
    ```

- Câu lệnh dùng để khởi chạy web front-end.


---
### Các mô hình sử dụng

- **BGE-M3**: Là mô hình nổi bật nhất trong số các mô hình embedding open-source hiện nay với khả năng hỗ trợ đa ngôn ngữ cực tốt nhưng lại cực kỳ gọn nhẹ
-	**Qwen3-Embedding**: Dòng mô hình mới nhất từ đội ngũ Qwen (Alibaba), được xây dựng trên nền tảng Qwen3
-	**Snowflake-Arctic-Embed2**: Đây là mô hình từ Snowflake, được tối ưu hóa cho các hệ thống RAG (Retrieval-Augmented Generation) doanh nghiệp
-	**Nomic-Embed-Text-v2-MoE**: Là mô hình mã nguồn mở đầu tiên hỗ trợ context window lên tới 8k token và có hiệu năng truy vấn đa ngôn ngữ rất tốt, sử dụng kiến trúc Mixture of Experts (MoE) để tối ưu hóa tài nguyên
-	**Gemini**: Là mô hình text embedding do Google/Google DeepMind phát triển trong hệ sinh thái Gemini, hỗ trợ hơn 100 ngôn ngữ (bao gồm cả tiếng Việt)

---

### Ngôn ngữ hỗ trợ

Hỗ trợ phân tích cả tiếng Anh và tiếng Việt

---

### Cách sử dụng



---

### Cải tiến trong tương lai

- Integrate Queue System (Celery + RabbitMQ) for high concurrency.
- Support more languages/models.
- Cronjob for automatically analyze and label queries for future analytical purposes.
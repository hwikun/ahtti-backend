# ahtti-backend

한일 커뮤니티 사이트

### 개발 목표

한국과 일본의 문화교류를 지향하는 최대 규모(를 목표)의 커뮤니티 사이트

### 사용기술

Backend: Nest.JS
Frontend: 미정
DB: PostgreSQL

### Advanced Features

- [ ] User CRUD

  - [ ] User Role: (비회원)회원 / 관리자
  - [ ] Comments
  - [ ] Likes
  - [x] 로그인 정보 암호화
    - [x] email, username -> AES256
    - [x] password -> bcrypt
  - [ ] 로그인 JWT 인증

- [ ] Post CRUD
  - [ ] 회원만 글쓰기, 댓글, 라이크 가능
  - [ ] 작성자만 수정 및 삭제가능
  - [ ] subject, content, img, etc ...

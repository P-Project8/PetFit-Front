### 이메일 인증 - 이메일 인증 발송 및 검증 API

### Request URL: http://43.200.89.199:8080

## POST

# /api/email/verification/verify - 이메일 인증 코드 검증

6자리 인증 코드를 사용하여 이메일 인증을 검증합니다. 코드는 5분간 유효하며, 최대 5회까지 시도할 수 있습니다.

Request body:
{
"email": "user@example.com",
"verificationCode": "153226"
}

response:
200:
{
"verified": true,
"expiresInSec": 0
}
400:
{
"timestamp": "2025-12-06T05:48:15.978Z",
"code": "string",
"message": "string",
"result": "string"
}

# /api/email/verification/send - 이메일 인증 코드 발송

회원가입용 이메일 인증 6자리 코드를 발송합니다. 쿨다운 및 일일 발송 제한이 적용됩니다.

Request body:
{
"email": "user@example.com"
}

response:
{
"timestamp": "2025-12-06T05:50:32.476Z",
"code": "string",
"message": "string",
"result": "string"
}

### 인증 관리 - 사용자 인증, 회원가입, 로그인, 로그아웃

## POST

# /api/auth/verify

response:
{
"timestamp": "2025-12-06T05:55:07.892Z",
"code": "string",
"message": "string",
"result": "string"
}

# /api/auth/signup - 회원가입

새로운 사용자를 등록합니다. userId는 고유해야 하며, 이메일도 중복되지 않아야 합니다.
request body:
{
"email": "user@example.com",
"userId": "string",
"password": "string",
"name": "string",
"birth": "string"
}
response:
{
"timestamp": "2025-12-06T05:56:20.824Z",
"code": "string",
"message": "string",
"result": "string"
}

# /api/auth/reissue - 토큰 재발급

refresh token을 사용하여 새로운 access token을 발급받습니다.
request body:
{
"refreshToken": "string"
}
response:
200:
{
"accessToken": "string",
"refreshToken": "string"
}
400,401:
{
"timestamp": "2025-12-06T05:57:00.647Z",
"code": "string",
"message": "string",
"result": "string"
}

# /api/auth/login - 로그인

userId와 password를 사용하여 로그인합니다. 성공 시 access token과 refresh token을 반환합니다.
request body:
{
"userId": "kacorn",
"password": "1234"
}
response:
200:
{
"timestamp": "2025-12-06T06:00:51.725292931",
"code": "COMMON200",
"message": "요청에 성공하였습니다.",
"result": {
"accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NjUwMDA4NTEsImV4cCI6MTc2NTAwMTc1MSwic3ViIjoiQWNjZXNzVG9rZW4iLCJpZCI6ImthY29ybiJ9.6ia7jo-LEaqC_hUyzHrukN6TR4c4eStPAB6MvoDmkmE",
"refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NjUwMDA4NTEsImV4cCI6MTc2NjIxMDQ1MSwic3ViIjoiUmVmcmVzaFRva2VuIiwiaWQiOiJrYWNvcm4ifQ.AGFcFb_HbhwlZk7hg2wjDEwE9V9YX8BAaeNJ_UzuM70"
}
}
401:
{
"timestamp": "2025-12-06T05:58:01.459Z",
"code": "string",
"message": "string",
"result": "string"
}

## DELETE

# /api/auth/logout

현재 사용자를 로그아웃하고 access token을 블랙리스트에 추가합니다.

response:
{
"timestamp": "2025-12-06T05:54:05.587Z",
"code": "string",
"message": "string",
"result": "string"
}

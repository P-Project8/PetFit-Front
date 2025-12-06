### 사용자 프로필 - 사용자 프로필 조회 및 수정 API

## GET

# /api/auth/profile

현재 로그인한 사용자의 상세 프로필 정보를 조회합니다.
response:
{
"timestamp": "2025-12-05T11:53:37.887732409",
"code": "COMMON200",
"message": "요청에 성공하였습니다.",
"result": {
"userId": "kacorn",
"email": "tjdwo2323@naver.com",
"name": "박성재",
"birth": "2000-12-22"
}
}
401,404:
{
"timestamp": "2025-12-06T07:47:16.504Z",
"code": "string",
"message": "string",
"result": "string"
}

## PATCH

# /api/auth/profile

사용자의 프로필 정보를 수정합니다. 비밀번호 변경시 현재 비밀번호 확인이 필요합니다.
request body:
{
"name": "string",
"birth": "string",
"currentPassword": "string",
"newPassword": "string",
"passwordChangeValid": true
}
response:
200:
{
"userId": "string",
"email": "string",
"name": "string",
"birth": "string"
}
400,401,404:
{
"timestamp": "2025-12-06T07:48:57.518Z",
"code": "string",
"message": "string",
"result": "string"
}
